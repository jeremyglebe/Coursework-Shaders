import * as THREE from '../../lib/three.module.js';
import { FBXLoader } from '../../lib/loaders/FBXLoader.js';
import { OrbitControls } from '../../lib/OrbitControls.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Orbit controls
const controls = new OrbitControls(camera, three.domElement);
// Create an FBX Loader to load models/animations
const loader = new FBXLoader();
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
        uniforms: {},
        vertexShader: await vertex_shader.text(),
        fragmentShader: await fragment_shader.text()
    });
    // Load a 3D model
    loader.setPath('./assets/');
    loader.load('castle_guard_01.fbx', (mobj_knight) => {
        // Set the material on the model
        mobj_knight.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
            }
        });
        // Set the knight's position
        mobj_knight.position.set(0.5, 0.0, 0.0);
        // Set the knight's scale
        mobj_knight.scale.set(0.005, 0.005, 0.005);
        // Set the knight's rotation
        mobj_knight.rotation.set(0, 0, 0);
        // Add the knight to the scene
        scene.add(mobj_knight);
    });
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
        // Render the scene
        three.render(scene, camera);
        // Schedule the next frame
        tick();
    });
}
