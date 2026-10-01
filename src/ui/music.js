// 8비트 생일 축하 노래. 음원 파일 없이 오실레이터로 직접 만든다.
//
// 브라우저는 사람이 무언가 누르기 전에는 소리를 못 내게 막는다.
// 그래서 kick() 은 반드시 클릭 처리 안에서 불러야 하고, 그 전에는 아무 소리도 나지 않는다.
// 끄고 켠 선택은 기기에 남겨서 다시 들어와도 유지된다.

const KEY = 'birthday-quest-music';

// 도레미 (4옥타브 솔 ~ 5옥타브 솔)
const G4 = 392, A4 = 440, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

// [음 높이, 길이(박)] — 생일 축하합니다 네 마디
const MELODY = [
  [G4, .5], [G4, .5], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
  [G4, .5], [G4, .5], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
  [G4, .5], [G4, .5], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2],
  [F5, .5], [F5, .5], [E5, 1], [C5, 1], [D5, 1], [C5, 3],
];

const BEAT = 0.4;       // 한 박의 길이(초)
const GAP = 1.6;        // 한 바퀴 돌고 다시 시작하기까지 쉬는 시간(초)
const VOL = 0.05;       // 배경음이다. 본문을 읽는 데 방해가 되면 안 된다.

let ctx = null, out = null;
let playing = false, timer = 0;
// 미리 예약해둔 오실레이터. 끌 때 이걸 전부 멈추지 않으면,
// 다시 켰을 때 잠들어 있던 옛 음들이 새 연주와 함께 울려 겹쳐 들린다.
let voices = [];

// 저장해둔 선택. 처음 온 사람에게는 켜진 상태로 시작한다 (생일 카드니까).
let wanted = true;
try { wanted = localStorage.getItem(KEY) !== 'off'; } catch { /* 시크릿 모드 */ }

export const musicOn = () => wanted;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  out = ctx.createGain();
  out.gain.value = VOL;
  out.connect(ctx.destination);
  return ctx;
}

// 네모파 한 음. 칼같이 끊으면 '딱' 하는 잡음이 생기므로 짧게 올렸다 내린다.
function note(freq, at, dur, type = 'square', level = 1) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(level, at + 0.012);
  g.gain.setValueAtTime(level, at + dur * 0.68);
  g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
  o.connect(g);
  g.connect(out);
  o.start(at);
  o.stop(at + dur + 0.02);

  voices.push(o);
  o.onended = () => { voices = voices.filter((v) => v !== o); };
}

// 한 바퀴를 통째로 미리 예약한다. setTimeout 으로 한 음씩 울리면 박자가 흔들린다.
function schedule() {
  let t = ctx.currentTime + 0.1;
  for (const [freq, beats] of MELODY) {
    const dur = beats * BEAT;
    note(freq, t, dur * 0.9);
    // 긴 음 아래에만 한 옥타브 낮은 소리를 깔아준다. 허전함이 덜하다.
    if (beats >= 1) note(freq / 2, t, dur * 0.85, 'triangle', 0.33);
    t += dur;
  }
  const total = t - ctx.currentTime + GAP;
  clearTimeout(timer);
  timer = setTimeout(() => { if (playing) schedule(); }, total * 1000);
}

function begin() {
  if (playing || !ensure()) return;
  playing = true;
  // 탭을 바꿨다 돌아오면 멈춰 있을 수 있다
  if (ctx.state === 'suspended') ctx.resume();
  schedule();
}

function halt() {
  playing = false;
  clearTimeout(timer);
  timer = 0;
  if (!ctx) return;

  // 소리를 짧게 내린 뒤, 예약해둔 음까지 전부 끊는다.
  // 예전에는 ctx.suspend() 로 시계만 멈췄는데, 그러면 예약은 그대로 남아 있다가
  // 다시 켤 때 한꺼번에 깨어나 새 연주와 겹쳤다.
  const now = ctx.currentTime;
  out.gain.cancelScheduledValues(now);
  out.gain.setValueAtTime(out.gain.value, now);
  out.gain.linearRampToValueAtTime(0, now + 0.12);

  const dying = voices;
  voices = [];
  for (const o of dying) {
    try { o.stop(now + 0.14); } catch { /* 이미 끝난 음 */ }
  }
}

// 사람이 무언가 누른 순간에 부른다. 켜 두었다면 그때 소리가 시작된다.
export function kick() {
  if (!wanted) return;
  if (ctx) {
    out.gain.cancelScheduledValues(ctx.currentTime);
    out.gain.setValueAtTime(VOL, ctx.currentTime);
  }
  begin();
}

// 켜고 끄기. 끄면 바로 조용해지고, 켜면 바로 다시 흐른다.
export function setMusic(on) {
  wanted = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* 무시 */ }
  if (on) kick(); else halt();
  return wanted;
}
