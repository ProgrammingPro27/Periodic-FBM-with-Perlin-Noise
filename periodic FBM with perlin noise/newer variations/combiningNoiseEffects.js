
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

for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
        let index = (y * w + x) * 4;
        let noiseValue = combinedNoise(x, y);
        data[index] = noiseValue;
        data[index + 1] = noiseValue;
        data[index + 2] = noiseValue;
        data[index + 3] = 255;
    }
}

ctx.putImageData(imageData, 0, 0);