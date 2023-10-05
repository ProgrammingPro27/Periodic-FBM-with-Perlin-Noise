
// Calculate distance between two points with periodic boundary conditions
function distanceWithPeriodicBoundaries(x1, y1, x2, y2, width, height) {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    const dx_wrap = Math.min(dx, width - dx);
    const dy_wrap = Math.min(dy, height - dy);
    return Math.sqrt(dx_wrap * dx_wrap + dy_wrap * dy_wrap);;
}

// function getDistance(x1, y1, x2, y2) {
//     let y = x2 - x1;
//     let x = y2 - y1;
// 
//     return Math.sqrt(x * x + y * y);
// }

function map(value, start1, stop1, start2, stop2) {
    // First, normalize the value to a range between 0 and 1.
    const normalizedValue = (value - start1) / (stop1 - start1);

    // Then, map the normalized value to the second range.
    return start2 + normalizedValue * (stop2 - start2);
}


let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let w = 256;
canvas.width = canvas.height = w;
const numPoints = 15;
const points = [];

// Generate random points for Worley noise
for (let i = 0; i < numPoints; i++) {
    points.push({ x: Math.random() * w, y: Math.random() * w });
}

let perlin = new Perlin();
perlin.seed();

let octaves = 5;
let lacunarity = 2;
let gain = 0.5;

// Calculate Worley noise with seamless tiling
function calculateWorleyNoise(x, y) {
    let distances = [];
    for (let k = 0; k < points.length; k++) {
        distances.push(distanceWithPeriodicBoundaries(x, y, points[k].x, points[k].y, w, w));
    }
    let sorted = distances.sort((a, b) => a - b);
    return map(sorted[0], 0, 50, 255, 0);
}

function fbm(x, y, octaves, lacunarity, gain) {
    let total = 0;
    let amplitude = 1;
    let frequency = 5;
    let numOfPoints = frequency;

    for (let i = 0; i < octaves; i++) {
        total += perlin.get(x / w * frequency, y / w * frequency, numOfPoints) * amplitude;
        frequency *= lacunarity;
        amplitude *= gain;
    }
    return total;
}

function combinedNoise(x, y) {
    // Adjust these weights to control the contribution of each noise type
    const worleyWeight = 0.6;
    const fbmWeight = 0.4;

    const worleyValue = calculateWorleyNoise(x, y);
    const fbmValue = (fbm(x, y, octaves, lacunarity, gain) / 2 + 0.5) * 255;

    return (worleyValue * worleyWeight + fbmValue * fbmWeight) / (worleyWeight + fbmWeight);
}

const imageData = ctx.createImageData(w, w);
const data = imageData.data;

const colorStops = [
    { stop: -150, color: { r: 255, g: 0, b: 255 } },
    { stop: 50, color: { r: 0, g: 0, b: 0 } },
    { stop: 90, color: { r: 255, g: 0, b: 0 } },    // Red for noiseValue < 60
    { stop: 120, color: { r: 0, g: 0, b: 0 } },    // Blue for noiseValue between 60 and 80
    { stop: 255, color: { r: 255, g: 0, b: 255 } } // White for noiseValue >= 130
];

for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
        let index = (y * w + x) * 4;
        let noiseValue = combinedNoise(x, y);

        // Initialize the RGB color
        let rgb = { r: 0, g: 0, b: 0 };

        // Loop through the color stops to interpolate the color
        for (let i = 0; i < colorStops.length - 1; i++) {
            const prevStop = colorStops[i].stop;
            const nextStop = colorStops[i + 1].stop;
            const prevColor = colorStops[i].color;
            const nextColor = colorStops[i + 1].color;

            if (noiseValue >= prevStop && noiseValue <= nextStop) {
                // Interpolate the color based on noiseValue
                const t = (noiseValue - prevStop) / (nextStop - prevStop);
                rgb.r = Math.round(prevColor.r + t * (nextColor.r - prevColor.r));
                rgb.g = Math.round(prevColor.g + t * (nextColor.g - prevColor.g));
                rgb.b = Math.round(prevColor.b + t * (nextColor.b - prevColor.b));
                break; // No need to check further stops
            }
        }

        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
    }
}

ctx.putImageData(imageData, 0, 0);