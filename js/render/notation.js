// Drum notation (SVG), drum tabs (text), count labels and spoken count labels, all generated from a groove's voice rows.
import { VOICE_ORDER } from '../data/grooves.js';

const NOTE_Y = { cr: 36, hh: 44, ho: 44, rd: 52, t1: 56, t2: 60, sn: 64, fl: 72, kk: 80, hf: 96 };
const STEM_TOP = 22;
export const XVOICE = new Set(['cr', 'hh', 'ho', 'rd', 'hf']);
export function renderNotation(g, pattern, opts = {}) {
  pattern = pattern || g.voices;
  const n = g.beats * g.spb * g.bars, stepW = g.spb >= 6 ? 11 : g.spb === 3 ? 16 : 14, left = 46, stepsPerBar = g.beats * g.spb;
  const W = left + n * stepW + 20, H = 130;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">`;
  for (let i = 0; i < 5; i++) s += `<line x1="${left - 30}" y1="${52 + i * 8}" x2="${W - 10}" y2="${52 + i * 8}" stroke="#333" stroke-width="1"/>`;
  const [num, den] = g.sig.split('/');
  s += `<text x="${left - 28}" y="64" font-size="15" font-weight="bold" fill="#222">${num}</text><text x="${left - 28}" y="82" font-size="15" font-weight="bold" fill="#222">${den}</text>`;
  const xOf = i => left + i * stepW + stepW / 2;
  for (let b = 0; b <= g.bars; b++) { const x = left + b * stepsPerBar * stepW - (b === g.bars ? 4 : 2); s += `<line x1="${x}" y1="52" x2="${x}" y2="84" stroke="#333" stroke-width="${b === g.bars ? 2 : 1}"/>`; if (g.barLabels && g.barLabels[b]) s += `<text x="${x + 4}" y="8" font-size="10" fill="#555">${g.barLabels[b]}</text>`; }
  const hitsAt = i => VOICE_ORDER.filter(v => pattern[v] && pattern[v][i]);
  // beams per group
  for (let gs = 0; gs < n; gs += g.beam) {
    const idx = []; for (let i = gs; i < gs + g.beam; i++) if (hitsAt(i).length) idx.push(i);
    if (!idx.length) { s += `<text x="${xOf(gs) + (g.beam * stepW) / 2 - 8}" y="72" font-size="20" fill="#333">𝄽</text>`; continue; }
    const x1 = xOf(idx[0]), x2 = xOf(idx[idx.length - 1]);
    const rel = idx.map(i => (i - gs) % g.spb);
    let dbl = false, label = '';
    if (g.spb === 4) dbl = rel.some(r => r % 2 === 1);
    else if (g.spb === 3) label = '3';
    else if (g.spb === 6) { if (rel.every(r => r === 0 || r === 3)) {} else if (rel.every(r => r % 2 === 0)) label = '3'; else { dbl = true; label = '6'; } }
    if (idx.length === 1 && rel[0] === 0 && g.spb !== 2) { /* quarter note: no flag */ }
    else if (idx.length === 1) { s += `<line x1="${x1 + 3.5}" y1="22" x2="${x1 + 12}" y2="26" stroke="#222" stroke-width="2.5"/>`; if (dbl) s += `<line x1="${x1 + 3.5}" y1="27" x2="${x1 + 12}" y2="31" stroke="#222" stroke-width="2.5"/>`; }
    else { s += `<line x1="${x1 + 3.5}" y1="22" x2="${x2 + 3.5}" y2="22" stroke="#222" stroke-width="3"/>`; if (dbl) s += `<line x1="${x1 + 3.5}" y1="27" x2="${x2 + 3.5}" y2="27" stroke="#222" stroke-width="3"/>`; }
    if (label && !(idx.length === 1 && rel[0] === 0)) s += `<text x="${(x1 + x2) / 2 + 3.5}" y="17" font-size="10" text-anchor="middle" fill="#222" font-style="italic">${label}</text>`;
  }
  for (let i = 0; i < n; i++) {
    const hits = hitsAt(i); if (!hits.length) continue;
    const x = xOf(i); let lowY = 0, accent = false;
    for (const v of hits) {
      const vel = pattern[v][i], y = NOTE_Y[v]; lowY = Math.max(lowY, y);
      if (vel > 1.1) accent = true;
      if (XVOICE.has(v)) s += `<path d="M${x - 4} ${y - 4}L${x + 4} ${y + 4}M${x - 4} ${y + 4}L${x + 4} ${y - 4}" stroke="#222" stroke-width="1.8"/>`;
      else s += `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.4" fill="#222" transform="rotate(-20 ${x} ${y})"/>`;
      if (v === 'ho') s += `<circle cx="${x}" cy="${y - 9}" r="2.5" fill="none" stroke="#222" stroke-width="1.2"/>`;
      if (v === 'cr') s += `<line x1="${x - 7}" y1="36" x2="${x + 7}" y2="36" stroke="#333" stroke-width="1"/>`;
      if (vel < 0.6) s += `<text x="${x - 10}" y="${y + 4}" font-size="12" fill="#222">(</text><text x="${x + 5}" y="${y + 4}" font-size="12" fill="#222">)</text>`;
    }
    s += `<line x1="${x + 3.5}" y1="${lowY - 1}" x2="${x + 3.5}" y2="${STEM_TOP}" stroke="#222" stroke-width="1.3"/>`;
    if (accent) s += `<text x="${x + 7}" y="14" font-size="12" font-weight="bold" fill="#222">&gt;</text>`;
    if (g.stick && g.stick[i] && g.stick[i] !== '.') s += `<text x="${x}" y="110" font-size="10" text-anchor="middle" fill="#444">${g.stick[i]}</text>`;
  }
  if (opts.counts !== false) for (let i = 0; i < n; i++) { const c = countLabel(g, i); if (c) s += `<text x="${xOf(i)}" y="124" font-size="9" text-anchor="middle" fill="#888">${c}</text>`; }
  return s + '</svg>';
}
export function countLabel(g, i) {
  const r = i % g.spb, beat = Math.floor(i / g.spb) % g.beats + 1;
  if (g.spb === 4) return ['' + beat, 'e', '+', 'a'][r];
  if (g.spb === 3) return ['' + beat, 'tr', 'let'][r];
  if (g.spb === 6) return ['' + beat, '', 'tr', '', 'let', ''][r];
  if (g.spb === 2) return r === 0 ? '' + beat : '+';
  return r === 0 ? '' + beat : '';
}
export function speakLabel(g, i, mode) {
  const r = i % g.spb, beat = Math.floor(i / g.spb) % g.beats + 1;
  if (r === 0) return '' + beat;
  if (mode === 1) return null;
  if (g.spb === 4) { if (mode === 2) return r === 2 ? 'and' : null; return ['', 'e', 'and', 'a'][r]; }
  if (g.spb === 3) return ['', 'trip', 'let'][r];
  if (g.spb === 6) return ['', '', 'trip', '', 'let', ''][r] || null;
  if (g.spb === 2) return mode >= 2 ? 'and' : null;
  return null;
}
export function renderTab(g, pattern) {
  pattern = pattern || g.voices; const n = g.beats * g.spb * g.bars, spbar = g.beats * g.spb; const names = { cr: 'CR', rd: 'RD', ho: 'HO', hh: 'HH', hf: 'HF', sn: 'SN', t1: 'T1', t2: 'T2', fl: 'FT', kk: 'BD' };
  const lines = [];
  for (const v of VOICE_ORDER) {
    if (!pattern[v]) continue; let l = names[v] + '|';
    for (let i = 0; i < n; i++) { const x = pattern[v][i]; l += x === 0 ? '-' : x > 1.1 ? 'X' : x < 0.6 ? 'o' : 'x'; if ((i + 1) % spbar === 0) l += '|'; }
    lines.push(l);
  }
  if (g.stick) { let l = '  |'; for (let i = 0; i < n; i++) { l += g.stick[i] === '.' ? ' ' : g.stick[i]; if ((i + 1) % spbar === 0) l += '|'; } lines.push(l); }
  let c = '  |'; for (let i = 0; i < n; i++) { const lb = countLabel(g, i); c += lb ? lb[0] : ' '; if ((i + 1) % spbar === 0) c += '|'; } lines.push(c);
  return lines.join('\n');
}
