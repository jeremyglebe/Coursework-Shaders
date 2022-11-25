// Pass in texture via uniform
uniform sampler2D u_texture;
// The time passed in via uniform
uniform float u_time;

// Pass texture uv coordinates to the fragment shader
varying vec2 v_uv;

// Prototypes for functions
float remap(float value, float old_min, float old_max, float new_min, float new_max);

void main() {
  // Colors
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 black = vec3(0.0, 0.0, 0.0);
  // Sample the texture at the uv coordinates
  vec4 color = texture2D(u_texture, v_uv);

  // Animations

  // Convert clock time from ms to seconds
  float seconds = u_time / 1000.0;

  // Fading in-out animation based on time
  // float anim_fade = remap(sin(seconds), -1.0, 1.0, 0.0, 1.0);

  // Scan lines based on texture coordinates and time
  // --------------------------------------------------------------
  // Creates values between -1 and 1. v_uv.y is multiplied by a number to determine line density and
  // seconds is factored in to create a scrolling effect, multiplier determines speed.
  float sin_vals_down = sin(v_uv.y * 200.0 + seconds * 5.0);
  // Remapping the values ensures that the effect on the color doesn't completely white it out, but
  // instead just lightens it in certain areas. (75% minimum color)
  float scan_lines_down = remap( sin_vals_down, -1.0, 1.0, 0.75, 1.0);
  // Same as above, but scrolling up instead of down.
  // To see both effects, they need to move at different speeds, so seconds is multiplied by 2.0, and
  // also different line density
  float sin_vals_up = sin(v_uv.y * 40.0 - seconds * 2.0);
  float scan_lines_up = remap( sin_vals_up, -1.0, 1.0, 0.75, 1.0);

  // Apply Animations

  // color.rgb = mix(black, color.rgb, anim_fade);
  color.rgb *= scan_lines_down * scan_lines_up;

  // Set the final color
  gl_FragColor = color;
}

// Function to invert linear interpolation
float inverse_lerp(float a, float b, float value) {
  return (value - a) / (b - a);
}

// Function to remap a value from one range to another
float remap(float value, float old_min, float old_max, float new_min, float new_max) {
  float t = inverse_lerp(old_min, old_max, value);
  return mix(new_min, new_max, t);
}