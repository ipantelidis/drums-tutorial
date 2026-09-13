// Curriculum view: level cards, goals checklist, exercises and pass tests.
import { State } from '../core/state.js';
import { LEVELS } from '../data/curriculum.js';
import { G } from '../data/grooves.js';

export function checkLevelBadges() { const st = State.get(); LEVELS.forEach(L => { if (L.tests.every(t => st.passes[t.id])) State.badge('lvl' + L.id); }); }
let curLevel = 1;
function levelProgress(L) { const st = State.get(); const tp = L.tests.filter(t => st.passes[t.id]).length, gp = L.goals.filter((_, i) => st.checks[`L${L.id}g${i}`]).length; return { tp, gp, pct: Math.round(100 * (tp + gp) / (L.tests.length + L.goals.length)) }; }
function levelUnlocked(L) { if (L.id === 1) return true; const prev = LEVELS.find(x => x.id === L.id - 1); return prev.tests.every(t => State.get().passes[t.id]); }
export function renderCurriculum() {
  const box = document.getElementById('levels'); box.innerHTML = '';
  LEVELS.forEach(L => { const p = levelProgress(L), un = levelUnlocked(L); const d = document.createElement('div'); d.className = 'lvl' + (L.id === curLevel ? ' sel' : '') + (un ? '' : ' locked');
    d.innerHTML = `<div class="t">${L.title}</div><div class="muted small">${L.weeks}</div><div class="bar green"><i style="width:${p.pct}%"></i></div><div class="small muted" style="margin-top:4px">${p.tp}/${L.tests.length} tests, ${p.gp}/${L.goals.length} goals ${un ? '' : '<span class="chip lock">locked</span>'}</div>`;
    d.onclick = () => { curLevel = L.id; renderCurriculum(); }; box.appendChild(d); });
  const L = LEVELS.find(x => x.id === curLevel), st = State.get(), un = levelUnlocked(L);
  let h = `<div class="panel"><h3>${L.title}</h3><p>${L.summary}</p>${un ? '' : '<p class="note">This level is locked until every pass test of the previous level is done. You can still read and try everything here; the lock is a suggestion, not a wall.</p>'}<button class="btn sm" data-read>Read aloud</button></div>`;
  h += `<div class="panel"><h3>Goals checklist</h3>`; L.goals.forEach((gl, i) => { const k = `L${L.id}g${i}`, on = !!st.checks[k]; h += `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-check="${k}" ${on ? 'checked' : ''}><span>${gl}</span></label>`; }); h += `</div>`;
  h += `<div class="panel"><h3>Exercises</h3><p class="muted small">Each opens in the player at a starting tempo. Raise the tempo only when a full minute is clean.</p>`;
  L.exercises.forEach(e => { const gr = G(e.g); h += `<div class="ex"><div class="t">${gr.name} <span class="chip">${gr.cat}</span> <span class="chip">start ${e.bpm}</span></div><div class="d">${e.why}</div><div class="row"><button class="btn sm" data-groove="${e.g}" data-bpm="${e.bpm}">Practice</button></div></div>`; });
  h += `</div><div class="panel"><h3>Pass tests</h3><p class="muted small">Each test runs the groove at the target tempo for the set time and then asks you whether it was clean. 60 XP each.</p>`;
  L.tests.forEach(t => { const done = st.passes[t.id]; h += `<div class="ex"><div class="t">${done ? '✅ ' : ''}${t.text}</div><div class="row"><button class="btn sm ${done ? 'good' : 'primary'}" data-test="${t.id}">${done ? 'Passed, do it again' : 'Take test'}</button><button class="btn sm" data-groove="${t.g}" data-bpm="${t.bpm}">Open in player</button></div></div>`; });
  h += `</div>`;
  document.getElementById('level-detail').innerHTML = h;
}
document.body.addEventListener('change', e => { const c = e.target.closest('[data-check]'); if (!c) return; const st = State.get(); if (c.checked) { st.checks[c.dataset.check] = Date.now(); State.addXP(10, 'goal ticked'); } else { delete st.checks[c.dataset.check]; State.save(); } if (c.dataset.check.startsWith('L')) renderCurriculum(); });
