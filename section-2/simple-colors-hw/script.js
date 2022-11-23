// import * as THREE from 'https://cdn.skypack.dev/three@0.136'; // Import Three.js
import * as THREE from '../../lib/three.module.js';

/*
 * Homework was to:
 * 1. "Play with" the colors in the fragment shader (which is initially just a red background)
 *   - I added a click event listener to the canvas that changes the background color to a random color
 *   - Colors also slowly fade to black
 * 2. Convert some given colors from hex to float vectors
 *   - I added a function that converts hex to float vectors (and used it on the given colors in recolor())
 */

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Create a uniform for the background color
const u_background_color = { value: new THREE.Vector3(1, 0, 0) };
// Initialize the app
init();

async function init() {
    // Add the renderer to the document body
    document.body.appendChild(three.domElement);
    // Set the camera position
    camera.position.set(0, 0, 1);
    // Load the shaders
    const vertex_shader = await fetch('./shaders/vertex-shader.glsl');
    const fragment_shader = await fetch('./shaders/fragment-shader.glsl');
    // Create a material
    const material = new THREE.ShaderMaterial({
        uniforms: { color: u_background_color },
        vertexShader: await vertex_shader.text(),
        fragmentShader: await fragment_shader.text()
    });
    // Create a plane geometry that will fill the screen
    const geometry = new THREE.PlaneGeometry(1, 1);
    // Create a plane mesh that renders the material (shaders) on the geometry
    const plane = new THREE.Mesh(geometry, material);
    // Set the plane to be positioned in the center of the screen
    plane.position.set(0.5, 0.5, 0);
    // Add the plane to the scene
    scene.add(plane);
    // Set the initial size
    resize();
    // Start the render loop
    tick();
    // Create an onclick event listener for the canvas
    three.domElement.addEventListener('click', recolor);
}

function resize() {
    three.setSize(window.innerWidth, window.innerHeight);
}

function tick() {
    requestAnimationFrame((t) => {
        three.render(scene, camera);
        // Slowly fade to black
        u_background_color.value = u_background_color.value.multiplyScalar(0.99);
        tick();
    });
}

function recolor() {
    // Array of random colors
    const colors = [
        // Red, the default color
        '#ff0000',
        // The three colors given to convert from hex to float vectors
        '#00ff00', '#808080', '#c0c0ff',
        // Other vibrant colors
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff',
    ];
    // Get a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    // Convert the random string from hex to float vectors
    const floats = hex2vec(randomColor);
    // Set the background color to the random color
    u_background_color.value = new THREE.Vector3(floats[0], floats[1], floats[2]);
}

// converting colors from hex to float vectors
function hex2vec(hex) {
    // red, green, blue from hex
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    // normalize to [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;
    // return as vector
    return [r, g, b];
}