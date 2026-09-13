// Entry point: wire views to their renderers, initialise every feature, open the first groove.
import { State } from './core/state.js';
import { Speech } from './core/speech.js';
import { initNav, onView } from './core/nav.js';
import { Player } from './features/player.js';
import './features/metronome.js';
import './features/scoring.js';
import { Kit3D } from './features/kit3d.js';
import { renderCurriculum } from './features/curriculum.js';
import { renderTheory, renderTechnique, renderMistakes, renderReading, renderRhythms } from './features/learn.js';
import { initQuizzes } from './features/quiz.js';
import { initPractice } from './features/practice.js';
import { renderHome, renderBadges } from './features/home.js';
import { initSongs, renderSaved } from './features/songs.js';

onView('home', renderHome);
onView('curriculum', renderCurriculum);
onView('badges', renderBadges);
onView('rhythms', renderRhythms);
onView('kit3d', () => Kit3D.open());
onView('songs', renderSaved);

initNav();
renderTheory(); renderTechnique(); renderMistakes(); renderReading(); renderRhythms(); renderCurriculum(); renderBadges(); renderHome();
initQuizzes(); initPractice(); initSongs();
State.renderXP();
Player.open('rock1');
document.getElementById('voice-on').addEventListener('change', e => { if (e.target.checked) Speech.say('Voice on. I will count with you and read sections aloud when you ask.'); else Speech.stop(); });
