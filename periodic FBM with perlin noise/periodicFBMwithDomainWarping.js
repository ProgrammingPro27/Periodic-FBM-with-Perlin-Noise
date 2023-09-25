let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let w = 256;
canvas.width = canvas.height = w;

let perlin = new Perlin();
perlin.seed();

let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height)
let data = imgdata.data

let octaves = 3
let lacunarity = 2
let gain = 0.5

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

function pattern(x, y, octaves, lacunarity, gain) {
    let q = [
        Math.abs(fbm(x, y, octaves, lacunarity, gain)),
        Math.abs(fbm(x + 5.2, y + 1.3, octaves, lacunarity, gain)),
    ];

    return fbm(x + 80.0 * q[0], y + 80.0 * q[1], octaves, lacunarity, gain);
}

for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
        let index = (y * w + x) * 4;
        let v = (pattern(x, y, octaves, lacunarity, gain) + 1) * 128;
        data[index] = v;
        data[index + 1] = v;
        data[index + 2] = v;
        data[index + 3] = 255;
    }
}

ctx.putImageData(imgdata, 0, 0);