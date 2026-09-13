// Progress store (localStorage), XP, ranks, badges and the toast.

export const RANKS = [[0, 'Novice'], [150, 'Beat keeper'], [400, 'Groove builder'], [800, 'Rock steady'], [1400, 'Fill fluent'], [2200, 'Confident intermediate'], [3200, 'Band ready']];
export const BADGES = [
  { id: 'first_sound', i: '🔊', n: 'First hit', d: 'Made a sound on the kit' },
  { id: 'first_groove', i: '▶️', n: 'First groove', d: 'Played a groove in the player' },
  { id: 'editor', i: '✏️', n: 'Tinkerer', d: 'Edited a groove in the grid' },
  { id: 'timekeeper', i: '⏱️', n: 'Timekeeper', d: '30 minutes with the metronome running' },
  { id: 'reader5', i: '📖', n: 'Reader', d: '5 correct reading challenges' },
  { id: 'reader25', i: '🎓', n: 'Sight reader', d: '25 correct reading challenges' },
  { id: 'logger', i: '📝', n: 'Diarist', d: 'Logged 5 practice sessions' },
  { id: 'streak3', i: '🔥', n: 'Three in a row', d: 'Practiced on 3 consecutive days' },
  { id: 'streak7', i: '🌋', n: 'Full week', d: 'Practiced 7 consecutive days' },
  { id: 'hours10', i: '⏳', n: 'Ten hours', d: '10 hours logged' },
  { id: 'hours50', i: '💪', n: 'Fifty hours', d: '50 hours logged' },
  { id: 'lvl1', i: '🥉', n: 'Level 1 complete', d: 'Passed every Level 1 test' },
  { id: 'lvl2', i: '🥈', n: 'Level 2 complete', d: 'Passed every Level 2 test' },
  { id: 'lvl3', i: '🥇', n: 'Level 3 complete', d: 'Passed every Level 3 test' },
  { id: 'lvl4', i: '🏆', n: 'Level 4 complete', d: 'Passed every Level 4 test' },
  { id: 'odd', i: '7️⃣', n: 'Odd one', d: 'Played a groove in 5, 7 or 6/8' },
  { id: 'slow', i: '🐢', n: 'Slow and steady', d: 'Played any groove under 60 BPM' },
  { id: 'kit', i: '🔍', n: 'Kit explorer', d: 'Looked at a part of the 3D kit' },
  { id: 'song1', i: '🎸', n: 'First song', d: 'Saved a real song in the Song lab' },
];
export const State = (() => {
  const KEY = 'drumcourse-v1';
  let s = { xp: 0, badges: {}, checks: {}, passes: {}, log: [], stats: { metroSec: 0, quizRight: 0, quizTotal: 0, grooves: 0 }, plan: null, songs: [] };
  try { const raw = localStorage.getItem(KEY); if (raw) s = Object.assign(s, JSON.parse(raw)); } catch (e) {}
  if (!Array.isArray(s.songs)) s.songs = []; // older saves predate the Song lab
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} renderXP(); }
  function addXP(n, why) { s.xp += n; toast(`+${n} XP  ${why}`); save(); }
  function badge(id) { if (s.badges[id]) return; const b = BADGES.find(x => x.id === id); if (!b) return; s.badges[id] = Date.now(); s.xp += 40; toast(`🏅 Badge: ${b.n} (+40 XP)`); save(); }
  function rank() { let r = RANKS[0], next = null; for (let i = 0; i < RANKS.length; i++) { if (s.xp >= RANKS[i][0]) { r = RANKS[i]; next = RANKS[i + 1] || null; } } return { r, next }; }
  function renderXP() {
    const { r, next } = rank();
    document.getElementById('rank').textContent = r[1];
    document.getElementById('xpnum').textContent = `${s.xp} XP` + (next ? ` · ${next[0] - s.xp} to ${next[1]}` : '');
    document.getElementById('xpbar').style.width = next ? Math.round(100 * (s.xp - r[0]) / (next[0] - r[0])) + '%' : '100%';
    const st = streak(); document.getElementById('streak').textContent = st ? `🔥 ${st} day streak` : 'No streak yet. Log a session today.';
  }
  function dayKey(ts) { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
  function streak() {
    const days = new Set(s.log.map(e => dayKey(e.ts))); if (!days.size) return 0;
    let n = 0; const d = new Date(); if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function reset() { s = { xp: 0, badges: {}, checks: {}, passes: {}, log: [], stats: { metroSec: 0, quizRight: 0, quizTotal: 0, grooves: 0 }, plan: null, songs: [] }; save(); }
  return { get: () => s, save, addXP, badge, rank, renderXP, streak, reset, dayKey };
})();
let toastTimer = null;
export function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }
