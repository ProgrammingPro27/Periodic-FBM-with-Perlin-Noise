let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let w = 256;
canvas.width = canvas.height = w;

let perlin = new Perlin();
perlin.seed();

let octaves = 5;
let lacunarity = 2;
let gain = 0.5;


function ridge(h) {    // create creases
    h = 1 - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}

function fbm(x, y, octaves, lacunarity, gain) {
    let total = 0;
    let amplitude = 1;
    let frequency = 5;
    let numOfPoints = frequency;

    for (let i = 0; i < octaves; i++) {
        total += Math.abs(perlin.get(x / w * frequency, y / w * frequency, numOfPoints)) * amplitude;
        frequency *= lacunarity;
        amplitude *= gain;
    }
    return total;
};

let imgdata = ctx.getImageData(0, 0, w, w);
let data = imgdata.data;

for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
        let index = (y * w + x) * 4;
        let v = 255 - ridge(fbm(x, y, octaves, lacunarity, gain)) * 255;
        data[index] = v;
        data[index + 1] = v;
        data[index + 2] = v;
        data[index + 3] = 255;
    }
}

ctx.putImageData(imgdata, 0, 0);