// Song lab: find a real song, work out its tempo, match it to library grooves, gather tabs and videos, and keep notes.
// Everything here runs in the browser. Search uses the iTunes Search API (no key, CORS enabled); tempo detection is
// done locally with the Web Audio API on the 30 second preview or on an audio file the user picks.
import { Audio } from '../core/audio.js';
import { State, toast } from '../core/state.js';
import { go } from '../core/nav.js';
import { GROOVES } from '../data/grooves.js';
import { Metronome } from './metronome.js';
import { detectBpm } from '../core/tempo-detect.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The song being worked on. Saved songs are copies of this shape in State.get().songs.
let cur = null;
let taps = [];

function blank(title, artist) {
  return { id: 's' + Date.now(), title: title || '', artist: artist || '', album: '', artwork: '', preview: '', bpm: null, bpmSource: '', feel: 'straight', yt: '', notes: '' };
}

/* ---------- Search (iTunes Search API) ---------- */
async function search() {
  const q = $('sg-q').value.trim(); if (!q) return;
  $('sg-status').textContent = 'Searching...'; $('sg-results').innerHTML = '';
  try {
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=12`);
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    if (!d.results.length) { $('sg-status').innerHTML = `Nothing found. <button class="btn sm" id="sg-manual">Use "${esc(q)}" as typed</button>`; $('sg-manual').onclick = () => useTyped(q); return; }
    $('sg-status').textContent = `${d.results.length} results. Pick the right recording; live versions and covers often run at a different tempo.`;
    $('sg-results').innerHTML = d.results.map((t, i) => `<div class="gcard song-card" data-res="${i}">
      ${t.artworkUrl100 ? `<img src="${esc(t.artworkUrl100)}" alt="" width="56" height="56">` : '<div class="art-empty"></div>'}
      <div><div class="nm">${esc(t.trackName)}</div><div class="mt">${esc(t.artistName)}${t.collectionName ? ' · ' + esc(t.collectionName) : ''}</div></div></div>`).join('');
    $('sg-results').querySelectorAll('[data-res]').forEach(el => el.addEventListener('click', () => {
      const t = d.results[+el.dataset.res];
      setCurrent({ ...blank(t.trackName, t.artistName), id: 'it' + t.trackId, album: t.collectionName || '', artwork: (t.artworkUrl100 || '').replace('100x100', '300x300'), preview: t.previewUrl || '' });
      $('sg-results').innerHTML = ''; $('sg-status').textContent = '';
    }));
  } catch (e) {
    $('sg-status').innerHTML = `Search is not reachable right now (offline, or the service is blocked). <button class="btn sm" id="sg-manual">Use "${esc(q)}" as typed</button>`;
    $('sg-manual').onclick = () => useTyped(q);
  }
}
function useTyped(q) {
  const m = q.split(/\s+[-–]\s+|\s+by\s+/i);
  setCurrent(blank(m[0].trim(), (m[1] || '').trim()));
  $('sg-results').innerHTML = ''; $('sg-status').textContent = '';
}

/* ---------- Current song ---------- */
function setCurrent(song) {
  cur = song; $('sg-feel').value = cur.feel || 'straight'; $('sg-notes').value = cur.notes || ''; $('sg-yt').value = cur.yt || '';
  renderSong(); renderTempo(); renderMatches(); renderLinks(); renderVideo();
}
function renderSong() {
  const box = $('sg-song');
  if (!cur) { box.innerHTML = '<p class="muted">Search above, or type a title and press Search. If the search service is unreachable you can still use the title as typed.</p>'; return; }
  box.innerHTML = `<div class="song-head">${cur.artwork ? `<img src="${esc(cur.artwork)}" alt="" width="96" height="96">` : ''}
    <div><div class="song-title">${esc(cur.title) || '<span class="muted">Untitled</span>'}</div><div class="muted">${esc(cur.artist)}${cur.album ? ' · ' + esc(cur.album) : ''}</div>
    ${cur.preview ? `<audio controls preload="none" src="${esc(cur.preview)}" style="margin-top:8px;width:100%;max-width:320px"></audio><div class="small muted">30 second preview. Tap the tempo along with it, or let the page detect it.</div>` : '<div class="small muted" style="margin-top:6px">No preview for this one. Tap the tempo along with your own copy of the song, or pick an audio file.</div>'}
    </div></div>`;
}

/* ---------- Tempo ---------- */
function setBpm(bpm, source) {
  if (!cur) cur = blank($('sg-q').value.trim(), '');
  cur.bpm = bpm && isFinite(bpm) ? Math.round(bpm) : null; cur.bpmSource = source || '';
  renderTempo(); renderMatches();
}
function renderTempo() {
  const has = cur && cur.bpm;
  $('sg-bpm').textContent = has ? cur.bpm : '–';
  $('sg-bpm-src').textContent = has ? `BPM, ${cur.bpmSource}` : 'BPM unknown';
  $('sg-detect').disabled = !(cur && cur.preview);
  const st = $('sg-tempo-status');
  if (!has) st.textContent = '';
  else if (cur.bpm < 70) st.textContent = 'Slow. Every gap is exposed; count subdivisions out loud and keep the hats even.';
  else if (cur.bpm < 100) st.textContent = 'Mid tempo. Room for ghost notes and sixteenth hats. Most beginner rock lives here.';
  else if (cur.bpm < 130) st.textContent = 'Driving. Eighth note hats, kick variations, keep the shoulders down.';
  else if (cur.bpm < 170) st.textContent = 'Fast. Heel up on the kick, ride or open hats in the chorus, fills shorter than you think.';
  else st.textContent = 'Very fast. Check whether the song is really felt in half time (try halving the number) or in 6/8 (the detector may have found the eighth note).';
}
function tapTempo() {
  const now = performance.now(); taps = taps.filter(x => now - x < 3000);
  if (taps.length && now - taps[taps.length - 1] < 150) return; // faster than 400 BPM is a double tap, not a beat
  taps.push(now);
  if (taps.length >= 3) { const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); setBpm(60000 / iv, `tapped over ${taps.length} taps`); }
  else $('sg-tempo-status').textContent = 'Keep tapping on the beat...';
}

async function analyse(arrayBuffer, label) {
  $('sg-tempo-status').textContent = 'Listening for the pulse...';
  const buf = await Audio.ctx().decodeAudioData(arrayBuffer);
  const r = detectBpm(buf);
  if (!r || !isFinite(r.bpm)) { $('sg-tempo-status').textContent = 'Could not find a steady pulse. Tap along instead.'; return; }
  setBpm(r.bpm, `detected from ${label}`);
  $('sg-tempo-status').textContent += ` Detected ${Math.round(r.bpm)}. If it feels twice too fast or slow, the real tempo is ${Math.round(r.bpm / 2)} or ${Math.round(r.bpm * 2)}; tap along to confirm.`;
}
async function detectFromPreview() {
  if (!cur || !cur.preview) return;
  try { const r = await fetch(cur.preview); if (!r.ok) throw 0; await analyse(await r.arrayBuffer(), 'the preview'); }
  catch (e) { $('sg-tempo-status').textContent = 'The preview could not be analysed from the browser. Play it and tap along, or pick an audio file of the song.'; }
}
function detectFromFile(file) {
  if (!file) return; const rd = new FileReader();
  rd.onload = () => analyse(rd.result, file.name).catch(() => { $('sg-tempo-status').textContent = 'That file could not be decoded. Try an MP3, M4A, WAV or OGG.'; });
  rd.readAsArrayBuffer(file);
}

/* ---------- Groove matching ---------- */
function feelFilter(g, feel) {
  if (g.cat === 'Rudiments' || g.cat === 'Dynamics and form') return false;
  const eighthMeter = g.sig.endsWith('/8');
  if (feel === 'shuffle') return g.cat === 'Shuffle' || (g.spb === 3 && !eighthMeter);
  if (feel === 'half') return g.cat === 'Half time' || g.id === 'halfshuf';
  if (feel === '68') return eighthMeter && g.beats === 6;
  if (feel === 'odd') return g.cat === 'Odd meters' && g.beats !== 6;
  return !eighthMeter && g.spb !== 3 && g.cat !== 'Shuffle' && g.cat !== 'Odd meters' && g.cat !== 'Half time';
}
// Tempo to open the groove at, so the song's beat lines up with what the groove counts.
function grooveTempo(g, bpm, feel) { return feel === '68' && g.sig.endsWith('/8') ? bpm * 3 : bpm; }
function renderMatches() {
  const box = $('sg-matches');
  if (!cur || !cur.bpm) { box.innerHTML = '<p class="muted small">Set a tempo first.</p>'; return; }
  const feel = cur.feel || 'straight';
  const list = GROOVES.filter(g => feelFilter(g, feel)).map(g => { const t = grooveTempo(g, cur.bpm, feel); return { g, t, dist: Math.abs(Math.log(g.bpm / t)) }; }).sort((a, b) => a.dist - b.dist);
  const near = list.filter(x => x.dist < Math.log(1.35));
  const show = (near.length >= 4 ? near : list).slice(0, 10);
  box.innerHTML = show.map(({ g, t }) => `<div class="gcard" data-groove="${g.id}" data-bpm="${Math.round(t)}"><div class="nm">${esc(g.name)}</div><div class="mt">${g.cat} · natural ${g.bpm} BPM · opens at ${Math.round(t)}</div></div>`).join('')
    + (near.length < 4 ? '<p class="muted small" style="grid-column:1/-1">Nothing in the library sits naturally at this tempo, so these are the closest. Use the speed slider in the player to work up to it.</p>' : '');
}

/* ---------- Links out and video ---------- */
function renderLinks() {
  const box = $('sg-links');
  if (!cur || !cur.title) { box.innerHTML = '<span class="muted small">Pick a song first.</span>'; return; }
  const q = `${cur.title} ${cur.artist}`.trim(), e = encodeURIComponent(q);
  const links = [
    ['Drum tab on Songsterr', `https://www.songsterr.com/?pattern=${e}`],
    ['Drum tab on Ultimate Guitar', `https://www.ultimate-guitar.com/search.php?search_type=title&value=${e}`],
    ['Drum sheet music (web search)', `https://duckduckgo.com/?q=${encodeURIComponent(q + ' drum sheet music')}`],
    ['Drum cover on YouTube', `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' drum cover')}`],
    ['Drum lesson on YouTube', `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' drum lesson')}`],
    ['Drumless track on YouTube', `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' drumless')}`],
    ['Original on YouTube', `https://www.youtube.com/results?search_query=${e}`],
    ['Open on Spotify', `https://open.spotify.com/search/${e}`],
  ];
  box.innerHTML = links.map(([t, u]) => `<a class="btn sm" href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('');
}
function youtubeId(s) {
  s = (s || '').trim(); if (!s) return '';
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/); return m ? m[1] : '';
}
function renderVideo() {
  const box = $('sg-video');
  const id = cur ? youtubeId(cur.yt) : '';
  box.innerHTML = id ? `<div class="yt-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>` : '';
}

/* ---------- Saved songs ---------- */
function save() {
  if (!cur) { toast('Pick a song first'); return; }
  cur.notes = $('sg-notes').value; cur.feel = $('sg-feel').value; cur.yt = youtubeId($('sg-yt').value) ? $('sg-yt').value.trim() : '';
  const s = State.get(); const i = s.songs.findIndex(x => x.id === cur.id);
  if (i >= 0) { s.songs[i] = { ...cur }; State.save(); toast('Song updated'); }
  else { s.songs.push({ ...cur, saved: Date.now() }); State.addXP(10, 'song added'); State.badge('song1'); }
  renderSaved();
}
export function renderSaved() {
  const s = State.get(); const box = $('sg-saved');
  box.innerHTML = s.songs.length ? s.songs.slice().reverse().map(x => `<div class="gcard song-card" data-song="${esc(x.id)}">
      ${x.artwork ? `<img src="${esc(x.artwork)}" alt="" width="56" height="56">` : '<div class="art-empty"></div>'}
      <div><div class="nm">${esc(x.title)}</div><div class="mt">${esc(x.artist)}${x.bpm ? ' · ' + x.bpm + ' BPM' : ''}</div></div>
      <button class="btn sm" data-song-del="${esc(x.id)}" title="Remove">×</button></div>`).join('')
    : '<p class="muted small">Nothing saved yet. Songs you save here are included in the progress export.</p>';
}
function logPlayAlong() {
  if (!cur) { toast('Pick a song first'); return; }
  $('lg-focus').value = 'Song play along'; $('lg-notes').value = `${cur.title}${cur.artist ? ' - ' + cur.artist : ''}${cur.bpm ? ' at ' + cur.bpm : ''}`;
  go('practice'); $('lg-min').focus(); toast('Fill in the minutes and press Add');
}

export function initSongs() {
  $('sg-search').addEventListener('click', search);
  $('sg-q').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
  $('sg-tap').addEventListener('click', tapTempo);
  $('sg-detect').addEventListener('click', detectFromPreview);
  $('sg-file-btn').addEventListener('click', () => $('sg-file').click());
  $('sg-file').addEventListener('change', e => { detectFromFile(e.target.files[0]); e.target.value = ''; });
  $('sg-bpm-set').addEventListener('click', () => { const v = +$('sg-bpm-in').value; if (v >= 30 && v <= 300) setBpm(v, 'typed in'); });
  $('sg-bpm-in').addEventListener('keydown', e => { if (e.key === 'Enter') $('sg-bpm-set').click(); });
  $('sg-feel').addEventListener('change', () => { if (cur) { cur.feel = $('sg-feel').value; renderMatches(); } });
  $('sg-yt-go').addEventListener('click', () => { if (!cur) cur = blank($('sg-q').value.trim(), ''); cur.yt = $('sg-yt').value.trim(); renderVideo(); if (!youtubeId(cur.yt)) toast('That does not look like a YouTube link'); });
  $('sg-save').addEventListener('click', save);
  $('sg-log').addEventListener('click', logPlayAlong);
  $('sg-click').addEventListener('click', () => { if (!cur || !cur.bpm) { toast('Set a tempo first'); return; } if (Metronome.isRunning()) Metronome.stop(); Metronome.setBpm(cur.bpm); Metronome.start(); go('metro'); });
  $('sg-saved').addEventListener('click', e => {
    const del = e.target.closest('[data-song-del]');
    if (del) { const s = State.get(); s.songs = s.songs.filter(x => x.id !== del.dataset.songDel); State.save(); renderSaved(); return; }
    const c = e.target.closest('[data-song]'); if (c) { const x = State.get().songs.find(x => x.id === c.dataset.song); if (x) setCurrent({ ...x }); window.scrollTo(0, 0); }
  });
  renderSong(); renderTempo(); renderMatches(); renderLinks(); renderSaved();
}
