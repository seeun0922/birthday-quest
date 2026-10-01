// 부팅과 화면 전환.
//
// 화면 모듈은 { step, back, render(ctx) } 를 내보낸다.
//   step   진행 표시에 쓸 STEPS 의 key (없으면 null)
//   back   뒤로 갔을 때 갈 곳. [이름, 파라미터] 또는 null
//   festa  배경을 잔치로 바꿀 화면인가 (없으면 평소 밤바다)
//   render 화면 노드를 만들어 돌려준다
import { buildScene } from './ui/scene.js';
import { progress } from './ui/progress.js';
import { loadLocal, birthdayPlan, reset } from './data/plan.js';
import { h } from './ui/book.js';
import { fireworks } from './ui/particles.js';
import { clearRoam } from './ui/runaway.js';
import { musicOn, setMusic } from './ui/music.js';
import { CREDITS, STYLE } from './data/content.ko.js';

import * as intro from './screens/intro.js';
import * as greet from './screens/greet.js';
import * as quest from './screens/quest.js';
import * as style from './screens/style.js';
import * as date from './screens/date.js';
import * as food from './screens/food.js';
import * as gift from './screens/gift.js';
import * as payoff from './screens/payoff.js';
import * as summary from './screens/summary.js';
import * as done from './screens/done.js';

const SCREENS = { intro, greet, quest, style, date, food, gift, payoff, summary, done };

const stage = document.getElementById('stage');
const slot = document.getElementById('progress-slot');
const backBtn = document.getElementById('back');
const bg = document.getElementById('bg');

let here = { name: 'intro', params: {} };

export function go(name, params = {}) {
  const screen = SCREENS[name];
  if (!screen) return;
  here = { name, params };
  draw();
  window.scrollTo(0, 0);
}

function draw() {
  const screen = SCREENS[here.name];
  // 완료 화면을 떠나면 불꽃놀이를 멈춘다 (완료 화면은 그린 뒤 다시 켠다)
  fireworks(false);
  // 도망다니는 버튼은 본문 바깥에 살기 때문에 화면을 떠날 때 따로 치워야 한다
  clearRoam();
  // 마지막 퀘스트를 마친 뒤부터 배경이 잔치로 바뀐다.
  // 답변 상태로 정하면, 이어서 들어온 사람은 인사 화면부터 폭죽이 터져버린다.
  // "어디까지 왔는가" 는 화면이 스스로 알고 있으므로 화면에게 묻는다 (festa).
  bg.classList.toggle('festa', typeof screen.festa === 'function'
    ? !!screen.festa(here.params)
    : !!screen.festa);
  const ctx = { go, params: here.params };

  slot.replaceChildren(progress(typeof screen.step === 'function' ? screen.step(here.params) : screen.step));

  const node = screen.render(ctx);
  node.classList.add('screen');
  stage.replaceChildren(node, credit());

  const back = typeof screen.back === 'function' ? screen.back(here.params) : screen.back;
  backBtn.classList.toggle('hidden', !back);
  backBtn.onclick = back ? () => go(back[0], back[1] || {}) : null;
}

function credit() {
  return h('div', { class: 'credit' },
    '한글 픽셀 글꼴 ',
    h('a', { href: CREDITS.fontUrl, target: '_blank', rel: 'noopener', text: CREDITS.font }),
  );
}

// ── 개발용 URL 파라미터 ──────────────────
// ?screen=date       그 화면에서 바로 시작 (스크린샷·검증용)
// ?screen=payoff&from=style
// &seed              답을 미리 채워 넣는다 (요약·완료 화면 확인용)
// ?fresh             저장해둔 답을 지우고 처음부터 (화면 지정 없이 단독으로도 쓴다)
function devStart() {
  const q = new URLSearchParams(location.search);
  if (q.has('fresh')) reset();

  const name = q.get('screen');
  if (!name || !SCREENS[name]) return false;

  if (q.has('seed')) {
    Object.assign(birthdayPlan, {
      birthdayStyle: 'survival',
      datePreferences: [
        { date: '2026-10-13', rank: 1 },
        { date: '2026-11-06', rank: 2 },
        { date: '2026-10-07', rank: 3 },
      ],
      dateNote: '평일이면 저녁만 가능해!',
      foodPreferences: [{ key: 'seafood', rank: 1 }, { key: 'beef', rank: 2 }],
      foodAny: false,
      customFood: '',
      mealPreferences: [{ key: 'bbq', rank: 1 }, { key: 'restaurant', rank: 2 }, { key: 'cook', rank: 3 }],
      mealAny: false,
      giftType: 'have',
      giftNote: '향수, 지갑',
    });
  }

  const params = {};
  for (const [k, v] of q) if (k !== 'screen' && k !== 'seed') params[k] = v;
  if (name === 'payoff') {
    params.from = params.from || 'style';
    const o = STYLE.options.find((x) => x.key === birthdayPlan.birthdayStyle) || STYLE.options[0];
    if (params.from === 'style') Object.assign(params, { lines: o.reply.lines, gain: o.reply.gain, tone: o.tone, particle: o.particle });
  }
  go(name, params);
  return true;
}

// ── 음악 스위치 ──────────────────────────
// 소리는 사람이 무언가 누른 뒤에야 날 수 있다 (브라우저 규칙).
// 그래서 여기서는 버튼 모양만 맞추고, 실제 재생은 이 버튼이나 START 가 시작한다.
const soundBtn = document.getElementById('sound');
function paintSound() {
  soundBtn.classList.toggle('off', !musicOn());
  soundBtn.setAttribute('aria-label', musicOn() ? '음악 끄기' : '음악 켜기');
}
soundBtn.onclick = () => { setMusic(!musicOn()); paintSound(); };
paintSound();

// ── 시작 ────────────────────────────────
buildScene(document.getElementById('bg'));
loadLocal();
if (!devStart()) go('intro');
