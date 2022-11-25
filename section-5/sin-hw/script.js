import * as THREE from '../../lib/three.module.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Start time of the animation
const start_time = Date.now();
// Uniform which passes the time elapsed since the start of the program
const u_time = { value: 0 };
// Initialize the app
init();

async function init() {
    // Add the renderer to the document body
    document.body.appendChild(three.domElement);
    // Set the camera position
    camera.position.set(0, 0, 1);
    // Load texture from assets folder
    const texture = await new THREE.TextureLoader().loadAsync('./assets/galactic_snake_concept.jpg');
    // Load the shaders
    const vertex_shader = await fetch('./shaders/vertex-shader.glsl');
    const fragment_shader = await fetch('./shaders/fragment-shader.glsl');
    // Create a material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            // Pass the texture via a uniform
            u_texture: { value: texture },
            // Pass the time uniform
            u_time,
        },
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
        // Update the time uniform
        u_time.value = (Date.now() - start_time);
        // Render the scene
        three.render(scene, camera);
        // Go to the next frame
        tick();
    });
}
