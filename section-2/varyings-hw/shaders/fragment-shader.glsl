varying vec2 v_uv_coords;
uniform bool u_invert_gradient;

void main() {
  // First homework was to change the following line:
  // gl_FragColor = vec4(vec3(v_uv_coords.x), 1.0);

  // So that it goes from right to left instead of left to right:
  // gl_FragColor = vec4(1.0-vec3(v_uv_coords.x), 1.0);

  // I've decided to make it toggleable using a uniform:
  // if(u_invert_gradient) {
  //   gl_FragColor = vec4(1.0-vec3(v_uv_coords.x), 1.0);
  // } else {
  //   gl_FragColor = vec4(vec3(v_uv_coords.x), 1.0);
  // }

  // From further in the lesson, next we'll include the y component:
  // if(u_invert_gradient) {
  //   gl_FragColor = vec4(1.0-v_uv_coords.x, 1.0-v_uv_coords.y, 0.0, 1.0);
  // } else {
  //   gl_FragColor = vec4(v_uv_coords.x, v_uv_coords.y, 0.0, 1.0);
  // }

  // A simpler version of the above:
  // if(u_invert_gradient) {
  //   gl_FragColor = vec4(1.0-v_uv_coords, 0.0, 1.0);
  // } else {
  //   gl_FragColor = vec4(v_uv_coords, 0.0, 1.0);
  // }

  // Second homework was to make the top-left red and the bottom-right blue:
  if(u_invert_gradient) {
    // This line accomplishes the homework:
    gl_FragColor = vec4(1.0-v_uv_coords.x, 0.0, 1.0-v_uv_coords.y, 1.0);
  } else {
    // This line is the inverse of the above:
    gl_FragColor = vec4(v_uv_coords.x, 0.0, v_uv_coords.y, 1.0);
  }
}