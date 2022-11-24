// Varying which passes the uv coordinates
varying vec2 v_uv_coords;

void main() {	
  vec4 localPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * localPosition;
  v_uv_coords = uv;
}