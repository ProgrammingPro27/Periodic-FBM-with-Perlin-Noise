let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let perlin = new Perlin();
perlin.seed();

let w = 256;
canvas.width = canvas.height = w;
let numOfPoints = 5;

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
    return total;
}

function createFBMTexture() {
    let imageData = ctx.createImageData(w, w);
    for (let y = 0; y < w; y++) {
        for (let x = 0; x < w; x++) {
            let index = (y * w + x) * 4;
            let v = (fbm(x * numOfPoints / w, y * numOfPoints / w, numOfPoints) / 2 + 0.5) * 255;
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
