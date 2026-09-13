// View switching. Features register what should happen when a view opens with onView(), so this module depends on nothing above the core.
import { Audio } from './audio.js';
import { Speech } from './speech.js';
import { State } from './state.js';

const hooks = {};

// Run fn every time the given view is shown.
export function onView(view, fn) { (hooks[view] = hooks[view] || []).push(fn); }

export function go(view) {
  document.querySelectorAll('#nav button').forEach(x => x.classList.toggle('active', x.dataset.view === view));
  document.querySelectorAll('section.view').forEach(x => x.classList.toggle('active', x.id === 'view-' + view));
  window.scrollTo(0, 0);
  (hooks[view] || []).forEach(fn => fn());
}

export function initNav() {
  document.getElementById('nav').addEventListener('click', e => { const b = e.target.closest('button[data-view]'); if (b) go(b.dataset.view); });
  document.body.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go);
    const p = e.target.closest('[data-pad]'); if (p) { const v = p.dataset.pad; Audio.play(v === 'sng' ? 'sn' : v, Audio.now(), v === 'sng' ? 0.3 : 1); State.badge('first_sound'); }
    const rd = e.target.closest('[data-read]'); if (rd) { const box = rd.closest('.panel') || rd.parentElement; Speech.stop(); Speech.say(box.innerText.replace(/Read aloud/g, '')); }
  });
}
