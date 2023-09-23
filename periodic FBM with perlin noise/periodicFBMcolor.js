let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let perlin = new Perlin();
perlin.seed();

let w = 256;
canvas.width = canvas.height = w;
let numOfPoints = 5;

// interesting green texture
// const colorStops = [
//     { value: 0.0, color: { r: 0, g: 0, b: 0 } },
//     { value: 0.5, color: { r: 50, g: 50, b: 50 } },
//     { value: 0.6, color: { r: 0, g: 255, b: 0 } },
//     { value: 0.7, color: { r: 30, g: 0, b: 0 } },
//     { value: 1, color: { r: 0, g: 255, b: 0 } }
// ];

// fire explosion
// const colorStops = [
//     { value: 0.0, color: { r: 0, g: 0, b: 0 } },
//     { value: 0.5, color: { r: 255, g: 0, b: 0 } },
//     { value: 0.6, color: { r: 255, g: 255, b: 0 } },
//     { value: 0.7, color: { r: 255, g: 0, b: 0 } },
//     { value: 1, color: { r: 0, g: 0, b: 0 } }
// ];

const colorStops = [
    { value: 0.0, color: { r: 0, g: 0, b: 0 } },
    { value: 0.5, color: { r: 255, g: 0, b: 0 } },
    { value: 0.6, color: { r: 255, g: 255, b: 255 } },
    { value: 0.7, color: { r: 255, g: 0, b: 0 } },
    { value: 1, color: { r: 0, g: 0, b: 0 } }
];

function getColorFromValue(value) {
    let lowerStop, upperStop;
    for (let i = 0; i < colorStops.length; i++) {
        if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
            lowerStop = colorStops[i];
            upperStop = colorStops[i + 1];
        }
    }
    // Interpolate between the two color stops based on the noise value.
    const t = (value - lowerStop.value) / (upperStop.value - lowerStop.value);

    return [Math.round(lowerStop.color.r + t * (upperStop.color.r - lowerStop.color.r)),
    Math.round(lowerStop.color.g + t * (upperStop.color.g - lowerStop.color.g)),
    Math.round(lowerStop.color.b + t * (upperStop.color.b - lowerStop.color.b))]
}

let octaves = 5;
let lacunarity = 5.0; //lacunarity must be integer, not float (it ruins periodic effect) !
let gain = 0.2;

function fbm(x, y, period) {
    let total = 0;

    let amplitude = 1.5;
    let frequency = 1; //frequency must be integer, not float (it ruins periodic effect) !

    for (let i = 0; i < octaves; i++) {
        total += amplitude * perlin.get(frequency * x, frequency * y, period);
        frequency *= lacunarity;
        amplitude *= gain;
    }

    return total
}

function createPerlinTexture() {
    let imageData = ctx.createImageData(w, w);
    for (let y = 0; y < w; y++) {
        for (let x = 0; x < w; x++) {
            let index = (y * w + x) * 4;
            let val = getColorFromValue((fbm(x * numOfPoints / w, y * numOfPoints / w, numOfPoints) / 2 + 0.5));
            imageData.data[index] = val[0];
            imageData.data[index + 1] = val[1];
            imageData.data[index + 2] = val[2];
            imageData.data[index + 3] = 255;
        }
    }
    return imageData;
}

function render() {
    let imageData = createPerlinTexture();
    ctx.putImageData(imageData, 0, 0);
}
render();
