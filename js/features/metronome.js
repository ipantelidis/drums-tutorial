// Metronome with subdivisions, accented 1, gap trainer, tap tempo and the tempo trainer.
import { Audio } from '../core/audio.js';
import { makeScheduler } from '../core/scheduler.js';
import { Speech } from '../core/speech.js';
import { State } from '../core/state.js';
import { go } from '../core/nav.js';

export const Metronome = (() => {
  const $ = id => document.getElementById(id);
  const playBtn = $('m-play'), bpmEl = $('m-bpm'), bpmVal = $('m-bpm-val'), sigEl = $('m-sig'), subEl = $('m-sub'), volEl = $('m-vol'), beatsEl = $('m-beats');
  let beat = 0, sub = 0, bar = 0, trainer = null, startT = 0, taps = [];
  const bpm = () => +bpmEl.value;
  function setBpm(v) { bpmEl.value = Math.min(240, Math.max(30, Math.round(v))); bpmVal.textContent = bpmEl.value; }
  function drawBeats() {
    beatsEl.innerHTML = ''; const nb = +sigEl.value, s = +subEl.value;
    for (let b = 0; b < nb; b++) { const d = document.createElement('div'); d.className = 'beat'; d.textContent = b + 1; d.dataset.b = b; d.dataset.s = 0; beatsEl.appendChild(d); for (let k = 1; k < s; k++) { const x = document.createElement('div'); x.className = 'beat sub'; x.dataset.b = b; x.dataset.s = k; beatsEl.appendChild(x); } }
  }
  const sched = makeScheduler(ev => {
    if (ev.type === 'ui') { beatsEl.querySelectorAll('.beat').forEach(x => x.classList.toggle('lit', +x.dataset.b === ev.b && +x.dataset.s === ev.s)); if (ev.say) Speech.say(ev.say, { short: true }); if (ev.status) $('m-status').textContent = ev.status; }
    else { beatsEl.querySelectorAll('.beat').forEach(x => x.classList.remove('lit')); playBtn.textContent = 'Play'; playBtn.classList.remove('on'); const st = State.get(); st.stats.metroSec += Audio.now() - startT; if (st.stats.metroSec >= 1800) State.badge('timekeeper'); State.save(); trainer = null; }
  });
  function gen(t) {
    const nb = +sigEl.value, s = +subEl.value, vol = volEl.value / 100; const muted = $('m-gap').checked && (bar % 4 >= 2);
    if (!muted) { if (sub === 0) Audio.play('click', t, vol, beat === 0); else Audio.play('sub', t, vol); }
    const ui = { b: beat, s: sub, say: $('m-speak').checked && sub === 0 ? '' + (beat + 1) : null, status: `Bar ${bar + 1}${muted ? ' (silent)' : ''} at ${bpm()} BPM` };
    sub++; if (sub >= s) { sub = 0; beat++; if (beat >= nb) { beat = 0; bar++; if (trainer && bar % trainer.bars === 0) { setBpm(bpm() + trainer.step); ui.status = `Tempo up: ${bpm()} BPM`; } } }
    return { dur: 60 / bpm() / s, ui };
  }
  function start() { beat = 0; sub = 0; bar = 0; startT = Audio.now(); sched.start(gen); playBtn.textContent = 'Stop'; playBtn.classList.add('on'); }
  playBtn.addEventListener('click', () => { if (sched.isRunning()) sched.stop(); else start(); });
  bpmEl.addEventListener('input', () => bpmVal.textContent = bpm());
  document.querySelectorAll('[data-bpm-step]').forEach(b => b.addEventListener('click', () => setBpm(bpm() + +b.dataset.bpmStep)));
  sigEl.addEventListener('change', () => { beat = 0; sub = 0; drawBeats(); }); subEl.addEventListener('change', () => { beat = 0; sub = 0; drawBeats(); });
  $('m-tap').addEventListener('click', () => { const now = performance.now(); taps = taps.filter(x => now - x < 3000); taps.push(now); if (taps.length >= 2) { const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); setBpm(60000 / iv); $('m-status').textContent = `Tap tempo: ${bpm()} BPM`; } else $('m-status').textContent = 'Keep tapping'; });
  $('t-go').addEventListener('click', () => { if (sched.isRunning()) sched.stop(); setBpm(+$('t-start').value); trainer = { step: +$('t-step').value, bars: +$('t-bars').value }; start(); go('metro'); });
  drawBeats();
  return { setBpm, start, stop: () => sched.stop(), isRunning: () => sched.isRunning(), bpm };
})();
