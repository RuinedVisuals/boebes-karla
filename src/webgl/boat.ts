import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Το Καράβι της Κάρλας, built from its documented shape (museum boat, scale model, illustration):
 * a long flat-bottomed hull with flared sides, raked upright ends, inner ribs, two thwarts,
 * the cross-beam that carries the oars, two long oars and a reed basket.
 * Units: 1 = ~1 m. x runs bow (+) to stern (−), y up, z across.
 */

const L = 7.2; // length
const STATIONS = 40;

// Hull section at t ∈ [-1, 1] along the length.
function section(t: number) {
  const e = Math.abs(t);
  // Bow (+x) closes to a point; stern (−x) ends in a wide flat board.
  const narrow = t > 0 ? 1 - Math.pow(e, 3.2) * 0.96 : 1 - Math.pow(e, 6) * 0.45;
  return {
    x: t * L / 2,
    floor: 0.04 + Math.pow(e, 5) * 0.3, // slight rocker toward the ends
    // The gunwale sweeps up to both ends; the «1» end (bow, +x) stands much taller.
    sheer: 0.62 + Math.pow(e, 3) * (t > 0 ? 0.62 : 0.34),
    // The end boards rake outward: the top of the hull runs further out than the bottom.
    rake: Math.sign(t) * Math.pow(e, 8) * (t > 0 ? 0.55 : 0.22),
    bottom: 0.5 * narrow, // half-width of the flat bottom
    top: 0.82 * narrow, // half-width at the gunwale (flared sides)
  };
}

function hullGeometry(inset = 0) {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= STATIONS; i++) {
    const s = section(-1 + (2 * i) / STATIONS);
    // Profile: top-left, bottom-left, bottom-right, top-right.
    const xt = s.x + s.rake;
    pos.push(xt, s.sheer, -(s.top - inset), s.x, s.floor + inset, -(s.bottom - inset), s.x, s.floor + inset, s.bottom - inset, xt, s.sheer, s.top - inset);
  }
  for (let i = 0; i < STATIONS; i++) {
    for (let k = 0; k < 3; k++) {
      const a = i * 4 + k, b = a + 1, c = a + 4, d = a + 5;
      idx.push(a, c, b, b, c, d);
    }
  }
  // Stern board sits one station in, so the side planks run past it («ears»); the bow closes at its point.
  for (const i of [1, STATIONS]) {
    const o = i * 4;
    if (i === 1) idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    else idx.push(o, o + 2, o + 1, o, o + 3, o + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Plank seams: thin dark lines along the outside, like the scale model's strakes.
function strakes(mat: THREE.Material) {
  const group = new THREE.Group();
  for (const f of [0.33, 0.66]) {
    for (const side of [-1, 1]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= STATIONS; i++) {
        const s = section(-1 + (2 * i) / STATIONS);
        pts.push(new THREE.Vector3(s.x + s.rake * f, s.floor + (s.sheer - s.floor) * f, side * (s.bottom + (s.top - s.bottom) * f + 0.004)));
      }
      group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.008, 4), mat));
    }
  }
  return group;
}

function ribs(mat: THREE.Material) {
  const group = new THREE.Group();
  for (let i = 3; i < STATIONS - 2; i += 2) {
    const s = section(-1 + (2 * i) / STATIONS);
    const pts = [
      new THREE.Vector3(s.x, s.sheer - 0.02, -(s.top - 0.05)),
      new THREE.Vector3(s.x, s.floor + 0.05, -(s.bottom - 0.05)),
      new THREE.Vector3(s.x, s.floor + 0.05, s.bottom - 0.05),
      new THREE.Vector3(s.x, s.sheer - 0.02, s.top - 0.05),
    ];
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let k = 0; k < 3; k++) path.add(new THREE.LineCurve3(pts[k], pts[k + 1]));
    const rib = new THREE.Mesh(new THREE.TubeGeometry(path as unknown as THREE.Curve<THREE.Vector3>, 12, 0.03, 4), mat);
    group.add(rib);
  }
  return group;
}

function gunwales(mat: THREE.Material) {
  const group = new THREE.Group();
  for (const side of [-1, 1]) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= STATIONS; i++) {
      const s = section(-1 + (2 * i) / STATIONS);
      pts.push(new THREE.Vector3(s.x + s.rake, s.sheer + 0.015, side * s.top));
    }
    group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.035, 6), mat));
  }
  return group;
}

// The white «1» painted on both sides near the tall end, as on the museum's boat.
function numberOne() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  // Drawn as brush strokes rather than a font glyph: a thick stem with its flag, like the painted «1».
  x.strokeStyle = '#efe9dc';
  x.lineWidth = 30;
  x.lineCap = 'round';
  x.lineJoin = 'round';
  x.beginPath();
  x.moveTo(78, 92);
  x.lineTo(142, 34);
  x.lineTo(140, 220);
  x.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Unlit, so the paint reads on the black hull from any angle.
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: 0xd8d0c0 });
  const g = new THREE.Group();
  const t = 0.76;
  const s = section(t);
  const y = s.floor + (s.sheer - s.floor) * 0.62;
  const z = s.bottom + (s.top - s.bottom) * 0.62 + 0.045; // sit just proud of the planks so the turned decal never sinks into them
  const tilt = Math.atan2(s.top - s.bottom, s.sheer - s.floor);
  // Near the point the side turns inward; turn the decal with it so it lies flat on the planks.
  const ahead = section(t + 0.02);
  const turn = Math.atan2((s.top + s.bottom) / 2 - (ahead.top + ahead.bottom) / 2, ahead.x - s.x);
  for (const side of [1, -1]) {
    const holder = new THREE.Group();
    holder.position.set(s.x, y, side * z);
    holder.rotation.y = side > 0 ? turn : Math.PI - turn;
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.58), mat);
    decal.rotation.x = tilt; // follow the flare: the side leans outward, so its face looks slightly down
    holder.add(decal);
    g.add(holder);
  }
  return g;
}

function plank(w: number, h: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  return m;
}

function oar(mat: THREE.Material) {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 4.2, 10), mat);
  shaft.rotation.z = Math.PI / 2;
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 10), mat);
  grip.rotation.z = Math.PI / 2;
  grip.position.x = 1.9;
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.2), mat);
  blade.position.x = -2.2;
  g.add(shaft, grip, blade);
  g.traverse((o) => { o.castShadow = true; });
  return g;
}

function basket(mat: THREE.Material) {
  const pts = [new THREE.Vector2(0.0, 0), new THREE.Vector2(0.17, 0), new THREE.Vector2(0.24, 0.22), new THREE.Vector2(0.26, 0.24), new THREE.Vector2(0.25, 0.25)];
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), mat);
  m.castShadow = true;
  return m;
}

/** Procedural wood grain, so the hull isn't a flat colour. */
function woodTexture(base: string, line: string) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const x = c.getContext('2d')!;
  x.fillStyle = base;
  x.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 140; i++) {
    x.strokeStyle = line;
    x.globalAlpha = 0.05 + Math.random() * 0.12;
    x.lineWidth = 0.5 + Math.random() * 1.5;
    const y = Math.random() * 128;
    x.beginPath();
    x.moveTo(0, y);
    x.bezierCurveTo(170, y + (Math.random() - 0.5) * 8, 340, y + (Math.random() - 0.5) * 8, 512, y);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export type Stop = { pos: [number, number, number]; target: [number, number, number] };

export class BoatScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  controls: OrbitControls;
  boat = new THREE.Group();
  private raf = 0;
  private visible = true;
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  /** World points that the HTML markers follow (screen positions are written into `onMarkers`). */
  markers: THREE.Vector3[] = [];
  onMarkers?: (pts: { x: number; y: number; behind: boolean }[]) => void;

  static create(canvas: HTMLCanvasElement, still: boolean) {
    try { return new BoatScene(canvas, still); } catch (err) { console.error('[boat] WebGL init failed', err); return null; }
  }

  constructor(private canvas: HTMLCanvasElement, still: boolean) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Museum lighting: a warm key from above-front, a cool rim from behind, soft fill.
    this.scene.add(new THREE.HemisphereLight(0xf3e9d6, 0x1d2522, 0.9));
    const key = new THREE.SpotLight(0xffe2b8, 220, 30, Math.PI / 6, 0.6, 1.4);
    key.position.set(3, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fc4c8, 1.2);
    rim.position.set(-6, 3, -6);
    this.scene.add(rim);

    const tar = new THREE.MeshStandardMaterial({ map: woodTexture('#141414', '#000000'), roughness: 0.6, metalness: 0.05, side: THREE.DoubleSide });
    tar.map!.repeat.set(3, 1);
    const inner = new THREE.MeshStandardMaterial({ map: woodTexture('#1b1a19', '#050505'), roughness: 0.7, side: THREE.DoubleSide });
    const oak = new THREE.MeshStandardMaterial({ map: woodTexture('#1c1b1a', '#050505'), roughness: 0.6 });
    const iron = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.5, metalness: 0.4 });
    const reed = new THREE.MeshStandardMaterial({ color: 0xa88a55, roughness: 0.95, side: THREE.DoubleSide });

    const outer = new THREE.Mesh(hullGeometry(), tar);
    outer.castShadow = true;
    outer.receiveShadow = true;
    const inside = new THREE.Mesh(hullGeometry(0.03), inner);
    inside.receiveShadow = true;
    const trim = new THREE.MeshStandardMaterial({ map: woodTexture('#222120', '#060606'), roughness: 0.55 });
    this.boat.add(outer, inside, ribs(inner), gunwales(trim), strakes(iron), numberOne());

    // Two thwarts toward the bow.
    for (const x of [1.4, 2.2]) {
      const s = section((x / L) * 2);
      const th = plank(0.24, 0.05, s.top * 2 - 0.06, oak);
      th.position.set(x, s.sheer - 0.06, 0);
      this.boat.add(th);
    }

    // Cross-beam toward the stern, wider than the hull, carrying the oars on pegs.
    const beamX = -1.6;
    const bs = section((beamX / L) * 2);
    const beam = plank(0.14, 0.12, 3.2, oak);
    beam.position.set(beamX, bs.sheer + 0.08, 0);
    beam.rotation.y = 0.08;
    this.boat.add(beam);
    for (const side of [-1, 1]) {
      const peg = plank(0.05, 0.22, 0.05, iron);
      peg.position.set(beamX, bs.sheer + 0.2, side * 1.45);
      const o = oar(oak);
      o.position.set(beamX + 0.1, bs.sheer + 0.22, side * 1.5);
      // Oars rest along the hull, blades trailing outward and down toward the water.
      o.rotation.y = side * 0.22;
      o.rotation.z = 0.1;
      this.boat.add(peg, o);
    }

    const b = basket(reed);
    b.position.set(0.2, section(0.05).floor + 0.06, 0.15);
    this.boat.add(b);

    this.boat.position.y = 0.45;
    this.scene.add(this.boat);

    // Shadow catcher only: the section background shows through.
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.45 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.camera.position.set(7.5, 3.6, 8.5);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0.7, 0);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false; // the wheel keeps scrolling the page
    this.controls.enablePan = false;
    this.controls.minPolarAngle = 0.35;
    this.controls.maxPolarAngle = 1.45;
    this.controls.autoRotate = !still;
    this.controls.autoRotateSpeed = 0.5;
    canvas.style.touchAction = 'pan-y'; // OrbitControls sets 'none'; keep vertical swipes scrolling the page
    this.controls.addEventListener('start', () => { this.controls.autoRotate = false; });

    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; });
    this.io.observe(canvas);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.loop();
  }

  private resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.onMarkers) {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.onMarkers(this.markers.map((p) => {
        const v = p.clone().add(this.boat.position).project(this.camera);
        return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, behind: v.z > 1 };
      }));
    }
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.ro.disconnect();
    this.controls.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { (mat as THREE.MeshStandardMaterial).map?.dispose(); mat.dispose(); });
    });
    this.renderer.dispose();
  }
}
