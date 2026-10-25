// Small raw-WebGL toolkit shared by the scenes (no three.js: ~2 KB instead of ~150 KB).

export type Texture = { tex: WebGLTexture; aspect: number };

export function getGL(canvas: HTMLCanvasElement, opts: WebGLContextAttributes = {}): WebGLRenderingContext | null {
  try {
    return canvas.getContext('webgl', { antialias: true, alpha: false, ...opts });
  } catch {
    return null;
  }
}

export function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader');
    return sh;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
  return p;
}

export function uniforms(gl: WebGLRenderingContext, p: WebGLProgram, names: string[]) {
  const u: Record<string, WebGLUniformLocation | null> = {};
  names.forEach((n) => { u[n] = gl.getUniformLocation(p, n); });
  return u;
}

export function loadTexture(gl: WebGLRenderingContext, url: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resolve({ tex, aspect: img.naturalWidth / img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Full-screen triangle bound to attribute `p`. */
export function fullscreenTriangle(gl: WebGLRenderingContext, p: WebGLProgram) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
}

/** Subdivided unit plane (-0.5..0.5) bound to attribute `aPos`, so vertices can bend. Returns the index count. */
export function planeMesh(gl: WebGLRenderingContext, p: WebGLProgram, sx = 24, sy = 12): number {
  const verts: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= sy; j++) for (let i = 0; i <= sx; i++) verts.push(i / sx - 0.5, j / sy - 0.5);
  for (let j = 0; j < sy; j++) for (let i = 0; i < sx; i++) {
    const a = j * (sx + 1) + i, b = a + 1, c = a + sx + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return idx.length;
}

export function perspective(fov: number, aspect: number, near = 0.1, far = 100): Float32Array {
  const t = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  return new Float32Array([t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** Keeps the canvas backing store matched to its CSS size (DPR capped). Returns [w, h]. */
export function fit(canvas: HTMLCanvasElement, maxDpr = 1.75): [number, number] {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(2, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  return [w, h];
}

export const GLSL_COVER = `
vec2 cover(vec2 uv, float imgAsp, float boxAsp) {
  if (imgAsp > boxAsp) uv.x = (uv.x - .5) * boxAsp / imgAsp + .5;
  else uv.y = (uv.y - .5) * imgAsp / boxAsp + .5;
  return uv;
}`;

export const GLSL_NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}`;
