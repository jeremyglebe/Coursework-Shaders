// texture to sample from
uniform sampler2D u_texture;
// uniforms to control vertical and horizontal flipping
uniform bool u_flipY;
uniform bool u_flipX;
// uv coordinates for the vertices in the texture
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  if (u_flipY) {
    // flip the y coordinate (the v coordinate, in texture terms)
    uv.y = 1.0 - uv.y;
  }
  if (u_flipX) {
    // flip the x coordinate (the u coordinate, in texture terms)
    uv.x = 1.0 - uv.x;
  }
  // sample from the texture
  vec4 sample_color = texture2D(u_texture, uv);
  // set the color of the fragment
  gl_FragColor = sample_color;
  // tint the edges (within 10%) of the texture
  if(uv.x < 0.1 || uv.x > 0.9 || uv.y < 0.1 || uv.y > 0.9) {
    gl_FragColor = gl_FragColor * vec4(0.0, 1.0, 0.0, 1.0);
  }
  /// Also draw black lines along the 10% mark to make it more obvious
  if(uv.x < 0.105 && uv.x > 0.095 || uv.y < 0.105 && uv.y > 0.095) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
  if(uv.x > 0.895 && uv.x < 0.905 || uv.y > 0.895 && uv.y < 0.905) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}