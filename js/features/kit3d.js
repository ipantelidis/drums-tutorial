// Interactive 3D kit (Three.js, loaded from a CDN on first open): rotate, zoom, tap a part to hear it and read about it.
import { Audio } from '../core/audio.js';
import { Speech } from '../core/speech.js';
import { State } from '../core/state.js';
import { PARTS } from '../data/kit-parts.js';

export const Kit3D = (() => {
  const $ = id => document.getElementById(id);
  let THREE_, scene, camera, renderer, raycaster, meshes = [], labels = [], selected = null, loaded = false, loading = false, animId = null;
  let target, sph = { r: 3.4, theta: 0.55, phi: 1.15 }; // spherical camera around target
  const DEF = { r: 3.4, theta: 0.55, phi: 1.15 };

  function loadThree() {
    return new Promise((res, rej) => {
      if (window.THREE) return res();
      const sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      sc.onload = res; sc.onerror = () => rej(new Error('cdn'));
      document.head.appendChild(sc);
    });
  }
  function mat(color, extra = {}) { return new THREE_.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, ...extra }); }
  const SHELL = 0x7a2f2a, HEAD = 0xe6e2d8, BRASS = 0xcaa14b, STEEL = 0xa8adb5, DARK = 0x33373f, RIM = 0xc9ccd1;

  function drum(part, radius, depth, pos, rot, opts = {}) {
    const g = new THREE_.Group();
    const shell = new THREE_.Mesh(new THREE_.CylinderGeometry(radius, radius, depth, 40, 1, true), mat(opts.shell || SHELL, { side: THREE_.DoubleSide }));
    g.add(shell);
    const headTop = new THREE_.Mesh(new THREE_.CircleGeometry(radius * 0.98, 40), mat(HEAD, { roughness: 0.8 }));
    headTop.rotation.x = -Math.PI / 2; headTop.position.y = depth / 2; g.add(headTop);
    const headBot = new THREE_.Mesh(new THREE_.CircleGeometry(radius * 0.98, 40), mat(opts.bottom || HEAD, { roughness: 0.8 }));
    headBot.rotation.x = Math.PI / 2; headBot.position.y = -depth / 2; g.add(headBot);
    [depth / 2, -depth / 2].forEach(y => { const hoop = new THREE_.Mesh(new THREE_.TorusGeometry(radius, 0.012, 8, 48), mat(RIM, { metalness: 0.7, roughness: 0.3 })); hoop.rotation.x = Math.PI / 2; hoop.position.y = y; g.add(hoop); });
    for (let i = 0; i < 8; i++) { const lug = new THREE_.Mesh(new THREE_.BoxGeometry(0.03, depth * 0.5, 0.03), mat(RIM, { metalness: 0.7, roughness: 0.3 })); const a = i / 8 * Math.PI * 2; lug.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius); g.add(lug); }
    g.position.set(...pos); if (rot) g.rotation.set(...rot);
    g.traverse(m => { if (m.isMesh) { m.userData.part = part; meshes.push(m); } });
    scene.add(g); return g;
  }
  function cymbal(part, radius, pos, tilt, opts = {}) {
    const g = new THREE_.Group();
    const c = new THREE_.Mesh(new THREE_.CylinderGeometry(radius, radius * 0.97, 0.008, 48), mat(BRASS, { metalness: 0.75, roughness: 0.32 }));
    const bell = new THREE_.Mesh(new THREE_.SphereGeometry(radius * 0.22, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(BRASS, { metalness: 0.75, roughness: 0.3 }));
    bell.position.y = 0.004; g.add(c); g.add(bell);
    g.position.set(...pos); g.rotation.set(tilt[0], tilt[1], tilt[2]);
    g.traverse(m => { if (m.isMesh) { m.userData.part = part; meshes.push(m); } });
    scene.add(g); return g;
  }
  function pole(x, y0, y1, z, r = 0.012, part = null) {
    const m = new THREE_.Mesh(new THREE_.CylinderGeometry(r, r, y1 - y0, 12), mat(STEEL, { metalness: 0.8, roughness: 0.3 }));
    m.position.set(x, (y0 + y1) / 2, z); if (part) { m.userData.part = part; meshes.push(m); } scene.add(m); return m;
  }
  function tripod(x, z, h) {
    pole(x, 0.02, h, z);
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + 0.4; const leg = pole(0, 0, 0.42, 0, 0.008); leg.position.set(x + Math.cos(a) * 0.14, 0.18, z + Math.sin(a) * 0.14); leg.lookAt(x, 0.42, z); leg.rotateX(Math.PI / 2); }
  }
  function pedal(part, x, z, rotY) {
    const g = new THREE_.Group();
    const base = new THREE_.Mesh(new THREE_.BoxGeometry(0.11, 0.015, 0.3), mat(DARK)); g.add(base);
    const board = new THREE_.Mesh(new THREE_.BoxGeometry(0.09, 0.012, 0.26), mat(STEEL, { metalness: 0.7 })); board.position.set(0, 0.05, 0.02); board.rotation.x = -0.32; g.add(board);
    g.position.set(x, 0.01, z); g.rotation.y = rotY;
    g.traverse(m => { if (m.isMesh) { m.userData.part = part; meshes.push(m); } }); scene.add(g);
  }
  function label(text, pos) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const cx = cv.getContext('2d');
    cx.fillStyle = 'rgba(27,30,36,0.75)'; cx.fillRect(0, 0, 256, 64); cx.fillStyle = '#e9e5db'; cx.font = '600 28px Avenir Next, Segoe UI, Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(text, 128, 32);
    const tex = new THREE_.CanvasTexture(cv); const sp = new THREE_.Sprite(new THREE_.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sp.scale.set(0.42, 0.105, 1); sp.position.set(...pos); scene.add(sp); labels.push(sp);
  }

  function build() {
    THREE_ = window.THREE;
    const canvas = $('kit3d-canvas');
    renderer = new THREE_.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    scene = new THREE_.Scene();
    camera = new THREE_.PerspectiveCamera(42, 16 / 10, 0.1, 50);
    target = new THREE_.Vector3(0, 0.7, -0.1);
    scene.add(new THREE_.HemisphereLight(0xffffff, 0x3a3a44, 0.9));
    const key = new THREE_.DirectionalLight(0xfff2dd, 0.9); key.position.set(2, 4, 3); scene.add(key);
    const fill = new THREE_.DirectionalLight(0xcfe3ff, 0.35); fill.position.set(-3, 2, -2); scene.add(fill);
    const rug = new THREE_.Mesh(new THREE_.CircleGeometry(1.7, 48), mat(0x3b3f47, { roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.y = 0.001; scene.add(rug);

    // drummer faces +z (audience). Drummer's left is +x.
    drum('kick', 0.29, 0.42, [0, 0.3, 0.05], [Math.PI / 2, 0, 0], { bottom: 0x2b2b2b });
    pole(-0.24, 0.0, 0.2, 0.28, 0.008); pole(0.24, 0.0, 0.2, 0.28, 0.008); // kick spurs
    drum('snare', 0.18, 0.15, [0.22, 0.7, -0.38]); tripod(0.22, -0.38, 0.6);
    drum('tom1', 0.16, 0.2, [0.2, 0.98, -0.02], [0.35, 0, 0.15]);
    drum('tom2', 0.17, 0.22, [-0.2, 0.98, -0.02], [0.35, 0, -0.15]);
    pole(0, 0.5, 0.92, 0.0, 0.014); // tom mount
    drum('floor', 0.21, 0.36, [-0.62, 0.55, -0.32]); for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; pole(-0.62 + Math.cos(a) * 0.22, 0, 0.45, -0.32 + Math.sin(a) * 0.22, 0.008); }
    cymbal('hihat', 0.19, [0.66, 0.92, -0.2], [0.1, 0, -0.08]); cymbal('hihat', 0.19, [0.66, 0.905, -0.2], [0.1, 0, -0.08]);
    tripod(0.66, -0.2, 0.9); pedal('hhpedal', 0.66, -0.36, 0);
    cymbal('crash', 0.24, [0.8, 1.42, 0.22], [0.45, 0.3, -0.4]); tripod(0.7, 0.25, 1.3); pole(0.7, 1.3, 1.36, 0.25);
    cymbal('ride', 0.3, [-0.82, 1.22, 0.05], [0.35, -0.2, 0.55]); tripod(-0.72, 0.1, 1.05); pole(-0.72, 1.05, 1.14, 0.1);
    pedal('kickpedal', 0, -0.25, 0);
    const seat = new THREE_.Mesh(new THREE_.CylinderGeometry(0.19, 0.19, 0.06, 32), mat(0x1e1e22, { roughness: 0.9 })); seat.position.set(0.05, 0.6, -0.95); seat.userData.part = 'throne'; meshes.push(seat); scene.add(seat);
    tripod(0.05, -0.95, 0.57);

    label('Kick', [0, 0.05, 0.42]); label('Snare', [0.22, 0.86, -0.38]); label('Hi hat', [0.66, 1.06, -0.2]); label('Crash', [0.8, 1.6, 0.22]);
    label('High tom', [0.2, 1.2, -0.02]); label('Mid tom', [-0.2, 1.2, -0.02]); label('Floor tom', [-0.62, 0.84, -0.32]); label('Ride', [-0.82, 1.42, 0.05]); label('Throne', [0.05, 0.74, -0.95]);

    raycaster = new THREE_.Raycaster();
    bindControls(canvas); resize(); animate();
    Object.keys(PARTS).forEach(k => { const b = document.createElement('button'); b.className = 'btn sm'; b.textContent = PARTS[k].name.replace(/ \(.*\)/, ''); b.dataset.part = k; b.addEventListener('click', () => select(k, true)); $('k3-parts').appendChild(b); });
    window.addEventListener('resize', resize);
  }
  function resize() {
    const c = $('kit3d-canvas'); const w = c.clientWidth || 800, h = c.clientHeight || 500;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  function placeCamera() {
    camera.position.set(target.x + sph.r * Math.sin(sph.phi) * Math.sin(sph.theta), target.y + sph.r * Math.cos(sph.phi), target.z + sph.r * Math.sin(sph.phi) * Math.cos(sph.theta));
    camera.lookAt(target);
  }
  function animate() { animId = requestAnimationFrame(animate); if (!$('view-kit3d').classList.contains('active')) return; placeCamera(); labels.forEach(l => l.visible = $('k3-labels').checked); renderer.render(scene, camera); }
  function bindControls(canvas) {
    let down = null, moved = false, pinch = null;
    canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: sph.theta, p: sph.phi }; moved = false; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      sph.theta = down.t - dx * 0.008; sph.phi = Math.min(1.5, Math.max(0.35, down.p - dy * 0.006));
    });
    canvas.addEventListener('pointerup', e => { if (down && !moved) pick(e); down = null; });
    canvas.addEventListener('pointercancel', () => down = null);
    canvas.addEventListener('wheel', e => { e.preventDefault(); sph.r = Math.min(7, Math.max(1.6, sph.r * (1 + e.deltaY * 0.001))); }, { passive: false });
    canvas.addEventListener('touchstart', e => { if (e.touches.length === 2) pinch = dist(e); }, { passive: true });
    canvas.addEventListener('touchmove', e => { if (e.touches.length === 2 && pinch) { const d = dist(e); sph.r = Math.min(7, Math.max(1.6, sph.r * pinch / d)); pinch = d; down = null; } }, { passive: true });
    function dist(e) { const a = e.touches[0], b = e.touches[1]; return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }
  }
  function pick(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const v = new THREE_.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(v, camera); const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length) select(hits[0].object.userData.part, true);
  }
  function select(part, play) {
    const info = PARTS[part]; if (!info) return; selected = part;
    meshes.forEach(m => { const on = m.userData.part === part; if (m.material.emissive) { m.material.emissive.setHex(on ? 0xd1a648 : 0x000000); m.material.emissiveIntensity = on ? 0.35 : 0; } });
    $('k3-parts').querySelectorAll('button').forEach(b => b.classList.toggle('sel', b.dataset.part === part));
    if (play && info.voice) { Audio.play(info.voice, Audio.now(), 1); if (info.alt) Audio.play(info.alt, Audio.now() + 0.6, 1); }
    $('k3-info').innerHTML = `<h3>${info.name}</h3>
      <div class="fact"><b>Job in the groove</b>${info.job}</div>
      <div class="fact"><b>How it is played</b>${info.play}</div>
      <div class="fact"><b>In notation</b>${info.notation}</div>
      <div class="fact"><b>In tabs</b>${info.tab || 'Not written.'}</div>
      <div class="fact"><b>On your electronic kit</b>${info.ekit}</div>
      <div class="row" style="margin-top:12px">${info.voice ? `<button class="btn sm" id="k3-hear">Hear it</button>` : ''}<button class="btn sm" data-read>Read aloud</button><button class="btn sm" id="k3-back">All parts</button></div>`;
    const hb = $('k3-hear'); if (hb) hb.addEventListener('click', () => { Audio.play(info.voice, Audio.now(), 1); if (info.alt) Audio.play(info.alt, Audio.now() + 0.6, 1); });
    $('k3-back').addEventListener('click', () => { $('k3-info').innerHTML = '<h3>Tap a part of the kit</h3><p class="muted">Or pick one from the list.</p><div class="kit3d-parts" id="k3-parts"></div>'; Object.keys(PARTS).forEach(k => { const b = document.createElement('button'); b.className = 'btn sm'; b.textContent = PARTS[k].name.replace(/ \(.*\)/, ''); b.dataset.part = k; b.addEventListener('click', () => select(k, true)); $('k3-parts').appendChild(b); }); meshes.forEach(m => { if (m.material.emissive) m.material.emissive.setHex(0); }); });
    State.badge('kit');
  }
  let tourTimer = null;
  function tour() {
    const order = ['kick', 'snare', 'hihat', 'tom1', 'tom2', 'floor', 'ride', 'crash', 'kickpedal', 'hhpedal', 'throne']; let i = 0;
    if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; Speech.stop(); $('k3-tour').textContent = 'Guided tour'; $('k3-msg').textContent = ''; return; }
    $('k3-tour').textContent = 'Stop tour';
    const useVoice = Speech.on();
    function step() {
      if (i >= order.length) { tourTimer = null; $('k3-tour').textContent = 'Guided tour'; $('k3-msg').textContent = 'Tour finished.'; return; }
      const k = order[i++]; select(k, true); $('k3-msg').textContent = `${i} of ${order.length}: ${PARTS[k].name}`;
      const text = `${PARTS[k].name}. ${PARTS[k].job} ${PARTS[k].play}`;
      if (useVoice) { Speech.stop(); Speech.say(text); const words = text.split(' ').length; tourTimer = setTimeout(step, Math.max(6000, words * 380)); }
      else tourTimer = setTimeout(step, 9000);
    }
    step();
  }
  async function open() {
    if (loaded || loading) return; loading = true; $('k3-msg').textContent = 'Loading the 3D view...';
    try { await loadThree(); build(); loaded = true; $('k3-msg').textContent = 'Drag to rotate, tap a part to hear it.'; }
    catch (e) { $('k3-msg').textContent = 'The 3D library could not be loaded. Check your internet connection once, then reopen this tab. The kit anatomy panel in Theory covers the same parts in 2D.'; }
    loading = false;
  }
  document.getElementById('k3-reset').addEventListener('click', () => { Object.assign(sph, DEF); });
  document.getElementById('k3-tour').addEventListener('click', () => { if (loaded) tour(); });
  return { open, select };
})();
