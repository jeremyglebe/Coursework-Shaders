import * as THREE from '../../lib/three.module.js';
import { FBXLoader } from '../../lib/loaders/FBXLoader.js';

// Create a WebGL renderer
const three = new THREE.WebGLRenderer();
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
// Create an FBX Loader to load models/animations
const loader = new FBXLoader();
// FBXLoader for animations
const anim_loader = new FBXLoader();
// Mixer for the model and animation (must be null initially)
let mixer = null;
// Time since the last frame
let last_raf = Date.now();
// Initialize the app
init();

async function init() {
    // Add the renderer to the document body
    document.body.appendChild(three.domElement);
    // Set the camera position
    camera.position.set(0, 0, 1);
    // Lights to make the model visible
    // Hemisphere light (sky and ground)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    // Directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);
    // Load a 3D model
    loader.setPath('./assets/');
    loader.load('castle_guard_01.fbx', (mobj_knight) => {
        console.log(mobj_knight);
        // Set the knight's position
        mobj_knight.position.set(0.5, 0.0, 0.0);
        // Set the knight's scale
        mobj_knight.scale.set(0.005, 0.005, 0.005);
        // Set the knight's rotation
        mobj_knight.rotation.set(0, 0, 0);
        // Extend mobj_knight's fragment shader to add a glow effect
        // For each child of mobj_knight
        mobj_knight.traverse((child) => {
            // If the child is a mesh
            if (child.isMesh) {
                child.material.onBeforeCompile = (shader) => {
                    shader.fragmentShader = `uniform vec3 glowColor;
uniform float glowPower;
${shader.fragmentShader}`;
                    // Replace the last line of the fragment shader with some new code
                    shader.fragmentShader = shader.fragmentShader.slice(0, -1) + `

    // Now try to set all colors to some preset magnitudes
    vec3 before = gl_FragColor.rgb;
    float thresholds[4] = float[](0.0, 0.5, 1.0, sqrt(3.0));
    // Get the magnitude of the color
    float mag = length(before);
    // Get the index of the threshold that is closest to the magnitude
    int index = 0;
    for (int i = 0; i < 4; i++) {
        if (abs(thresholds[i] - mag) < abs(thresholds[index] - mag)) {
            index = i;
        }
    }
    // Scale the color so its magnitude is equal to the threshold
    gl_FragColor.rgb = before * (thresholds[index] / mag);
}`;
                    console.log(shader.fragmentShader);
                    shader.uniforms.glowColor = { value: new THREE.Color(0x00ff00) };
                    shader.uniforms.glowPower = { value: 1.0 };
                };
            }
        });
        // Create an FBXLoader to load animations
        anim_loader.setPath('./assets/');
        // Loading an animation
        anim_loader.load('Unarmed Walk Forward.fbx', (manim_walk) => {
            // Create a mixer for the animation
            mixer = new THREE.AnimationMixer(mobj_knight);
            // Create a clip action for the animation
            const action = mixer.clipAction(manim_walk.animations[0]);
            // Play the animation
            action.play();
        });
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
    requestAnimationFrame(() => {
        // Update the animation mixer
        if (mixer) {
            let t = Date.now();
            mixer.update((t - last_raf) / 1000);
        }
        // Render the scene
        three.render(scene, camera);
        // Update the time since the last frame
        last_raf = Date.now();
        // Schedule the next frame
        tick();
    });
}
