let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let w = 256;
canvas.width = canvas.height = w;

let perlin = new Perlin();
perlin.seed();

let octaves = 5;
let lacunarity = 2;
let gain = 0.5;

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
};

let imgdata = ctx.getImageData(0, 0, w, w);
let data = imgdata.data;

function colorPixel(v, i) {
    data[i] = v[0];
    data[i + 1] = v[1];
    data[i + 2] = v[2];
    data[i + 3] = 255;
}
let deepOceanColor = [17, 163, 255]; // Dark blue col
let oceanColor = [17, 173, 193];
let sandColor = [247, 182, 158];
let grassColor = [91, 179, 97];
let forestColor = [30, 136, 117];
let rockColor = [96, 108, 129];
let snowColor = [255, 255, 255];

function interpolateColor(color1, color2, t) {
    const r = color1[0] + (color2[0] - color1[0]) * t;
    const g = color1[1] + (color2[1] - color1[1]) * t;
    const b = color1[2] + (color2[2] - color1[2]) * t;
    return [r, g, b];
}

for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
        let index = (y * w + x) * 4;
        let v = fbm(x, y, octaves, lacunarity, gain);

        if (v < 0.1) {
            const t = v / 0.1; // Calculate the interpolation factor
            const interpolatedColor = interpolateColor(deepOceanColor, oceanColor, t);
            colorPixel(interpolatedColor, index);
        } else if (v < 0.2) {
            const t = (v - 0.1) / 0.1; // Calculate the interpolation factor
            const interpolatedColor = interpolateColor(oceanColor, sandColor, t);
            colorPixel(interpolatedColor, index);
        } else if (v < 0.4) {
            const t = (v - 0.2) / 0.2;
            const interpolatedColor = interpolateColor(sandColor, grassColor, t);
            colorPixel(interpolatedColor, index);
        } else if (v < 0.7) {
            const t = (v - 0.4) / 0.3;
            const interpolatedColor = interpolateColor(grassColor, forestColor, t);
            colorPixel(interpolatedColor, index);
        } else if (v < 0.92) {
            const t = (v - 0.7) / 0.22;
            const interpolatedColor = interpolateColor(forestColor, rockColor, t);
            colorPixel(interpolatedColor, index);
        } else {
            colorPixel(snowColor, index);
        }
    }
}

ctx.putImageData(imgdata, 0, 0);