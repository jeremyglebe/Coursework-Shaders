import * as THREE from '../../lib/three.module.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Create a uniform to toggle gradient direction
const u_invert_gradient = { value: false };
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
        uniforms: { u_invert_gradient },
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
    // Add a listener to invert the gradient when the user clicks the canvas
    three.domElement.addEventListener('click', invert_gradient);
}

function resize() {
    three.setSize(window.innerWidth, window.innerHeight);
}

function tick() {
    requestAnimationFrame((t) => {
        three.render(scene, camera);
        tick();
    });
}

function invert_gradient() {
    u_invert_gradient.value = !u_invert_gradient.value;
}