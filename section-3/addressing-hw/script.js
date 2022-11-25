import * as THREE from '../../lib/three.module.js';

// Homework, explain the effect when repeating with a negative multiplier:
// When in repeat mode, negative values will flip the texture
// This can be observed with the controls added to this homework

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Uniform to control the uv coordinates multiplier
const u_multiplier = { value: 1.0 };
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
            // Pass the multiplier uniform
            u_multiplier,
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
    // Set initial wrap modes
    getWrapModeInputs(texture);
    // Add an onchange handler to the wrapS and wrapT select elements
    document.getElementById('wrapS').onchange = () => getWrapModeInputs(texture);
    document.getElementById('wrapT').onchange = () => getWrapModeInputs(texture);
    // Add an onchange handler to the multiplier input
    document.getElementById('multiplier').oninput = onMultiplierChange;
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

function getWrapModeInputs(texture) {
    // Get the values of the wrapS and wrapT select elements
    const wrapS = document.getElementById('wrapS').value;
    const wrapT = document.getElementById('wrapT').value;
    console.log(wrapS, wrapT);
    // Set the wrap mode of the texture based on the values of the select elements
    if (wrapS === 'Repeat') {
        texture.wrapS = THREE.RepeatWrapping;
    }
    else if (wrapS === 'Clamp') {
        texture.wrapS = THREE.ClampToEdgeWrapping;
    }
    else if (wrapS === 'Mirror') {
        texture.wrapS = THREE.MirroredRepeatWrapping;
    }
    if (wrapT === 'Repeat') {
        texture.wrapT = THREE.RepeatWrapping;
    }
    else if (wrapT === 'Clamp') {
        texture.wrapT = THREE.ClampToEdgeWrapping;
    }
    else if (wrapT === 'Mirror') {
        texture.wrapT = THREE.MirroredRepeatWrapping;
    }
    // reset the texture to update the wrap mode
    // I don't really know how this works or why it's needed
    // Something to learn about later
    texture.needsUpdate = true;
}

function onMultiplierChange(e) {
    // Get the value of the multiplier input
    const multiplier = document.getElementById('multiplier').value;
    // Set the multiplier uniform
    u_multiplier.value = parseFloat(multiplier);
    // Update the mtext element
    document.getElementById('mtext').innerText = multiplier;
}