// Run with: node test/tempo-detect.test.mjs
import { detectBpm } from '../js/core/tempo-detect.js';
// Synthetic "drum track": decaying kick-like hits on every beat, quieter noisy hats on the eighths, some noise floor.
function track(bpm, secs = 30, sr = 44100, opts = {}) {
  const n = sr * secs, data = new Float32Array(n), period = 60 / bpm * sr;
  for (let i = 0; i < n; i++) {
    const ph = i % period, beat = Math.floor(i / period);
    const kick = ph < 3000 ? Math.exp(-ph / 900) * Math.sin(ph * 0.02) * (beat % 4 === 0 ? 1 : 0.7) : 0;
    const hph = ph % (period / 2), hat = opts.hats === false ? 0 : (hph < 800 ? (Math.random() - 0.5) * 0.4 * Math.exp(-hph / 250) : 0);
    const snare = opts.snare && (beat % 2 === 1) && ph < 2500 ? (Math.random() - 0.5) * 0.9 * Math.exp(-ph / 700) : 0;
    data[i] = kick + hat + snare + (Math.random() - 0.5) * (opts.noise ?? 0.03);
  }
  return { sampleRate: sr, numberOfChannels: 1, length: n, getChannelData: () => data };
}
let fails = 0;
for (const [bpm, opts] of [[128, {}], [90, { snare: true }], [160, { snare: true }], [72, { hats: false }], [110, { noise: 0.15, snare: true }], [140, { snare: true }]]) {
  const r = detectBpm(track(bpm, 30, 44100, opts));
  const got = r ? r.bpm : NaN, ok = Math.abs(got - bpm) <= 1.5 || Math.abs(got - bpm * 2) <= 2 || Math.abs(got - bpm / 2) <= 1;
  if (!ok) fails++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} target ${bpm} -> ${got.toFixed(1)} ${Math.abs(got - bpm) > 1.5 && ok ? '(octave ambiguity)' : ''} ${JSON.stringify(opts)}`);
}
const silent = detectBpm({ sampleRate: 44100, numberOfChannels: 1, length: 44100 * 5, getChannelData: () => new Float32Array(44100 * 5) });
console.log(`silence -> ${silent ? silent.bpm : null} (should be null or non-finite)`);
console.log(fails ? `${fails} failures` : 'tempo detector ok');
