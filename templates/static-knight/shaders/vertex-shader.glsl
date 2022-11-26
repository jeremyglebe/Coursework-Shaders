varying vec3 v_normal;

void main() {	
  vec4 localPosition = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * localPosition;
  // Pass the normal to the fragment shader
  v_normal = (modelMatrix * vec4(normal, 0.0)).xyz;
}