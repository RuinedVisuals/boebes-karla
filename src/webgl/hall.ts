import { createProgram, fit, getGL, GLSL_COVER, loadTexture, perspective, planeMesh, uniforms, type Texture } from './gl';

const VS = `attribute vec2 aPos; uniform mat4 uProj; uniform vec2 uSize; uniform float uAngle, uR, uVel;
varying vec2 vUv; varying float vSide;
void main(){
  vec2 p = aPos * uSize; vUv = aPos + .5;
  float phi = uAngle + p.x / uR;
  vec3 w = vec3(sin(phi) * uR, p.y * (1. + abs(uVel) * .06), -cos(phi) * uR);
  w.z += sin(vUv.y * 3.14159) * uVel * .18;
  vSide = phi;
  gl_Position = uProj * vec4(w, 1.);
}`;
const FS = `precision highp float; uniform sampler2D uTex; uniform float uImgAsp, uPlaneAsp, uVel;
varying vec2 vUv; varying float vSide;
${GLSL_COVER}
void main(){
  vec2 cu = cover(vUv, uImgAsp, uPlaneAsp); float s = clamp(uVel, -1., 1.) * .015;
  vec3 c = vec3(texture2D(uTex, cu + vec2(s, 0.)).r, texture2D(uTex, cu).g, texture2D(uTex, cu - vec2(s, 0.)).b);
  float side = smoothstep(.15, 1.05, abs(vSide));
  c *= 1. - side * .65;
  c = mix(c, vec3(dot(c, vec3(.299, .587, .114))), side * .8);
  gl_FragColor = vec4(c, 1.);
}`;

/** Concave gallery: the camera stands inside a cylinder lined with images. Drag to turn, inertia, bends with speed. */
export class HallScene {
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null>;
  private count: number;
  private tex: (Texture | undefined)[] = [];
  private rot = 0;
  private target = 0;
  private dragging = false;
  private lastX = 0;
  private raf = 0;
  private lastIndex = -1;
  private visible = true;
  private io: IntersectionObserver;
  scrollVel = 0;

  static create(canvas: HTMLCanvasElement, urls: string[], onIndex: (i: number) => void, still: () => boolean) {
    const gl = getGL(canvas);
    if (!gl) return null;
    try { return new HallScene(gl, canvas, urls, onIndex, still); } catch (err) { console.error("[hall] WebGL init failed", err); return null; }
  }

  private constructor(gl: WebGLRenderingContext, private canvas: HTMLCanvasElement, private urls: string[], private onIndex: (i: number) => void, private still: () => boolean) {
    this.gl = gl;
    const p = createProgram(gl, VS, FS);
    gl.useProgram(p);
    this.count = planeMesh(gl, p, 24, 10);
    this.u = uniforms(gl, p, ['uProj', 'uSize', 'uAngle', 'uR', 'uVel', 'uTex', 'uImgAsp', 'uPlaneAsp']);
    gl.enable(gl.DEPTH_TEST);
    urls.forEach((url, i) => loadTexture(gl, url).then((t) => { this.tex[i] = t; }).catch(() => {}));
    canvas.addEventListener('pointerdown', this.down);
    window.addEventListener('pointermove', this.move);
    window.addEventListener('pointerup', this.up);
    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; });
    this.io.observe(canvas);
    this.raf = requestAnimationFrame(this.frame);
  }

  private down = (e: PointerEvent) => { this.dragging = true; this.lastX = e.clientX; };
  private move = (e: PointerEvent) => { if (!this.dragging) return; this.target -= (e.clientX - this.lastX) * 0.0022; this.lastX = e.clientX; };
  private up = () => { this.dragging = false; };

  private frame = () => {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.visible) return;
    const { gl, canvas, u } = this;
    const [w, h] = fit(canvas);
    const N = this.urls.length, R = 2.6, W = 1.1, H = 1.62, step = (W + 0.12) / R, total = N * step;
    if (!this.dragging) this.target += (this.still() ? 0 : 0.0011) + this.scrollVel;
    this.scrollVel *= 0.9;
    const prev = this.rot;
    this.rot += (this.target - this.rot) * 0.08;
    const vel = Math.max(-1.2, Math.min(1.2, (this.rot - prev) * 60));
    gl.viewport(0, 0, w, h);
    gl.clearColor(0.078, 0.102, 0.094, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(u.uProj, false, perspective(w / h < 1 ? 1.15 : 0.74, w / h));
    gl.uniform1f(u.uR, R); gl.uniform1f(u.uVel, vel); gl.uniform1i(u.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    let best = 9, bi = 0;
    for (let i = 0; i < N; i++) {
      let ang = i * step - this.rot;
      ang = (((ang + total / 2) % total) + total) % total - total / 2;
      if (Math.abs(ang) < best) { best = Math.abs(ang); bi = i; }
      const t = this.tex[i];
      if (Math.abs(ang) > 1.45 || !t) continue;
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.uniform2f(u.uSize, W, H); gl.uniform1f(u.uAngle, ang);
      gl.uniform1f(u.uImgAsp, t.aspect); gl.uniform1f(u.uPlaneAsp, W / H);
      gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    if (bi !== this.lastIndex) { this.lastIndex = bi; this.onIndex(bi); }
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.canvas.removeEventListener('pointerdown', this.down);
    window.removeEventListener('pointermove', this.move);
    window.removeEventListener('pointerup', this.up);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
