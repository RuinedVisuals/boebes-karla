import { createProgram, fit, fullscreenTriangle, getGL, GLSL_COVER, GLSL_NOISE, loadTexture, uniforms, type Texture } from './gl';

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;
uniform sampler2D uA, uB; uniform vec2 uR, uM; uniform vec4 uRect; uniform float uP, uTime, uAA, uAB, uReady;
${GLSL_NOISE}${GLSL_COVER}
void main(){
  vec2 fc = gl_FragCoord.xy; vec3 night = vec3(.078,.102,.094); vec3 col = night;
  float v = (fc.y + sin(fc.x*.0045 + uTime*.35)*22. + sin(fc.x*.013 - uTime*.2)*6.) / 42.;
  float dl = min(fract(v), 1. - fract(v)) * 42.;
  col += vec3(.91,.47,.37) * (1. - smoothstep(0., 1.1, dl)) * .045 * (.4 + .6*fc.y/uR.y);
  vec2 uv = (fc - uRect.xy) / uRect.zw;
  float edge = .022 + .018*sin(uv.y*7. + uTime*.8);
  if (uReady > .5 && uv.x > edge && uv.x < 1. && uv.y > 0. && uv.y < 1.) {
    vec2 md = fc - uM; float dm = length(md);
    vec2 w = uv; w.x += sin(uv.y*16. + uTime*1.1)*.0022;
    w += (dm > 0. ? md/dm : vec2(0.)) * sin(dm*.07 - uTime*4.) * .006 * exp(-dm*.006);
    float nn = noise(w*4.5 + uTime*.08);
    float m = smoothstep(0., 1., clamp(uP*1.6 - .3 + (nn - .5)*.7, 0., 1.));
    vec2 o = vec2(nn - .5, noise(w*4.5 + 7.) - .5) * .22;
    float ra = uRect.z / uRect.w;
    vec3 a = texture2D(uA, cover(w + o*m, uAA, ra)).rgb;
    vec3 b = texture2D(uB, cover(w - o*(1. - m), uAB, ra)).rgb;
    col = mix(a, b, m) * (.82 + .18*smoothstep(1.1, .35, length(uv - .5)));
  }
  gl_FragColor = vec4(col, 1.);
}`;

/** Menu background: faint water lines + an image plane that morphs between images with a noise displacement. */
export class MenuStage {
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null>;
  private tex: (Texture | undefined)[] = [];
  private from = 0;
  private to = 0;
  private p = 1;
  private raf = 0;
  private t0 = performance.now();
  private mouse: [number, number] = [-9999, -9999];
  private onMove = (e: PointerEvent) => { this.mouse = [e.clientX, e.clientY]; };

  static create(canvas: HTMLCanvasElement, stage: HTMLElement, urls: string[], still: () => boolean) {
    const gl = getGL(canvas);
    if (!gl) return null;
    try { return new MenuStage(gl, canvas, stage, urls, still); } catch (err) { console.error("[menu] WebGL init failed", err); return null; }
  }

  private constructor(gl: WebGLRenderingContext, private canvas: HTMLCanvasElement, private stage: HTMLElement, urls: string[], private still: () => boolean) {
    this.gl = gl;
    const p = createProgram(gl, VS, FS);
    gl.useProgram(p);
    fullscreenTriangle(gl, p);
    this.u = uniforms(gl, p, ['uA', 'uB', 'uR', 'uM', 'uRect', 'uP', 'uTime', 'uAA', 'uAB', 'uReady']);
    urls.forEach((url, i) => loadTexture(gl, url).then((t) => { this.tex[i] = t; }).catch(() => {}));
    window.addEventListener('pointermove', this.onMove, { passive: true });
    this.raf = requestAnimationFrame(this.frame);
  }

  show(i: number) {
    if (i === this.to) return;
    this.from = this.p > 0.5 ? this.to : this.from;
    this.to = i;
    this.p = 0;
  }

  private frame = (now: number) => {
    const { gl, canvas, u } = this;
    const [w, h] = fit(canvas);
    gl.viewport(0, 0, w, h);
    const cr = canvas.getBoundingClientRect();
    const r = this.stage.getBoundingClientRect();
    const dpr = w / Math.max(1, cr.width);
    const visible = this.stage.offsetParent !== null;
    this.p = Math.min(1, this.p + (this.still() ? 1 : 0.022));
    const a = this.tex[this.from] ?? this.tex[this.to];
    const b = this.tex[this.to] ?? a;
    if (a && b) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, a.tex); gl.uniform1i(u.uA, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, b.tex); gl.uniform1i(u.uB, 1);
      gl.uniform1f(u.uAA, a.aspect); gl.uniform1f(u.uAB, b.aspect);
    }
    gl.uniform1f(u.uReady, a && b && visible ? 1 : 0);
    gl.uniform2f(u.uR, w, h);
    gl.uniform2f(u.uM, (this.mouse[0] - cr.left) * dpr, (cr.bottom - this.mouse[1]) * dpr);
    gl.uniform4f(u.uRect, (r.left - cr.left) * dpr, (cr.bottom - r.bottom) * dpr, r.width * dpr, r.height * dpr);
    gl.uniform1f(u.uP, this.p);
    gl.uniform1f(u.uTime, this.still() ? 0 : (now - this.t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.raf = requestAnimationFrame(this.frame);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
