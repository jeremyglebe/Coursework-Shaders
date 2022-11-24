varying vec2 v_uv_coords;

void main() {	
  vec4 localPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * localPosition;
  // Three.js provides the uv coordinates (texture coordinates) in the vertex shader
  v_uv_coords = uv;
}