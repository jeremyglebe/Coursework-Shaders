import * as THREE from '../../lib/three.module.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Uniforms representing two colors
// These are the colors from the homework (regarding brightness of yellow)
const u_color_1 = { value: new THREE.Vector4(1, 0, 0, 1) };
const u_color_2 = { value: new THREE.Vector4(0, 1, 0, 1) };
// These are the colors from the end of the lesson
// const u_color_1 = { value: new THREE.Vector4(1, 1, 0, 1) };
// const u_color_2 = { value: new THREE.Vector4(0, 1, 1, 1) };
// Create a uniform which multiplies the final lerp result
const u_post_lerp_multiplier = { value: 1 };
// Initialize the app
init();

async function init() {
    // Add the renderer to the document body
    document.body.appendChild(three.domElement);
    // Get the element with id "multiplier" from the document
    const multiplier = document.querySelector('#multiplier');
    // Add an event listener for changes to the multiplier input
    multiplier.addEventListener('input', changePostLerpMultiplier);
    // Set the camera position
    camera.position.set(0, 0, 1);
    // Load the shaders
    const vertex_shader = await fetch('./shaders/vertex-shader.glsl');
    const fragment_shader = await fetch('./shaders/fragment-shader.glsl');
    // Create a material
    const material = new THREE.ShaderMaterial({
        uniforms: { color1: u_color_1, color2: u_color_2, post_lerp: u_post_lerp_multiplier },
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

function changePostLerpMultiplier(e) {
    // Get the element with id "multiplier-text" from the document
    const multiplierText = document.querySelector('#multiplier-text');
    // Set the text of the multiplier text element to the value of the multiplier input
    multiplierText.textContent = e.target.value;
    // Set the post lerp multiplier to the value of the multiplier input
    u_post_lerp_multiplier.value = e.target.value;
}