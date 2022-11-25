import * as THREE from '../../lib/three.module.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Uniforms which control whether to flip the texture horizontally or vertically
const u_flipX = { value: false };
const u_flipY = { value: false };
// Initialize the app
init();

async function init() {
    // Add the renderer to the document body
    document.body.appendChild(three.domElement);
    // Set the camera position
    camera.position.set(0, 0, 1);
    // Load a texture from the assets folder
    const texture = await new THREE.TextureLoader().loadAsync('./assets/galactic_snake_concept.jpg');
    // Load the shaders
    const vertex_shader = await fetch('./shaders/vertex-shader.glsl');
    const fragment_shader = await fetch('./shaders/fragment-shader.glsl');
    // Create a material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            // Pass the texture via a uniform
            u_texture: { value: texture },
            // Pass the uniforms which control whether to flip the texture horizontally or vertically
            u_flipX,
            u_flipY,
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
    // Click handler that flips the texture based on mouse click position
    window.addEventListener('click', onClick);
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

// click handler that flips the texture based on mouse click position
function onClick(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    // If the click was within 10% of the left or right edge, flip horizontally
    if (x < 0.1 || x > 0.9) {
        u_flipX.value = !u_flipX.value;
    }
    // If the click was within 10% of the top or bottom edge, flip vertically
    if (y < 0.1 || y > 0.9) {
        u_flipY.value = !u_flipY.value;
    }
}