// Tempo (BPM) detection for a decoded AudioBuffer. Pure function, no DOM, so it can be unit tested in node.

// Tempo detection: onset strength from frame energy, then autocorrelation over the 60 to 200 BPM lag range.
export function detectBpm(buffer) {
  const sr = buffer.sampleRate, ch = buffer.numberOfChannels;
  const len = Math.min(buffer.length, sr * 60); // first minute is plenty
  const mono = new Float32Array(len);
  for (let c = 0; c < ch; c++) { const d = buffer.getChannelData(c); for (let i = 0; i < len; i++) mono[i] += d[i] / ch; }
  const hop = 512, frames = Math.floor(len / hop);
  const energy = new Float32Array(frames);
  for (let f = 0; f < frames; f++) { let s = 0; const o = f * hop; for (let i = 0; i < hop; i++) s += mono[o + i] * mono[o + i]; energy[f] = Math.sqrt(s / hop); }
  const onset = new Float32Array(frames);
  for (let f = 1; f < frames; f++) onset[f] = Math.max(0, energy[f] - energy[f - 1]);
  const mean = onset.reduce((a, b) => a + b, 0) / frames; for (let f = 0; f < frames; f++) onset[f] -= mean;
  const hopSec = hop / sr, minLag = Math.floor(60 / 200 / hopSec), maxLag = Math.ceil(60 / 60 / hopSec);
  let best = { lag: 0, val: -Infinity }; const scores = [];
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0; for (let f = lag; f < frames; f++) s += onset[f] * onset[f - lag];
    const bpm = 60 / (lag * hopSec);
    const prior = Math.exp(-0.5 * ((Math.log2(bpm / 120)) / 0.9) ** 2); // gentle preference for 60 to 240 centred on 120
    s *= prior; scores.push({ lag, bpm, s });
    if (s > best.val) best = { lag, val: s };
  }
  if (!best.lag || best.val <= 0) return null; // nothing periodic in the onset signal (silence, noise)
  // Refine with a parabolic fit around the peak lag.
  const at = l => { const x = scores.find(z => z.lag === l); return x ? x.s : 0; };
  const y0 = at(best.lag - 1), y1 = at(best.lag), y2 = at(best.lag + 1);
  const denom = y0 - 2 * y1 + y2; const shift = denom ? 0.5 * (y0 - y2) / denom : 0;
  return { bpm: 60 / ((best.lag + shift) * hopSec) };
}
