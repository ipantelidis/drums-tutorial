// Home dashboard and the badges view.
import { State, BADGES } from '../core/state.js';
import { LEVELS } from '../data/curriculum.js';

export function renderBadges() { const s = State.get(); document.getElementById('badges').innerHTML = BADGES.map(b => `<div class="badge ${s.badges[b.id] ? '' : 'locked'}"><div class="i">${b.i}</div><b>${b.n}</b><div class="muted">${b.d}</div>${s.badges[b.id] ? `<div class="small muted">${new Date(s.badges[b.id]).toLocaleDateString()}</div>` : ''}</div>`).join(''); }
document.getElementById('reset-all').addEventListener('click', () => { if (confirm('Reset all XP, badges, checklists and the log?')) { State.reset(); location.reload(); } });
export function renderHome() {
  const s = State.get(); const L = LEVELS.find(l => !l.tests.every(t => s.passes[t.id])) || LEVELS[3];
  const nextTest = L.tests.find(t => !s.passes[t.id]); const nextGoalIdx = L.goals.findIndex((_, i) => !s.checks[`L${L.id}g${i}`]);
  let h = `<p>You are working on <b>${L.title}</b>.</p>`;
  if (nextGoalIdx >= 0) h += `<p>Next goal: ${L.goals[nextGoalIdx]}</p>`;
  if (nextTest) h += `<p>Next pass test: ${nextTest.text}</p><div class="row"><button class="btn primary" data-test="${nextTest.id}">Take the test</button><button class="btn" data-groove="${nextTest.g}" data-bpm="${Math.round(nextTest.bpm * 0.8)}">Practice it at 80 percent</button></div>`;
  else h += `<p>All tests passed. Keep the log going and play with a band.</p>`;
  document.getElementById('home-next').innerHTML = h;
  const week = s.log.filter(e => Date.now() - e.ts < 7 * 864e5).reduce((a, e) => a + e.min, 0); const target = (s.plan ? s.plan.hours : 10) * 60;
  document.getElementById('home-week').innerHTML = `<p>${Math.round(week / 6) / 10} of ${Math.round(target / 6) / 10} hours logged in the last 7 days.</p><div class="bar green"><i style="width:${Math.min(100, Math.round(100 * week / target))}%"></i></div><p class="small muted" style="margin-top:8px">Streak: ${State.streak()} day${State.streak() === 1 ? '' : 's'}. Reading challenge: ${s.stats.quizRight} correct. Badges: ${Object.keys(s.badges).length} of ${BADGES.length}.</p>`;
  document.getElementById('home-title').textContent = s.log.length ? 'Welcome back' : 'Welcome';
}
