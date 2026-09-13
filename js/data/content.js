// Written content: theory, reading legend and examples, technique, warm up routine, common mistakes.

export const THEORY = [
  { t: 'Kit anatomy', kit: true, html: `<p>Tap a part of the kit to hear it. The names matter because notation, tabs and every teacher use them.</p>
    <p>Snare: the drum between your knees, wires under the bottom head give the crack. Kick (bass drum): played with the right foot. Hi hat: two cymbals on a stand, closed with the left foot; it can be closed (tight tick), open (wash) or played with the foot alone (chick). Toms: high and mid on the kick, floor tom to your right; pitched high to low. Ride: large cymbal to the right, played for steady patterns. Crash: smaller, brighter, played for accents.</p>
    <p>Electronic kits: the important settings are pad sensitivity and hi hat pedal calibration. If ghost notes do not trigger, lower the threshold. If open hats never sound, recalibrate the pedal.</p>` },
  { t: 'Pulse, beats and bars', g: 'coord1', html: `<p>The pulse is the steady heartbeat you tap your foot to. One pulse is a beat. Beats are grouped into bars. The time signature tells you how many beats and what kind: 4/4 means four beats per bar and the quarter note gets one beat.</p><p>Tempo is beats per minute. 60 BPM is one beat per second. Most rock lives between 90 and 140.</p>` },
  { t: 'Note values and subdivisions', g: 'ss16', html: `<p>A whole note lasts a full bar of 4/4, a half note two beats, a quarter note one beat, an eighth half a beat, a sixteenth a quarter of a beat. Each value is half of the one before. Rests have the same lengths and mean silence.</p>
    <p>Subdividing means chopping the beat into equal pieces and counting them. Eighths are counted 1 and 2 and. Sixteenths are counted 1 e and a 2 e and a. Triplets divide the beat into three: 1 trip let. Sixteenth triplets divide it into six. Listen to the four subdivisions in the metronome and say the counts.</p>
    <p>Why it matters: every groove and fill is a selection of notes from a subdivision grid. If you can count the grid, you can place any note.</p>` },
  { t: 'Time signatures: 4/4, 3/4, 6/8', g: 'six8a', html: `<p>4/4 is four quarter note beats, the default for rock. 3/4 is three quarter notes; a waltz, but also plenty of rock (Pink Floyd's slower material dips into 3 and 6 frequently). 6/8 is six eighth notes felt as two groups of three, with weight on 1 and 4. The difference between 3/4 and 6/8 is grouping, not the number of notes: 3/4 is three groups of two eighths, 6/8 is two groups of three.</p>
    <p>In this course the tempo for x/8 meters is given for the eighth note, so 180 in 6/8 means 180 eighths per minute, which is 60 groups of three.</p>` },
  { t: 'Odd meters used by Pink Floyd and Radiohead', g: 'seven4', html: `<p>Odd meters have 5, 7 or other counts per bar. You feel them as groups of 2 and 3: 5 is 3 + 2 or 2 + 3, 7 is 4 + 3, 3 + 4 or 2 + 2 + 3.</p>
    <p>Money is the famous 7/4 example (7 quarters, verses, then the guitar solo moves to 4/4). Radiohead: 15 Step is in 5/4, 2 + 2 = 5 is commonly described as alternating 7/8 sections with 4/4, and Pyramid Song is deliberately ambiguous; analysts disagree about whether it is best written in 4/4 with heavy syncopation or something else, so I will not claim one answer. Everything in Its Right Place is often analysed as 10/4, though again I have seen it written other ways.</p>
    <p>How to learn any odd meter: say the grouping out loud (1 2 3 1 2 3 4) for a full minute, then add the hi hat only, then kick, then snare. Never start with all limbs.</p>` },
  { t: 'Dynamics, ghost notes and accents', g: 'six1', html: `<p>Dynamics are volume. Written as p (soft), mp, mf, f (loud), ff. On drums, volume comes from stick height and speed, not from squeezing.</p>
    <p>An accent is one note louder than its neighbours, marked with a wedge above the note. A ghost note is one note much quieter than its neighbours, written with the notehead in parentheses. Ghost notes are what make sixteenth grooves feel alive; they should be felt more than heard.</p>
    <p>The exercise: sixteenths on the snare at one volume, then move a single accent to each of the four positions (accent control exercises in the Rudiments category).</p>` },
  { t: 'Song structure', g: 'form1', html: `<p>Rock songs are built from sections of 4, 8 or 16 bars: intro, verse, pre chorus, chorus, bridge, solo, outro. The drummer's job at each boundary is to signal it, usually with a fill in the last bar and a crash on the first beat of the new section.</p>
    <p>Two habits: count bars in groups of four with your fingers or your head, and change something small at every section (open hat, ride instead of hat, half time) so the listener knows where they are. Listen to how Oasis choruses move to the ride or open hats, and how Nick Mason marks every section with a tom figure.</p>` },
];

/* ============ Reading ============ */
export const READING_INTRO = `<p>A drum staff has five lines. Unlike pitched music the vertical position means an instrument, not a pitch. Conventions vary slightly between publishers, so always check the legend at the top of a chart. This page uses the layout recommended by the Percussive Arts Society, which most modern books follow.</p>
<ul><li>Kick: bottom space, stem down or up (this page uses stems up for everything).</li><li>Snare: second space from the top.</li><li>Floor tom: space just above the kick. Mid tom: fourth line. High tom: top space.</li><li>Hi hat: x notehead above the top line. Open hat: x with a small circle above it. Hat played with the foot: x below the staff.</li><li>Ride: x on the top line. Crash: x with a ledger line above the staff.</li><li>Ghost note: notehead in parentheses. Accent: wedge above.</li><li>Sticking letters under the staff: R and L for hands, K for the kick foot.</li></ul>
<p>Rhythm reading: stems are joined by beams in groups of one beat. One beam means eighths, two beams means sixteenths, a bracket with a 3 means triplets. A note with a flag is an eighth on its own.</p>
<h4>Drum tabs</h4>
<p>Tabs are the text version of a drum part. One line per instrument, one character per grid position (a sixteenth note here, or one triplet note in shuffle grooves), a bar line every bar. Tabs carry no note values of their own, so the grid spacing is all the timing information you get. Read the count row underneath first, then the kick line, then the snare, then the hats. Tabs from the internet are often wrong about kick placement and rarely show ghost notes, so treat them as a sketch and trust your ears.</p>
<table class="leg" style="border-collapse:collapse;font-size:14px;margin:6px 0 10px">
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">x</td><td>normal hit</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">X</td><td>accented hit, play it louder</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">o</td><td>ghost note, play it very softly (many online tabs use g instead)</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">-</td><td>nothing on that grid position</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">|</td><td>bar line</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">HH HO HF</td><td>closed hi hat, open hi hat (its own line on this page; online tabs often write o on the HH line), hi hat played with the foot</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">RD CR</td><td>ride, crash</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">SN T1 T2 FT BD</td><td>snare, high tom, mid tom, floor tom, bass drum (online you will also see S, HT, MT, LT or FT, B or K)</td></tr>
<tr><td style="padding:3px 14px 3px 0;color:var(--muted)">R L K</td><td>sticking row when present: right hand, left hand, kick foot. Lower case letters are grace notes</td></tr>
</table>
<p>Every example below shows notation and tab together. Use the tab reading test further down to practise tabs on their own.</p>`;
export const READING_EXAMPLES = [
  { g: 'coord1', lvl: 1, note: 'Quarters on the kick, eighths on the hat. Two instruments, one beam per beat.' },
  { g: 'rock1', lvl: 1, note: 'Add the snare. Notes stacked on one stem happen at the same time.' },
  { g: 'rock2', lvl: 1, note: 'The kick on the and of 3 shares a stem with the hat.' },
  { g: 'fill1', lvl: 1, note: 'Two bars. Bar 2 is eighths on the snare with quarters underneath.' },
  { g: 'six2', lvl: 2, note: 'A sixteenth kick. Note the double beam and the a of the beat.' },
  { g: 'six1', lvl: 2, note: 'Parentheses are ghost notes. Wedges are accents.' },
  { g: 'rockcrash', lvl: 2, note: 'Crash above the staff, open hat marked with a circle.' },
  { g: 'six8a', lvl: 2, note: '6/8: six eighths beamed in threes.' },
  { g: 'shuf1', lvl: 3, note: 'Triplets: three notes under a bracket with a 3, middle one resting on the hat.' },
  { g: 'seven4', lvl: 3, note: 'Seven beats. Count the beams to find your place.' },
  { g: 'bon4', lvl: 3, note: 'Sticking letters: R L K. The K is the kick.' },
  { g: 'linear1', lvl: 4, note: 'Linear: never two notes on one stem.' },
];

/* ============ Technique ============ */
export const TECHNIQUE = [
  { t: 'Matched grip', html: `<p>Both hands hold the stick the same way. The fulcrum is the pivot between the thumb pad and the first joint of the index finger, about a third of the way up from the butt. The other fingers curl loosely around the stick and never squeeze. There should be a gap you could slide a pencil through between palm and stick.</p>
    <p>Three matched positions: German (palms down, wrists do the work, powerful), French (thumbs up, fingers do the work, fast and quiet), American (in between, palms at about 45 degrees; the default for rock). Start American.</p>
    <p>Diagnostic: play eighths for a minute, then open your hand. If the stick is dented into your palm or your forearm burns, you are squeezing.</p>` },
  { t: 'Traditional grip', html: `<p>The left hand turns palm up and the stick rests in the web between thumb and index finger, held by the thumb and ring finger, with the wrist rotating like turning a doorknob. It comes from marching drums slung at an angle. It is not necessary for rock (Bonham, Mason and Selway all use matched), but knowing it exists explains what you see in jazz videos. Learn it later if you want; do not let it slow you down now.</p>` },
  { t: 'Stroke types and rebound', g: 'acc1', html: `<p>Four strokes cover everything. Full stroke: start high, hit, return high. Down stroke: start high, hit, stop low (used before a quiet note). Tap: start low, hit, stay low (quiet notes, ghosts). Up stroke: start low, hit, lift high (before a loud note).</p>
    <p>Rebound: the stick wants to bounce back. Let it. The drumhead does half the lifting. The accent control exercise is the drill: full or down strokes on the accent, taps on the rest, and an up stroke on the note before each accent.</p>` },
  { t: 'Bass drum: heel down and heel up', g: 'bon2', html: `<p>Heel down: the whole foot stays on the pedal and the ankle moves. Quiet, controlled, good for slow to mid tempos and dynamics. Learn this first. Heel up: the heel lifts and the leg drops the foot onto the pedal. Louder and faster, needed for doubles and for anything over roughly 120 BPM with busy kick parts.</p>
    <p>Two rules: do not bury the beater into the head (let it come off so the drum rings) and keep the other foot heavy on the hi hat so you are not balancing on the throne.</p>
    <p>Doubles: heel up, then either two leg drops or one drop with a slide of the foot up the pedal. Try both. The Bonham style kick doubles exercise is the test.</p>` },
  { t: 'Hi hat control', g: 'six3', html: `<p>The left foot is a second instrument. Closed tight gives a tick, slightly loose gives a sizzle, open gives a wash that ends when you stamp it shut. Foot only (the chick) keeps time when your hands are on the ride.</p>
    <p>Drill: eighths on the hat with the hand while the foot opens on the and of 4 and closes on 1. Then open on every and. Then play the ride groove with the foot chicking on every beat.</p>
    <p>On an electronic kit, calibrate the pedal so half open is actually available. Most factory settings are all or nothing.</p>` },
  { t: 'The essential rudiments', g: 'pd', html: `<p>Of the forty standard rudiments, five carry most of rock: single stroke roll, double stroke roll, single paradiddle, flam and drag. They are all in the Rudiments category with playback and sticking.</p>
    <p>Method borrowed from Stick Control: pick one, play it for a full minute at a tempo where every note is perfect, then raise the tempo by 4 BPM. Write the tempo down. Only chase speed after evenness. Ten minutes a day on rudiments beats an hour once a week.</p>` },
  { t: 'Warm up routine', html: `<p>Ten minutes, before every session, at a comfortable tempo. The full routine with timers is on the Practice page.</p>` },
];
export const WARMUP = [
  { g: 'ss8', min: 2, bpm: 80, t: 'Single strokes, eighths, alternating lead hand each bar' },
  { g: 'ss16', min: 2, bpm: 70, t: 'Single strokes, sixteenths' },
  { g: 'ds16', min: 2, bpm: 60, t: 'Double strokes' },
  { g: 'pd', min: 2, bpm: 70, t: 'Paradiddles with accents' },
  { g: 'coord1', min: 1, bpm: 80, t: 'Hat and kick together' },
  { g: 'rock1', min: 1, bpm: 90, t: 'Core beat, quiet, counting out loud' },
];

/* ============ Common mistakes ============ */
export const MISTAKES = [
  { t: 'Death grip and tension', s: 'Forearms ache, hands blister, you slow down when tired, everything sounds choked.', d: 'Play eighths for a minute then let go of the sticks. If they drop straight down you were relaxed. If you have to consciously open your fingers, you were squeezing.', f: 'Hold the stick with thumb and index finger only for a minute, then let the other fingers rest on it. Practice the tap stroke from two centimetres.', g: 'ss8' },
  { t: 'Hat and snare flam', s: 'On 2 and 4 you hear two attacks, a tiny "ka-dak", instead of one.', d: 'Record ten bars of the core beat on your phone and listen at half speed if your player allows it.', f: 'Hands only, no kick, eighths on hat and snare on 2 and 4. Watch both sticks strike at the same height.', g: 'coord2' },
  { t: 'Rushing fills', s: 'You land early on 1 after every fill, or the band drags behind you at the turnaround.', d: 'Play groove plus fill with the click for two minutes. If the click seems to disappear into your fill and pop out late on 1, you rushed.', f: 'Play the fill with quarter notes on the kick underneath. Then play half bar fills, which leave less room to speed up.', g: 'fill1' },
  { t: 'Losing the count', s: 'You cannot tell where 1 is after a fill or an odd meter bar.', d: 'Count out loud while playing the seven four groove. If you stop counting when the kick gets busy, this is you.', f: 'Count out loud on every groove for a week, hi hat and voice only first, then add limbs.', g: 'seven4' },
  { t: 'Uneven bass drum', s: 'Kick doubles come out as a long note and a short note, or the second is much quieter.', d: 'Play kick doubles into the beat at 80 with the click and compare to the playback.', f: 'Heel up, slow, both notes full leg drops. Raise the tempo 2 BPM at a time.', g: 'bon2' },
  { t: 'Everything at one volume', s: 'Ghost notes are as loud as backbeats, verses and choruses feel the same.', d: 'Play the four volume groove. If the p bar and the f bar sound alike, this is you.', f: 'Accent control exercises daily. Taps from two centimetres, accents from full height.', g: 'dyn1' },
  { t: 'Never using a metronome', s: 'Tempo drifts up through a song; you cannot play under 65 BPM.', d: 'Play a groove for two minutes without a click, then check the tempo of your last bar against your first.', f: 'Half of all practice with the click. Use the gap trainer to learn to hold time without it.', g: 'mason1' },
  { t: 'Only practising what you already can', s: 'Two years in, the same three beats.', d: 'Look at your log. If the focus column is always Free play, that is the diagnosis.', f: 'Every session: one thing that is hard, at a tempo where it is not, for ten minutes. Then the fun stuff.', g: 'pd' },
  { t: 'Heavy right hand, weak left', s: 'Sixteenths on the hat sound like a gallop; left handed ghost notes vanish.', d: 'Play single stroke sixteenths starting with the left. If it feels alien, the left is undertrained.', f: 'Start every rudiment with the left hand for a month. Lead fills with the left occasionally.', g: 'ss16' },
  { t: 'Sitting wrong', s: 'Back pain, one shoulder higher, foot slipping off the hi hat.', d: 'Look at yourself in a mirror or on video from the side. Thighs should slope slightly down toward the knee, elbows roughly at right angles.', f: 'Throne up until your knees are below your hips. Pull the snare in so your forearms are level. Everything within relaxed reach.', g: null },
  { t: 'Skipping reading', s: 'You cannot learn a groove without hearing it played, and tabs from the internet lead you astray.', d: 'Try the reading challenge on Hard. Below 60 percent means the reading habit is not there yet.', f: 'Five minutes a day with the reading examples: read, then play, then check with playback.', g: null },
];
