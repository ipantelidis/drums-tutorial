// Groove player: step grid, playback, editing, tempo ramp, band, spoken count and the timed pass tests.
import { Audio } from '../core/audio.js';
import { makeScheduler } from '../core/scheduler.js';
import { Speech } from '../core/speech.js';
import { State, toast } from '../core/state.js';
import { go } from '../core/nav.js';
import { G, GROOVES, VOICE_ORDER, VOICE_NAMES } from '../data/grooves.js';
import { LEVELS } from '../data/curriculum.js';
import { renderNotation, renderTab, countLabel, speakLabel } from '../render/notation.js';
import { Scoring } from './scoring.js';
import { checkLevelBadges } from './curriculum.js';

export const Player = (() => {
  const $ = id => document.getElementById(id);
  const seqEl = $('seq'), playBtn = $('p-play'), bpmEl = $('p-bpm'), bpmVal = $('p-bpm-val'), speedEl = $('p-speed'), speedVal = $('p-speed-val'), dynEl = $('p-dyn'), dynVal = $('p-dyn-val');
  const loopEl = $('p-loop'), clickEl = $('p-click'), countEl = $('p-countin'), statusEl = $('p-status'), countMode = $('p-count');
  let g = null, pattern = null, step = 0, countLeft = 0, test = null, testEnd = 0, testTimer = null, playedSec = 0, startedAt = 0;
  const muted = new Set(); let barsPlayed = 0;
  const NOTE = { C: 130.81, 'C#': 138.59, D: 146.83, 'D#': 155.56, E: 164.81, F: 174.61, 'F#': 185.0, G: 196.0, 'G#': 207.65, A: 110.0, 'A#': 116.54, B: 123.47 };
  function chordRoot(sym) { const m = sym.match(/^([A-G]#?)(m?)$/); return m ? { f: NOTE[m[1]], minor: !!m[2] } : { f: 110, minor: false }; }
  const DYN = { 30: 'pp', 40: 'p', 50: 'p', 60: 'mp', 70: 'mp', 80: 'mf', 90: 'mf', 100: 'mf', 110: 'f', 120: 'f', 130: 'ff' };
  const effBpm = () => Math.round(+bpmEl.value * +speedEl.value / 100);
  const n = () => g.beats * g.spb * g.bars;
  const stepDur = () => 60 / effBpm() / g.spb;
  function open(id, bpm) { clearInterval(testTimer); test = null; load(G(id)); if (bpm) { bpmEl.value = bpm; bpmVal.textContent = bpm; } updateStatus(); }
  function load(x) {
    if (sched.isRunning()) sched.stop(); g = x; step = 0; pattern = JSON.parse(JSON.stringify(g.voices));
    bpmEl.value = g.bpm; bpmVal.textContent = g.bpm; $('p-title').textContent = `${g.name} (${g.cat})`; render();
    $('p-desc').innerHTML = `<p>${g.desc || ''}</p>`; $('p-bpm-hint').textContent = g.spb === 2 ? 'Tempo is the eighth note in this meter.' : '';
    if (!test) statusEl.innerHTML = '';
  }
  function cellClass(val, i) { return 'cell ' + (val === 0 ? '' : val > 1.1 ? 'v2' : val < 0.6 ? 'vg' : 'v1') + (i % g.spb === 0 ? ' beatstart' : ''); }
  function render() {
    const N = n(), used = VOICE_ORDER.filter(v => pattern[v]);
    let h = '<table><thead><tr><th></th>';
    for (let i = 0; i < N; i++) h += `<th class="${i % g.spb === 0 ? 'beat' : ''}" data-col="${i}">${countLabel(g, i)}</th>`;
    h += '</tr></thead><tbody>';
    for (const v of used) { h += `<tr data-voice="${v}" class="${muted.has(v) ? 'muted' : ''}"><th class="mutable" data-mute="${v}" title="Click to mute or unmute">${VOICE_NAMES[v]}</th>`; for (let i = 0; i < N; i++) h += `<td class="${cellClass(pattern[v][i] || 0, i)}" data-col="${i}" data-v="${v}" data-i="${i}"></td>`; h += '</tr>'; }
    h += '</tbody>';
    if (g.stick) { h += '<tfoot><tr><th style="text-align:left">Sticking</th>'; for (let i = 0; i < N; i++) h += `<th data-col="${i}">${g.stick[i] === '.' ? '' : g.stick[i]}</th>`; h += '</tr></tfoot>'; }
    seqEl.innerHTML = h + '</table>';
    $('p-notation-box').innerHTML = $('p-notation').checked ? `<div class="notation">${renderNotation(g, pattern)}</div>` : '';
    $('p-tab').textContent = renderTab(g, pattern);
    updateStatus();
  }
  function updateStatus() { if (test) return; statusEl.textContent = `${g.sig}, ${g.bars} bar${g.bars > 1 ? 's' : ''}. Effective tempo ${effBpm()} BPM.`; }
  seqEl.addEventListener('click', e => {
    const mt = e.target.closest('[data-mute]'); if (mt) { const v = mt.dataset.mute; if (muted.has(v)) muted.delete(v); else muted.add(v); mt.closest('tr').classList.toggle('muted', muted.has(v)); return; }
    const c = e.target.closest('.cell'); if (!c) return; const v = c.dataset.v, i = +c.dataset.i, cur = pattern[v][i] || 0;
    const next = cur === 0 ? 1 : cur === 1 ? 1.3 : cur === 1.3 ? 0.35 : 0; pattern[v][i] = next; if (next) Audio.play(v, Audio.now(), next);
    c.className = cellClass(next, i); $('p-notation-box').innerHTML = $('p-notation').checked ? `<div class="notation">${renderNotation(g, pattern)}</div>` : ''; $('p-tab').textContent = renderTab(g, pattern); State.badge('editor');
  });
  const sched = makeScheduler(ev => {
    if (ev.type === 'ui') {
      seqEl.querySelectorAll('.col-now').forEach(x => x.classList.remove('col-now'));
      if (ev.say) Speech.say(ev.say, { short: true });
      if (ev.count !== undefined) { if (!test) statusEl.textContent = 'Count in: ' + ev.count; return; }
      seqEl.querySelectorAll(`[data-col="${ev.i}"]`).forEach(x => x.classList.add('col-now'));
    } else {
      seqEl.querySelectorAll('.col-now').forEach(x => x.classList.remove('col-now'));
      playBtn.textContent = 'Play'; playBtn.classList.remove('on');
      const st = State.get(); st.stats.grooves++; if (Audio.now() - startedAt > 20) State.badge('first_groove'); State.save();
      if (test && ev.type === 'stop' && !testDone) { clearInterval(testTimer); statusEl.innerHTML = `Test stopped early. <button class="btn sm" id="p-test-retry">Try again</button>`; $('p-test-retry').onclick = () => startTest(test); }
      if (!test) updateStatus();
    }
  });
  let testDone = false;
  function gen(t) {
    const spb = g.spb, N = n(), mode = +countMode.value;
    if (countLeft > 0) { const c = g.beats - countLeft + 1; Audio.play('click', t, 0.8, c === 1); countLeft--; return { dur: stepDur() * spb, ui: { count: c, say: mode ? '' + c : null } }; }
    if (step >= N) {
      if (loopEl.checked || test) { step = 0; barsPlayed += g.bars; const ramp = +$('p-ramp').value, every = +$('p-rampbars').value, max = +$('p-rampmax').value;
        if (ramp && !test && barsPlayed % every === 0 && +bpmEl.value < max) { bpmEl.value = Math.min(max, +bpmEl.value + ramp); bpmVal.textContent = bpmEl.value; updateStatus(); toast(`Tempo up: ${bpmEl.value} BPM`); } }
      else return null;
    }
    const dyn = +dynEl.value / 100;
    const hitVoices = [];
    for (const v in pattern) { const vel = pattern[v][step]; if (vel) { hitVoices.push(v); if (!muted.has(v)) Audio.play(v, t, vel * dyn); } }
    if (hitVoices.length) Scoring.expect(t, hitVoices, stepDur());
    if ($('p-bass').checked) {
      const prog = $('p-prog').value.split(','); const barIdx = Math.floor(step / (g.beats * g.spb)); const bar = (Math.floor(barsPlayed / g.bars) * g.bars + barIdx) % prog.length; const ch = chordRoot(prog[bar]);
      if (pattern.kk && pattern.kk[step]) Audio.play('bass', t, 1, (step % (g.beats * g.spb)) >= g.beats * g.spb / 2 ? ch.f * 1.5 : ch.f);
      if (step % (g.beats * g.spb) === 0) Audio.play('pad', t, 1, { f: ch.f * 2 * (ch.minor ? 1.1892 : 1.2599), dur: g.beats * stepDur() * g.spb });
    }
    if (clickEl.checked && step % spb === 0) Audio.play('click', t, 0.45, (step / spb) % g.beats === 0);
    const ui = { i: step, say: mode ? speakLabel(g, step, mode) : null }; step++;
    return { dur: stepDur(), ui };
  }
  function start() { step = 0; barsPlayed = 0; countLeft = countEl.checked ? g.beats : 0; startedAt = Audio.now(); Scoring.reset(); sched.start(gen); playBtn.textContent = 'Stop'; playBtn.classList.add('on'); if (effBpm() < 60) State.badge('slow'); if (g.beats === 5 || g.beats === 7 || g.sig.endsWith('/8')) State.badge('odd'); }
  playBtn.addEventListener('click', () => { if (sched.isRunning()) { sched.stop(); } else start(); });
  bpmEl.addEventListener('input', () => { bpmVal.textContent = bpmEl.value; updateStatus(); });
  speedEl.addEventListener('input', () => { speedVal.textContent = speedEl.value + '%'; updateStatus(); });
  dynEl.addEventListener('input', () => { dynVal.textContent = DYN[dynEl.value] || 'mf'; });
  $('p-notation').addEventListener('change', render);
  $('p-reset').addEventListener('click', () => { test = null; load(g); });
  $('p-prev').addEventListener('click', () => { const i = GROOVES.indexOf(g); test = null; load(GROOVES[(i - 1 + GROOVES.length) % GROOVES.length]); });
  $('p-next').addEventListener('click', () => { const i = GROOVES.indexOf(g); test = null; load(GROOVES[(i + 1) % GROOVES.length]); });

  function startTest(t) {
    test = null; testDone = false; load(G(t.g)); test = t; bpmEl.value = t.bpm; bpmVal.textContent = t.bpm; speedEl.value = 100; speedVal.textContent = '100%'; loopEl.checked = true;
    const total = t.min * 60; let left = total;
    statusEl.innerHTML = `<b>Pass test:</b> ${t.text}<br><span class="bigtimer" id="p-test-clock">${fmt(left)}</span> <button class="btn sm" id="p-test-cancel">Cancel test</button>`;
    $('p-test-cancel').onclick = () => { clearInterval(testTimer); test = null; if (sched.isRunning()) sched.stop(); updateStatus(); };
    start();
    const t0 = Date.now() + (countEl.checked ? g.beats * 60 / t.bpm * 1000 : 0);
    testTimer = setInterval(() => {
      left = Math.max(0, total - Math.floor((Date.now() - t0) / 1000)); const c = $('p-test-clock'); if (c) c.textContent = fmt(left);
      if (left <= 0) { clearInterval(testTimer); testDone = true; sched.stop(); finishTest(); }
    }, 250);
  }
  function finishTest() {
    let measured = '';
    if ($('p-score').checked) {
      const r = Scoring.summary();
      if (r.expected >= 8 && r.played >= r.expected * 0.5) {
        const pass = r.acc >= 90 && Math.abs(r.bias) <= 30 && r.spread <= 35;
        measured = `<div class="verdict ${pass ? 'pass' : 'fail'}"><b>Measured:</b> ${r.acc}% of hits landed, average ${r.bias > 0 ? r.bias + ' ms late' : (-r.bias) + ' ms early'}, consistency ${r.spread} ms, ${r.missed} missed, ${r.extra} extra. ${pass ? 'That is a pass by the numbers.' : r.acc < 90 ? 'Too many notes missed or added, slow it down with the speed slider.' : Math.abs(r.bias) > 30 ? 'You are ' + (r.bias > 0 ? 'dragging' : 'rushing') + ' the click. Try the spoken count.' : 'Timing wanders. Practise with the click louder.'}</div>`;
      } else if (r.played > 0) measured = `<div class="verdict fail">Not enough hits were detected to judge this run (${r.played} of ${r.expected}). Check the input mapping below the grid.</div>`;
    }
    statusEl.innerHTML = measured + `<b>Time.</b> Did you play it cleanly for the whole duration, with the click, without stopping? Be honest, nobody is checking but you.<br>
      <button class="btn good" id="p-test-yes">Yes, clean</button> <button class="btn" id="p-test-no">Not yet</button>`;
    $('p-test-yes').onclick = () => { State.get().passes[test.id] = Date.now(); State.addXP(60, 'pass test'); checkLevelBadges(); const done = test; test = null; statusEl.innerHTML = `Passed: ${done.text} <button class="btn sm" data-go="curriculum">Back to curriculum</button>`; };
    $('p-test-no').onclick = () => { const t = test; test = null; statusEl.innerHTML = `No problem. Drop the speed slider to 80 percent and build back up. <button class="btn sm" id="p-test-retry">Try again</button>`; $('p-test-retry').onclick = () => startTest(t); };
  }
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { open, load, startTest, isRunning: () => sched.isRunning(), current: () => g };
})();

Scoring.bind({ isPlayerRunning: () => Player.isRunning() });

// Anything with data-groove opens that groove in the player; data-test starts a pass test.
document.body.addEventListener('click', e => {
  const gl = e.target.closest('[data-groove]'); if (gl) { Player.open(gl.dataset.groove, gl.dataset.bpm ? +gl.dataset.bpm : null); go('play'); }
  const b = e.target.closest('[data-test]'); if (b) { const t = LEVELS.flatMap(L => L.tests).find(x => x.id === b.dataset.test); go('play'); Player.startTest(t); }
});
