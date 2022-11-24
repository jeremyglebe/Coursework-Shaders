// Uniforms representing two colors
uniform vec4 color1;
uniform vec4 color2;
// Uniform which multiplies the color by a factor after the mix (lerp)
// (I added this for fun, but it wasn't part of the lesson)
uniform float post_lerp;
// Varying which passes the uv coordinates
varying vec2 v_uv_coords;

void main() {
  // Starting off just by mixing the two colors
  // gl_FragColor = mix(color1, color2, v_uv_coords.x);
  
  // The homework was to determine why the center of the gradient is a dark yellow instead of bright.
  // The reason is that with a linear mix, the mid-point will only have a 50% contribution from each color.
  // (50% brightness) To fix this, my idea was to determine the magnitude of the interpolated color and scale it to 1.0
  // float color_magnitude = length(gl_FragColor);
  // gl_FragColor = gl_FragColor / color_magnitude;

  // As it turned out, we can just use normalize() to do this for us.
  // gl_FragColor = normalize(gl_FragColor);

  // That didn't really work any better, instead just making all the colors look a little washed out.
  // Next, since each color essentially gets a 50% contribution (at least at the center) I tried doubling the
  // contribution of each color by multiplying the color by 2.0. This will be okay when doubling 1.0, because values
  // above 1.0 are clamped. This worked beautifully.
  // gl_FragColor *= 2.0;

  // Final one-liner shader
  // gl_FragColor = mix(color1, color2, v_uv_coords.x) * 2.0;

  // Just kidding, I've got one more idea. What if we just multiply the color by a user-defined factor?
  gl_FragColor = mix(color1, color2, v_uv_coords.x) * post_lerp;

  // And now it has dawned on me that this whole time I've been multiplying the alpha too, which is why the colors were
  // seeming washed out. Let's try making a vec3, normalizing it, then assigning it to the rgb components of the color.
  // This fixed the washed out colors, but doesn't make a meaningful difference in the dark yellow center.
  // vec3 normalized = normalize(gl_FragColor.rgb);
  // gl_FragColor = vec4(normalized, gl_FragColor.a);

  // That didn't help, but I still want to ensure the alpha is 1.0, so let's just set it to 1.0.
  gl_FragColor.a = 1.0;

}