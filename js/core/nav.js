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
  if (location.hash !== '#/' + view) { navigating = true; location.hash = '/' + view; } // each view has its own URL (#/play) and history entry
  (hooks[view] || []).forEach(fn => fn());
}

let navigating = false; // true while go() itself is changing the hash
// The slash keeps the hash from matching an element id, which would make the browser scroll to it.
const viewFromHash = () => { const v = location.hash.replace(/^#\/?/, ''); return v && document.getElementById('view-' + v) ? v : null; };

export function initNav() {
  window.addEventListener('hashchange', () => { if (navigating) { navigating = false; return; } const v = viewFromHash(); if (v) go(v); }); // back and forward buttons
  document.getElementById('nav').addEventListener('click', e => { const b = e.target.closest('button[data-view]'); if (b) go(b.dataset.view); });
  document.body.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go);
    const p = e.target.closest('[data-pad]'); if (p) { const v = p.dataset.pad; Audio.play(v === 'sng' ? 'sn' : v, Audio.now(), v === 'sng' ? 0.3 : 1); State.badge('first_sound'); }
    const rd = e.target.closest('[data-read]'); if (rd) { const box = rd.closest('.panel') || rd.parentElement; Speech.stop(); Speech.say(box.innerText.replace(/Read aloud/g, '')); }
  });
}

// Open the view named in the URL hash, if any. Called once after every feature is initialised.
export function openInitialView() { const v = viewFromHash(); if (v && v !== 'home') go(v); }
