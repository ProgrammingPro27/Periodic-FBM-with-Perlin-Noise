let perlin = new Perlin();
perlin.seed();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let w = 256;
canvas.width = canvas.height = w;

let gridSize = 9; //must be integer
let resolution = 256;


let octaves = 10;
let lacunarity = 5.0; //lacunarity тmust be integer, not float (it ruins periodic effect) !
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

function render() {
    let pixSize = w / resolution;
    ctx.clearRect(0, 0, canvas.width, canvas.width);

    for (let y = 0; y < gridSize; y += gridSize / resolution) {
        for (let x = 0; x < gridSize; x += gridSize / resolution) {

            let v = (fbm(x, y, gridSize) / 2 + 0.5) * 255;

            ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
            ctx.fillRect(x * (w / gridSize), y * (w / gridSize), pixSize, pixSize);
        }
    }
}
render();