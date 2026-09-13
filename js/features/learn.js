// Static learning views: theory, technique, common mistakes, reading examples and the rhythm library.
import { XVOICE, renderNotation, renderTab } from '../render/notation.js';
import { row, G, GROOVES } from '../data/grooves.js';
import { THEORY, TECHNIQUE, MISTAKES, READING_INTRO, READING_EXAMPLES } from '../data/content.js';

let rcat = null; // selected rhythm library category

function kitSvg() {
  const P = (id, x, y, r, label, ry) => `<g class="part" data-pad="${id}"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry || r}" fill="${XVOICE.has(id) ? '#c9a24a' : '#3a4049'}" stroke="#e9e5db" stroke-width="2" opacity=".9"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" fill="#e9e5db">${label}</text></g>`;
  return `<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
    ${P('cr', 110, 60, 46, 'Crash')} ${P('rd', 450, 70, 52, 'Ride')} ${P('hh', 70, 165, 38, 'Hi hat')}
    ${P('t1', 220, 95, 40, 'High tom')} ${P('t2', 320, 95, 44, 'Mid tom')} ${P('fl', 440, 195, 52, 'Floor tom')}
    ${P('kk', 270, 190, 70, 'Kick', 55)} ${P('sn', 150, 215, 46, 'Snare')}
    <text x="280" y="285" text-anchor="middle" font-size="12" fill="#a39d90">You sit here. Tap any drum or cymbal.</text></svg>`;
}
export function renderTheory() {
  document.getElementById('theory').innerHTML = THEORY.map(s => `<div class="panel"><h3>${s.t}</h3>${s.kit ? `<div class="kit">${kitSvg()}</div>` : ''}${s.html}<div class="row">${s.g ? `<button class="btn sm" data-groove="${s.g}">Listen: ${G(s.g).name}</button>` : ''}<button class="btn sm" data-read>Read aloud</button></div></div>`).join('');
}
export function renderTechnique() {
  document.getElementById('technique').innerHTML = TECHNIQUE.map(s => `<div class="panel"><h3>${s.t}</h3>${s.html}<div class="row">${s.g ? `<button class="btn sm" data-groove="${s.g}">Exercise: ${G(s.g).name}</button>` : ''}<button class="btn sm" data-read>Read aloud</button></div></div>`).join('');
}
export function renderMistakes() {
  document.getElementById('mistakes').innerHTML = MISTAKES.map(m => `<div class="panel"><h3>${m.t}</h3><p><b>Symptom.</b> ${m.s}</p><p><b>Diagnose.</b> ${m.d}</p><p><b>Fix.</b> ${m.f}</p><div class="row">${m.g ? `<button class="btn sm" data-groove="${m.g}">Drill: ${G(m.g).name}</button>` : ''}<button class="btn sm" data-read>Read aloud</button></div></div>`).join('');
}
export function renderReading() {
  let h = `<div class="panel"><h3>Legend</h3>${READING_INTRO}<div class="notation">${renderNotation({ beats: 4, spb: 4, bars: 1, sig: '4/4', beam: 4, stick: 'R...L...K.......', voices: { cr: row('x...............'), hh: row('....x...........'), ho: row('.....x..........'), rd: row('......x.........'), t1: row('........x.......'), t2: row('.........x......'), sn: row('..........x.o.X.'), fl: row('...........x....'), kk: row('............x...'), hf: row('.............x..') } }, null, { counts: false })}</div><p class="small muted">Left to right: crash, closed hat, open hat, ride, high tom, mid tom, snare, floor tom, kick, hat foot, ghost snare, accented snare. Sticking letters below.</p><button class="btn sm" data-read>Read aloud</button></div>`;
  h += `<div class="panel"><h3>Examples, easy to hard</h3><p class="muted small">Read it first, clap or play it, then press play to check. Level numbers match the curriculum.</p>`;
  READING_EXAMPLES.forEach((r, i) => { const gr = G(r.g); h += `<div class="ex"><div class="t">${i + 1}. ${gr.name} <span class="chip">Level ${r.lvl}</span></div><div class="d">${r.note}</div><div class="notation">${renderNotation(gr)}</div><div class="tab">${renderTab(gr)}</div><div class="row"><button class="btn sm" data-groove="${r.g}">Play and see the grid</button></div></div>`; });
  document.getElementById('reading').innerHTML = h + '</div>';
}
export function renderRhythms() {
  const cats = [...new Set(GROOVES.map(g => g.cat))]; const cb = document.getElementById('cats'); cb.innerHTML = '';
  let cur = rcat || cats[0];
  cats.forEach(c => { const b = document.createElement('button'); b.className = 'btn sm' + (c === cur ? ' sel' : ''); b.textContent = c; b.onclick = () => { rcat = c; renderRhythms(); }; cb.appendChild(b); });
  document.getElementById('glist').innerHTML = GROOVES.filter(g => g.cat === cur).map(g => `<div class="gcard" data-groove="${g.id}"><div class="nm">${g.name}</div><div class="mt">${g.sig} · ${g.bpm} BPM · ${g.bars} bar${g.bars > 1 ? 's' : ''}</div></div>`).join('');
}
