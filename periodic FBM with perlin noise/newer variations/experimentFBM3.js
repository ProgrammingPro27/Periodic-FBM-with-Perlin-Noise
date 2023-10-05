let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let perlin = new Perlin();
perlin.seed();

let w = 256;
canvas.width = canvas.height = w;
let numOfPoints = 8;

let octaves = 5;
let lacunarity = 5.0;
let gain = 0.2;

function domainWarp(x, y, amplitude, frequency, period) {
    // Domain warping using Perlin noise
    let warpX = Math.abs(perlin.get(frequency * x, frequency * y, period));
    let warpY = Math.abs(perlin.get(frequency * x, frequency * y, period)); // Offset the period for Y
    x += amplitude * warpX;
    y += amplitude * warpY;
    return [x, y];
}

function fbm(x, y, period) {
    let total = 0;

    let amplitude = 1.5;
    let frequency = 1;

    for (let i = 0; i < octaves; i++) {
        let warpedCoords = domainWarp(x, y, amplitude, frequency, period);
        //  let warpedCoords2 = domainWarp(warpedCoords[0], warpedCoords[1], amplitude, frequency, period);
        x = warpedCoords[0];
        y = warpedCoords[1];

        total += amplitude * Math.abs(perlin.get(x, y, period));

        frequency *= lacunarity;
        amplitude *= gain;
    }
    return total;
}

function createFBMTexture() {
    let imageData = ctx.createImageData(w, w);
    for (let y = 0; y < w; y++) {
        for (let x = 0; x < w; x++) {
            let index = (y * w + x) * 4;
            let v = (fbm(x * numOfPoints / w, y * numOfPoints / w, numOfPoints)) * 255;
            imageData.data[index] = v;
            imageData.data[index + 1] = v;
            imageData.data[index + 2] = v;
            imageData.data[index + 3] = 255;
        }
    }
    return imageData;
}

function render() {
    let imageData = createFBMTexture();
    ctx.putImageData(imageData, 0, 0);
}
render();