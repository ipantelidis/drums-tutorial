// Reading challenge (hear a groove, pick its notation) and the tab reading test.
import { Audio } from '../core/audio.js';
import { makeScheduler } from '../core/scheduler.js';
import { State } from '../core/state.js';
import { go } from '../core/nav.js';
import { G } from '../data/grooves.js';
import { renderNotation, renderTab } from '../render/notation.js';
import { Player } from './player.js';

// Groove ids per difficulty, shared by both tests.
const POOL = d => d === 1 ? ['coord1', 'coord2', 'rock1', 'rock2', 'rock3', 'rock4', 'rock5', 'half1']
  : d === 2 ? ['six1', 'six2', 'six3', 'six4', 'alt8', 'rockcrash', 'ride', 'half2', 'sel1', 'sel3', 'bon2']
  : ['shuf1', 'shuf2', 'halfshuf', 'seven4', 'five4', 'linear1', 'flamgroove', 'bon1', 'sel2', 'herta', 'mason2'];

function readingChallenge() {
  const $ = id => document.getElementById(id); let answer = null, opts = [], locked = false;
  const sched = makeScheduler(() => {}); let st = 0, gg = null;
  function newRound() {
    const p = POOL(+$('q-diff').value).slice().sort(() => Math.random() - 0.5); opts = p.slice(0, 3).map(G); answer = opts[Math.floor(Math.random() * 3)]; locked = false;
    $('q-opts').innerHTML = opts.map((g, i) => `<div class="opt" data-q="${i}">${renderNotation(g, null, { counts: false })}</div>`).join('');
    $('q-status').textContent = 'Listening... which one is it?';
  }
  function play() {
    if (!answer || locked) newRound(); if (sched.isRunning()) sched.stop(); gg = answer; st = 0;
    sched.start(t => { const N = gg.beats * gg.spb * gg.bars * 2; if (st >= N) return null; const i = st % (gg.beats * gg.spb * gg.bars); for (const v in gg.voices) if (gg.voices[v][i]) Audio.play(v, t, gg.voices[v][i]); st++; return { dur: 60 / gg.bpm / gg.spb, ui: {} }; });
  }
  $('q-play').addEventListener('click', play);
  $('q-diff').addEventListener('change', () => { answer = null; $('q-opts').innerHTML = ''; });
  $('q-opts').addEventListener('click', e => {
    const o = e.target.closest('.opt'); if (!o || locked || !answer) return; locked = true; const g = opts[+o.dataset.q]; const s = State.get(); s.stats.quizTotal++;
    if (g === answer) { o.classList.add('right'); s.stats.quizRight++; State.addXP(15, 'reading challenge'); $('q-status').textContent = `Right, that was ${answer.name}. Press play for another.`; if (s.stats.quizRight >= 5) State.badge('reader5'); if (s.stats.quizRight >= 25) State.badge('reader25'); }
    else { o.classList.add('wrong'); $('q-opts').querySelectorAll('.opt')[opts.indexOf(answer)].classList.add('right'); $('q-status').textContent = `Not that one. It was ${answer.name}. Press play for another.`; State.save(); }
    $('q-score').textContent = `Score ${s.stats.quizRight} of ${s.stats.quizTotal}`;
  });
  $('q-score').textContent = `Score ${State.get().stats.quizRight} of ${State.get().stats.quizTotal}`;
}

function tabReadingTest() {
  const $ = id => document.getElementById(id); let cur = null, shown = false;
  const sched = makeScheduler(() => {}); let st = 0;
  function fresh() {
    const p = POOL(+$('tt-diff').value);
    const id = p[Math.floor(Math.random() * p.length)]; cur = G(id); shown = false;
    $('tt-tab').textContent = renderTab(cur); $('tt-notation').style.display = 'none'; $('tt-notation').innerHTML = '';
    $('tt-status').textContent = `${cur.sig}, ${cur.bars} bar${cur.bars > 1 ? 's' : ''}. Read it, then check.`;
  }
  function check() {
    if (!cur) fresh();
    $('tt-notation').innerHTML = renderNotation(cur); $('tt-notation').style.display = 'block';
    if (!shown) { shown = true; $('tt-status').textContent = `This is ${cur.name}. Listen twice, then open it in the player to slow it down.`; State.addXP(5, 'tab reading'); }
    if (sched.isRunning()) sched.stop(); st = 0; const g = cur;
    sched.start(t => { const N = g.beats * g.spb * g.bars * 2; if (st >= N) return null; const i = st % (g.beats * g.spb * g.bars); for (const v in g.voices) if (g.voices[v][i]) Audio.play(v, t, g.voices[v][i]); st++; return { dur: 60 / g.bpm / g.spb, ui: {} }; });
  }
  $('tt-new').addEventListener('click', fresh);
  $('tt-check').addEventListener('click', check);
  $('tt-diff').addEventListener('change', fresh);
  $('tt-open').addEventListener('click', () => { if (!cur) fresh(); Player.open(cur.id, null); go('play'); });
  fresh();
}

export function initQuizzes() { readingChallenge(); tabReadingTest(); }
