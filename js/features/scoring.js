// Drum input (MIDI, keyboard, touch pads), hit matching against the expected pattern, live readout and latency calibration.
import { Audio } from '../core/audio.js';
import { makeScheduler } from '../core/scheduler.js';
import { toast } from '../core/state.js';

export const Scoring = (() => {
  const $ = id => document.getElementById(id);
  const GROUP = { kk: 'kick', sn: 'snare', xs: 'snare', hh: 'hat', ho: 'hat', hf: 'hat', t1: 'tom', t2: 'tom', fl: 'tom', rd: 'cym', cr: 'cym' };
  // General MIDI percussion map, which most electronic kits follow by default.
  const MIDI = { 35: 'kk', 36: 'kk', 37: 'sn', 38: 'sn', 40: 'sn', 42: 'hh', 44: 'hf', 46: 'ho', 22: 'hh', 26: 'ho', 41: 'fl', 43: 'fl', 45: 'fl', 47: 't2', 48: 't1', 50: 't1', 51: 'rd', 53: 'rd', 59: 'rd', 49: 'cr', 57: 'cr', 52: 'cr', 55: 'cr' };
  let expected = [], inputs = [], latency = 0, source = 'none', enabled = false; try { latency = +(localStorage.getItem('drumcourse-latency') || 0); } catch (e) {}
  const WINDOW_MAX = 0.12;
  let isPlayerRunning = () => false; // set by the player through bind()
  function reset() { expected = []; inputs = []; draw(); readout(); }
  function expect(t, voices, stepDur) {
    if (!enabled) return;
    const win = Math.min(WINDOW_MAX, stepDur * 0.5);
    for (const v of voices) expected.push({ t, v, grp: GROUP[v] || v, win, hit: null });
    if (expected.length > 600) expected.splice(0, expected.length - 600);
  }
  function hit(voice, velocity = 1) {
    const t = Audio.now() - latency / 1000;
    if (!enabled) { if (!isPlayerRunning()) Audio.play(voice, Audio.now(), velocity); return; }
    const grp = GROUP[voice] || voice;
    let best = null;
    for (const e of expected) { if (e.hit || e.grp !== grp) continue; const d = t - e.t; if (Math.abs(d) <= e.win && (!best || Math.abs(d) < Math.abs(best.d))) best = { e, d }; }
    if (best) { best.e.hit = best.d; inputs.push({ t, v: voice, err: best.d, matched: true }); }
    else inputs.push({ t, v: voice, err: null, matched: false });
    if (inputs.length > 600) inputs.splice(0, inputs.length - 600);
    flashPad(voice); readout(); draw();
  }
  function summary() {
    const now = Audio.now();
    const due = expected.filter(e => now - e.t > e.win);
    const matched = due.filter(e => e.hit !== null);
    const errs = matched.map(e => e.hit * 1000);
    const mean = errs.length ? errs.reduce((a, b) => a + b, 0) / errs.length : 0;
    const sd = errs.length > 1 ? Math.sqrt(errs.reduce((a, b) => a + (b - mean) ** 2, 0) / errs.length) : 0;
    const extra = inputs.filter(i => !i.matched && now - i.t > WINDOW_MAX).length;
    const acc = due.length ? Math.round(100 * matched.length / (due.length + extra)) : 0;
    const perVoice = {};
    for (const e of due) { const k = e.grp; perVoice[k] = perVoice[k] || { n: 0, hit: 0, sum: 0 }; perVoice[k].n++; if (e.hit !== null) { perVoice[k].hit++; perVoice[k].sum += e.hit * 1000; } }
    return { expected: due.length, played: inputs.length, matched: matched.length, missed: due.length - matched.length, extra, acc, bias: Math.round(mean), spread: Math.round(sd), perVoice };
  }
  function readout() {
    if (!enabled) return; const r = summary();
    $('sc-acc').textContent = r.expected ? r.acc + '%' : '–';
    $('sc-bias').textContent = r.matched ? (r.bias > 0 ? '+' : '') + r.bias + ' ms' : '–';
    $('sc-spread').textContent = r.matched > 1 ? r.spread + ' ms' : '–';
    $('sc-miss').textContent = r.missed; $('sc-extra').textContent = r.extra;
    const names = { kick: 'Kick', snare: 'Snare', hat: 'Hats', tom: 'Toms', cym: 'Cymbals' };
    $('sc-voices').textContent = Object.keys(r.perVoice).map(k => { const p = r.perVoice[k]; return `${names[k] || k}: ${p.hit}/${p.n}${p.hit ? ' (' + (p.sum / p.hit > 0 ? '+' : '') + Math.round(p.sum / p.hit) + ' ms)' : ''}`; }).join('   ');
  }
  function draw() {
    const cv = $('tl-canvas'); if (!cv || !enabled) return; const cx = cv.getContext('2d'); const W = cv.width, H = cv.height;
    cx.clearRect(0, 0, W, H);
    cx.strokeStyle = 'rgba(233,229,219,.25)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(0, H / 2); cx.lineTo(W, H / 2); cx.stroke();
    cx.strokeStyle = 'rgba(233,229,219,.10)'; [-50, 50].forEach(ms => { const y = H / 2 - ms / 100 * (H / 2); cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); });
    cx.fillStyle = 'rgba(233,229,219,.5)'; cx.font = '11px sans-serif'; cx.fillText('late', 6, 14); cx.fillText('early', 6, H - 6); cx.fillText('+50 ms', W - 46, H / 2 - 50 / 100 * (H / 2) - 3); cx.fillText('-50 ms', W - 46, H / 2 + 50 / 100 * (H / 2) + 12);
    const now = Audio.now(), span = 12; const colors = { kick: '#d1a648', snare: '#e9e5db', hat: '#7fb2c4', tom: '#c98a5a', cym: '#b7a4d8' };
    for (const e of expected) { if (now - e.t > span) continue; const x = W - (now - e.t) / span * W;
      if (e.hit === null) { if (now - e.t > e.win) { cx.fillStyle = 'rgba(216,103,79,.8)'; cx.fillRect(x - 1, H / 2 - 6, 2, 12); } }
      else { const y = H / 2 - Math.max(-1, Math.min(1, e.hit * 1000 / 100)) * (H / 2 - 4); cx.fillStyle = colors[e.grp] || '#fff'; cx.beginPath(); cx.arc(x, y, 3.5, 0, Math.PI * 2); cx.fill(); } }
    for (const i of inputs) { if (i.matched || now - i.t > span) continue; const x = W - (now - i.t) / span * W; cx.strokeStyle = 'rgba(216,103,79,.9)'; cx.beginPath(); cx.moveTo(x - 4, H / 2 - 4); cx.lineTo(x + 4, H / 2 + 4); cx.moveTo(x + 4, H / 2 - 4); cx.lineTo(x - 4, H / 2 + 4); cx.stroke(); }
  }
  function tick() { if (enabled && isPlayerRunning()) { draw(); readout(); } requestAnimationFrame(tick); }
  function flashPad(v) { const b = document.querySelector(`#touchpads [data-hit="${v}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 90); } }
  function setSource(name) { source = name; $('midi-status').textContent = name === 'none' ? 'No drum input connected' : 'Input: ' + name; $('p-inputsrc').textContent = name === 'none' ? 'Use the pads, the keys F J K D, or connect a MIDI kit' : name; }
  // MIDI
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false }).then(acc => {
      const wire = () => { let names = []; acc.inputs.forEach(inp => { names.push(inp.name); inp.onmidimessage = m => { const [st, note, vel] = m.data; const cmd = st & 0xf0; if (cmd === 0x99 || cmd === 0x90) { if (vel === 0) return; hit(MIDI[note] || 'sn', Math.max(0.2, vel / 127)); if (!enabled) $('midi-status').textContent = `Input: ${inp.name} (last note ${note})`; } }; });
        setSource(names.length ? names.join(', ') + ' (MIDI)' : 'none'); if (names.length && !$('p-score').checked) { $('p-score').checked = true; toggle(true); toast('MIDI kit detected. Scoring is on.'); } };
      wire(); acc.onstatechange = wire;
    }).catch(() => {});
  }
  // keyboard and touch
  const KEYS = { f: 'kk', j: 'sn', k: 'hh', d: 'fl', ' ': 'sn' };
  document.addEventListener('keydown', e => { if (e.repeat || e.target.matches('input, select, textarea')) return; const v = KEYS[e.key.toLowerCase()]; if (v && enabled) { e.preventDefault(); hit(v); } });
  document.addEventListener('pointerdown', e => { const b = e.target.closest('#touchpads [data-hit]'); if (b) { e.preventDefault(); hit(b.dataset.hit); } });
  function toggle(on) { enabled = on; $('p-scorebox').style.display = on ? 'block' : 'none'; if (on) { reset(); $('lat-val').textContent = latency ? `Latency offset ${latency} ms` : 'No latency offset set'; if (source === 'none') setSource('none'); } }
  $('p-score').addEventListener('change', e => toggle(e.target.checked));
  // latency calibration: 8 clicks at 100 BPM, hit anything on each one
  $('lat-cal').addEventListener('click', () => {
    const times = [], taps = []; let n = 0; const sched = makeScheduler(ev => { if (ev.type !== 'ui') return; });
    $('lat-val').textContent = 'Hit any pad on each of the 8 clicks...'; const wasEnabled = enabled; enabled = false;
    const handler = () => { taps.push(Audio.now()); };
    const kd = e => { if (!e.repeat && !e.target.matches('input, select, textarea')) handler(); }; const pd = e => { if (e.target.closest('#touchpads')) handler(); };
    document.addEventListener('keydown', kd); document.addEventListener('pointerdown', pd);
    const midiTap = m => { const cmd = m.data[0] & 0xf0; if ((cmd === 0x99 || cmd === 0x90) && m.data[2] > 0) handler(); };
    let midiInputs = []; if (navigator.requestMIDIAccess) navigator.requestMIDIAccess().then(acc => { acc.inputs.forEach(i => { midiInputs.push([i, i.onmidimessage]); i.onmidimessage = midiTap; }); });
    sched.start(t => { if (n >= 10) return null; if (n >= 2) times.push(t); Audio.play('click', t, 0.8, n % 4 === 0); n++; return { dur: 0.6, ui: {} }; });
    setTimeout(() => {
      document.removeEventListener('keydown', kd); document.removeEventListener('pointerdown', pd); midiInputs.forEach(([i, h]) => i.onmidimessage = h);
      const errs = []; for (const ct of times) { let best = null; for (const tp of taps) { const d = (tp - ct) * 1000; if (Math.abs(d) < 250 && (best === null || Math.abs(d) < Math.abs(best))) best = d; } if (best !== null) errs.push(best); }
      enabled = wasEnabled;
      if (errs.length >= 4) { latency = Math.round(errs.reduce((a, b) => a + b, 0) / errs.length); localStorage.setItem('drumcourse-latency', latency); $('lat-val').textContent = `Latency offset set to ${latency} ms from ${errs.length} taps. Your hits will be shifted by this amount.`; }
      else $('lat-val').textContent = `Only ${errs.length} taps lined up with clicks. Try again and hit exactly with each click.`;
    }, 7200);
  });
  requestAnimationFrame(tick);
  function bind(deps) { isPlayerRunning = deps.isPlayerRunning || isPlayerRunning; }
  return { expect, hit, reset, summary, bind, isEnabled: () => enabled };
})();
