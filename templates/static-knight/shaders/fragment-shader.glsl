varying vec3 v_normal;

// Prototypes for functions
float remap(float value, float old_min, float old_max, float new_min, float new_max);

void main() {
  // Normalize the normal because it's interpolated and not 1.0 in length any more
  vec3 normal = normalize(v_normal);
  // Color that will be applied to the whole model
  vec3 model_color = vec3(0.5);

  // Lighting sources
  // --------------------

  // Ambient light
  vec3 ambient_light = vec3(0.1);

  // Hemisphere light
  vec3 sky_color = vec3(0.5, 0.5, 1.0);
  vec3 ground_color = vec3(1.0, 0.5, 0.5);
  float hemisphere_mixer = remap(normal.y, -1.0, 1.0, 0.0, 1.0);
  vec3 hemisphere_light = mix(ground_color, sky_color, hemisphere_mixer);

  // Directional light
  vec3 light_direction = normalize(vec3(1.0, 1.0, 1.0));
  vec3 dlight_color = vec3(1.0);
  float dp = max(0.0, dot(normal, light_direction));
  vec3 directional_light = dlight_color * dp;
  
  // Lighting is the sum of all lighting sources
  vec3 lighting = ambient_light + hemisphere_light + directional_light;
  // Uncomment to see directional light only
  // lighting = directional_light;

  // Apply lighting to the model color
  vec3 color = model_color * lighting;

  // --------------------

  // Uncomment to visualize the normal
  // color = normal;

  // Finalize the resulting color
  gl_FragColor = vec4(color, 1.0);
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