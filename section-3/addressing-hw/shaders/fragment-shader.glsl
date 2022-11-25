// texture to sample from
uniform sampler2D u_texture;
// uv coordinates multiplier
uniform float u_multiplier;
// uv coordinates for the vertices in the texture
varying vec2 v_uv;

void main() {
  // cause the texture to wrap by multiplying the uv coordinates
  vec2 uv = v_uv * u_multiplier;
  // sample from the texture
  vec4 sample_color = texture2D(u_texture, uv);
  // set the color of the fragment
  gl_FragColor = sample_color;
}