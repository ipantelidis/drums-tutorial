// Practice page: weekly plan, session timer, practice log, today's session builder, warm up table, stand mode, progress export and import.
import { State, toast } from '../core/state.js';
import { LEVELS } from '../data/curriculum.js';
import { GROOVES, G } from '../data/grooves.js';
import { WARMUP } from '../data/content.js';
import { renderHome } from './home.js';

function standModeAndProgress() {
  const $ = id => document.getElementById(id);
  const sm = $('stand-mode'); try { sm.checked = localStorage.getItem('drumcourse-stand') === '1'; } catch (e) {} document.body.classList.toggle('stand', sm.checked);
  sm.addEventListener('change', () => { document.body.classList.toggle('stand', sm.checked); try { localStorage.setItem('drumcourse-stand', sm.checked ? '1' : '0'); } catch (e) {} });

  $('pg-export').addEventListener('click', () => {
    const data = JSON.stringify({ app: 'drumcourse', version: 1, exported: new Date().toISOString(), state: State.get(), latency: localStorage.getItem('drumcourse-latency') }, null, 2);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = `drum-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('pg-import').addEventListener('click', () => $('pg-file').click());
  $('pg-file').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return; const rd = new FileReader();
    rd.onload = () => { try { const d = JSON.parse(rd.result); if (d.app !== 'drumcourse' || !d.state) throw 0; if (!confirm('Replace your current progress with the imported file?')) return; localStorage.setItem('drumcourse-v1', JSON.stringify(d.state)); if (d.latency) localStorage.setItem('drumcourse-latency', d.latency); location.reload(); } catch (err) { toast('That file is not a drum course export.'); } };
    rd.readAsText(f); e.target.value = '';
  });

  $('td-go').addEventListener('click', () => {
    const s = State.get(); const mins = +$('td-min').value || 60;
    const L = LEVELS.find(l => !l.tests.every(t => s.passes[t.id])) || LEVELS[3];
    const focusCounts = {}; ['Warm up and rudiments', 'Reading', 'Grooves', 'Fills', 'Song play along', 'Technique'].forEach(f => focusCounts[f] = 0);
    s.log.filter(e => Date.now() - e.ts < 14 * 864e5).forEach(e => { if (focusCounts[e.focus] !== undefined) focusCounts[e.focus] += e.min; });
    const weakest = Object.keys(focusCounts).sort((a, b) => focusCounts[a] - focusCounts[b])[0];
    const openTests = L.tests.filter(t => !s.passes[t.id]); const test = openTests[Math.floor(Math.random() * openTests.length)] || L.tests[0];
    const fun = GROOVES.filter(g => ['Bonham', 'Mason', 'Selway', 'Fills'].some(k => (g.cat || '').includes(k))); const funG = fun[Math.floor(Math.random() * fun.length)] || GROOVES[0];
    const rud = GROOVES.filter(g => g.cat === 'Rudiments'); const rudG = rud[Math.floor(Math.random() * rud.length)];
    const blocks = [
      { m: Math.max(5, Math.round(mins * 0.15)), t: 'Warm up', d: `Single strokes and the warm up table, relaxed, quiet. Start with ${rudG ? rudG.name.toLowerCase() : 'single strokes'}.`, g: rudG ? rudG.id : null, bpm: rudG ? rudG.bpm : null },
      { m: Math.max(5, Math.round(mins * 0.25)), t: 'The hard thing', d: `Work toward the open test: ${test.text}. Use the speed slider at 80 percent, then 90, then 100, with scoring on if you have an input.`, g: test.g, bpm: test.bpm },
      { m: Math.max(5, Math.round(mins * 0.2)), t: `Least practised: ${weakest}`, d: weakest === 'Reading' ? 'Two reading examples and five rounds of the tab reading test.' : weakest === 'Fills' ? 'One fill from the library, loop it, then drop it into a groove every fourth bar.' : weakest === 'Technique' ? 'Ten minutes on grip, rebound and heel down versus heel up from the Technique tab, filmed if you can.' : weakest === 'Song play along' ? 'Play one groove with the band switched on for five minutes without stopping, then a real song.' : `Ten minutes on ${weakest.toLowerCase()} from the library.`, g: null },
      { m: Math.max(5, Math.round(mins * 0.2)), t: 'Something fun', d: `${funG.name}. Loop it, mute the kick row and play it yourself, then mute everything.`, g: funG.id, bpm: funG.bpm },
      { m: Math.max(5, mins - Math.round(mins * 0.8)), t: 'A song', d: 'One complete song from the four bands at real tempo, start to finish, no stopping for mistakes. Then log the session.', g: null },
    ];
    $('td-out').innerHTML = `<table class="plain">${blocks.map(b => `<tr><td style="white-space:nowrap">${b.m} min</td><td><b>${b.t}</b><br><span class="muted small">${b.d}</span></td><td>${b.g ? `<button class="btn sm" data-groove="${b.g}" ${b.bpm ? `data-bpm="${b.bpm}"` : ''}>Open</button>` : ''}</td></tr>`).join('')}</table>`;
  });
}

function practiceTools() {
  const $ = id => document.getElementById(id);
  const sel = $('pl-level'); LEVELS.forEach(L => { const o = document.createElement('option'); o.value = L.id; o.textContent = L.title; sel.appendChild(o); });
  function plan() {
    const hours = +$('pl-hours').value, days = +$('pl-days').value, L = LEVELS.find(x => x.id === +sel.value); const perDay = Math.round(hours * 60 / days);
    const split = [['Warm up', .12], ['Rudiments and technique', .18], ['Reading', .10], ['Grooves', .28], ['Fills', .12], ['Song play along', .20]];
    const ex = L.exercises; const rud = ex.filter(e => G(e.g).cat === 'Rudiments' || G(e.g).cat === 'Advanced'), grv = ex.filter(e => !['Rudiments', 'Fills', 'Advanced'].includes(G(e.g).cat)), fil = ex.filter(e => G(e.g).cat === 'Fills');
    const pick = (arr, d, k) => arr.length ? arr.slice().map((x, i) => arr[(i + d * k) % arr.length]).slice(0, k) : [];
    let h = `<p>${perDay} minutes per day, ${days} days. Every day starts with the warm up and ends with a song. The middle rotates through the level's material so nothing is neglected.</p><table class="plain"><tr><th>Day</th><th>Blocks</th></tr>`;
    for (let d = 0; d < days; d++) {
      const blocks = split.map(([nm, f]) => { const m = Math.max(3, Math.round(perDay * f)); let what = '';
        if (nm === 'Rudiments and technique') what = pick(rud, d, 2).map(e => `<a href="#" data-groove="${e.g}" data-bpm="${e.bpm}">${G(e.g).name}</a>`).join(', ');
        if (nm === 'Grooves') what = pick(grv, d, 2).map(e => `<a href="#" data-groove="${e.g}" data-bpm="${e.bpm}">${G(e.g).name}</a>`).join(', ');
        if (nm === 'Fills') what = pick(fil, d, 1).map(e => `<a href="#" data-groove="${e.g}" data-bpm="${e.bpm}">${G(e.g).name}</a>`).join(', ') || 'fill from a lower level';
        if (nm === 'Reading') what = 'two reading examples plus the reading challenge';
        if (nm === 'Song play along') what = d % 4 === 0 ? 'an Oasis song, straight eighths' : d % 4 === 1 ? 'a Radiohead song, watch the displacement' : d % 4 === 2 ? 'a Led Zeppelin song, slow it down if needed' : 'a Pink Floyd song, hold the slow tempo';
        if (nm === 'Warm up') what = 'the routine below';
        return `${m} min ${nm.toLowerCase()}${what ? ': ' + what : ''}`; });
      h += `<tr><td>Day ${d + 1}</td><td>${blocks.join('<br>')}</td></tr>`;
    }
    $('pl-out').innerHTML = h + '</table>'; State.get().plan = { hours, days, level: L.id }; State.save();
  }
  $('pl-go').addEventListener('click', plan);
  $('pl-out').addEventListener('click', e => { if (e.target.closest('a[data-groove]')) e.preventDefault(); });
  const p = State.get().plan; if (p) { $('pl-hours').value = p.hours; $('pl-days').value = p.days; sel.value = p.level; plan(); }

  // session timer
  let t0 = null, acc = 0, tick = null;
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const cur = () => acc + (t0 ? (Date.now() - t0) / 1000 : 0);
  $('st-toggle').addEventListener('click', () => { if (t0) { acc = cur(); t0 = null; clearInterval(tick); $('st-toggle').textContent = 'Resume'; } else { t0 = Date.now(); tick = setInterval(() => $('st-time').textContent = fmt(cur()), 500); $('st-toggle').textContent = 'Pause'; } });
  $('st-reset').addEventListener('click', () => { t0 = null; acc = 0; clearInterval(tick); $('st-time').textContent = '00:00'; $('st-toggle').textContent = 'Start'; });
  $('st-log').addEventListener('click', () => { const m = Math.max(1, Math.round(cur() / 60)); $('lg-min').value = m; $('lg-min').focus(); toast(`Session length filled in: ${m} min`); });

  // log
  function renderLog() {
    const s = State.get(); const ul = $('lg-list'); ul.innerHTML = s.log.slice().reverse().map((e, i) => `<li><span><b>${new Date(e.ts).toLocaleDateString()}</b> ${e.min} min, ${e.focus}${e.notes ? '. ' + e.notes : ''}</span><button class="btn sm" data-del="${s.log.length - 1 - i}">Remove</button></li>`).join('') || '<li class="muted">Nothing logged yet. Even 15 minutes counts.</li>';
    const week = s.log.filter(e => Date.now() - e.ts < 7 * 864e5).reduce((a, e) => a + e.min, 0), total = s.log.reduce((a, e) => a + e.min, 0);
    $('lg-summary').textContent = `Last 7 days: ${Math.round(week / 6) / 10} h · Total: ${Math.round(total / 6) / 10} h · ${s.log.length} sessions`;
  }
  $('lg-add').addEventListener('click', () => {
    const s = State.get(); const min = +$('lg-min').value; if (!min) return; s.log.push({ ts: Date.now(), min, focus: $('lg-focus').value, notes: $('lg-notes').value.trim() }); $('lg-notes').value = '';
    State.addXP(Math.min(30, Math.round(min / 5) + 5), 'practice logged'); if (s.log.length >= 5) State.badge('logger'); const total = s.log.reduce((a, e) => a + e.min, 0); if (total >= 600) State.badge('hours10'); if (total >= 3000) State.badge('hours50'); const st = State.streak(); if (st >= 3) State.badge('streak3'); if (st >= 7) State.badge('streak7'); renderLog(); renderHome();
  });
  $('lg-list').addEventListener('click', e => { const b = e.target.closest('[data-del]'); if (!b) return; State.get().log.splice(+b.dataset.del, 1); State.save(); renderLog(); });
  $('lg-export').addEventListener('click', () => { const txt = State.get().log.map(e => `${new Date(e.ts).toISOString().slice(0, 10)}\t${e.min} min\t${e.focus}\t${e.notes}`).join('\n'); navigator.clipboard?.writeText(txt).then(() => toast('Log copied'), () => prompt('Copy your log:', txt)); });
  $('lg-clear').addEventListener('click', () => { if (confirm('Clear the whole practice log?')) { State.get().log = []; State.save(); renderLog(); } });
  renderLog();
  $('warmup').innerHTML = `<table class="plain">${WARMUP.map(w => `<tr><td>${w.min} min</td><td>${w.t}</td><td>${w.bpm} BPM</td><td><button class="btn sm" data-groove="${w.g}" data-bpm="${w.bpm}">Open</button></td></tr>`).join('')}</table>`;
}

export function initPractice() { standModeAndProgress(); practiceTools(); }
