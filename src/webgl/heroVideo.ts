import { createProgram, fit, fullscreenTriangle, getGL, GLSL_COVER, GLSL_NOISE, uniforms } from './gl';

const VS = 'attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }';

// Dark cinematic grade over the museum footage: desaturated, split-toned (teal shadows / warm clay highlights),
// slow liquid drift, a ripple that trails the pointer, film grain and vignette.
const FS = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTex; uniform vec2 uRes, uMouse; uniform float uAsp, uTime, uScroll, uIntro, uVel;
${GLSL_NOISE}${GLSL_COVER}
void main(){
  vec2 uv = vUv;
  float boxAsp = uRes.x / uRes.y;
  // Liquid drift: two slow noise fields push the image a few pixels.
  vec2 flow = vec2(noise(uv * 3. + uTime * .05), noise(uv * 3. + 17. - uTime * .04)) - .5;
  uv += flow * .006;
  // Ripple around the pointer, stronger when the pointer moves.
  vec2 d = (uv - uMouse) * vec2(boxAsp, 1.);
  float dist = length(d);
  float ring = sin(dist * 42. - uTime * 3.) * exp(-dist * 7.) * (.003 + uVel * .018);
  uv += normalize(d + 1e-5) * ring;
  // Slow push-in + scroll zoom.
  float zoom = 1.06 + uScroll * .12 + (1. - uIntro) * .18;
  vec2 cu = cover((uv - .5) / zoom + .5, uAsp, boxAsp);
  float ca = .0015 + uVel * .004;
  vec3 c = vec3(texture2D(uTex, cu + vec2(ca, 0.)).r, texture2D(uTex, cu).g, texture2D(uTex, cu - vec2(ca, 0.)).b);
  // Grade.
  float l = dot(c, vec3(.299, .587, .114));
  c = mix(c, vec3(l), .45);
  vec3 shadow = vec3(.05, .11, .12), high = vec3(.93, .78, .66);
  c = mix(shadow, high, smoothstep(.02, 1.05, l)) * .55 + c * .45;
  c *= .58 * (1. - uScroll * .35);
  // Vignette, darker at the bottom where the title sits.
  float v = smoothstep(1.25, .25, length((vUv - vec2(.5, .58)) * vec2(1.1, 1.3)));
  c *= mix(.45, 1., v);
  c *= mix(.55, 1., smoothstep(0., .45, vUv.y));
  // Grain.
  c += (hash(vUv * uRes + fract(uTime * 13.) * 100.) - .5) * .05;
  c *= uIntro;
  gl_FragColor = vec4(c, 1.);
}`;

/** Renders a <video> (or a fallback image) through the grading shader. */
export class HeroVideoScene {
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null>;
  private tex: WebGLTexture;
  private aspect = 16 / 9;
  private hasFrame = false;
  private raf = 0;
  private t0 = performance.now();
  private mouse = [0.5, 0.5];
  private target = [0.5, 0.5];
  private vel = 0;
  private visible = true;
  private io: IntersectionObserver;
  scroll = 0;
  intro = 0;

  static create(canvas: HTMLCanvasElement, video: HTMLVideoElement | null, fallback: string, still: () => boolean) {
    const gl = getGL(canvas, { antialias: false });
    if (!gl) return null;
    try { return new HeroVideoScene(gl, canvas, video, fallback, still); } catch (err) { console.error('[hero] WebGL init failed', err); return null; }
  }

  private constructor(gl: WebGLRenderingContext, private canvas: HTMLCanvasElement, private video: HTMLVideoElement | null, fallback: string, private still: () => boolean) {
    this.gl = gl;
    const p = createProgram(gl, VS, FS);
    gl.useProgram(p);
    fullscreenTriangle(gl, p);
    this.u = uniforms(gl, p, ['uTex', 'uRes', 'uMouse', 'uAsp', 'uTime', 'uScroll', 'uIntro', 'uVel']);
    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Poster/fallback image first, so there is a picture before the video decodes (or if it never does).
    const img = new Image();
    img.onload = () => { if (this.usingVideo()) return; this.upload(img); this.aspect = img.naturalWidth / img.naturalHeight; };
    img.src = fallback;
    canvas.addEventListener('pointermove', this.onMove);
    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; });
    this.io.observe(canvas);
    this.raf = requestAnimationFrame(this.frame);
  }

  private usingVideo() { return !!this.video && this.video.readyState >= 2 && !this.video.error; }

  private upload(src: TexImageSource) {
    const { gl } = this;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    this.hasFrame = true;
  }

  private onMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  };

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.visible) return;
    const { gl, u } = this;
    const [w, h] = fit(this.canvas, 1.5);
    gl.viewport(0, 0, w, h);
    if (this.usingVideo()) { this.upload(this.video!); this.aspect = this.video!.videoWidth / this.video!.videoHeight; }
    if (!this.hasFrame) return;
    const still = this.still();
    const dx = this.target[0] - this.mouse[0], dy = this.target[1] - this.mouse[1];
    this.mouse[0] += dx * 0.08; this.mouse[1] += dy * 0.08;
    this.vel += (Math.min(1, Math.hypot(dx, dy) * 12) - this.vel) * 0.1;
    gl.uniform1i(u.uTex, 0);
    gl.uniform2f(u.uRes, w, h);
    gl.uniform2f(u.uMouse, this.mouse[0], this.mouse[1]);
    gl.uniform1f(u.uAsp, this.aspect);
    gl.uniform1f(u.uTime, still ? 0 : (now - this.t0) / 1000);
    gl.uniform1f(u.uScroll, this.scroll);
    gl.uniform1f(u.uIntro, still ? 1 : this.intro);
    gl.uniform1f(u.uVel, still ? 0 : this.vel);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
