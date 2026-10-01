// 퀘스트 보상 표시.
//
// 눈금은 위쪽 진행 표시(STEPS)를 그대로 따른다.
//   점 하나 = 막대 한 칸 = XP_STEP
// 그래서 배너의 ● 개수와 찬 막대 칸 수가 언제나 같다.
import { STEPS, XP_TOTAL, XP_STEP, xpLine, XP_AGAIN } from '../data/content.ko.js';
import { answered } from '../data/plan.js';
import { h } from './book.js';

const BLOCKS = STEPS.length;

// 끝낸 단계 수.
// extra 는 화면이 직접 "이 단계도 끝났다"고 알려주는 칸이다. 마지막 '완료' 점은
// 저장을 눌러야 켜지는데 그건 답변만 봐서는 알 수 없으므로 완료 화면이 1 을 넘긴다.
export function doneSteps(extra = 0) {
  return Object.values(answered()).filter(Boolean).length + extra;
}

export const gainedXp = (extra = 0) => doneSteps(extra) * XP_STEP;

// 🟩 +20 XP   ▰▰▱▱▱
export function xpBar({ tone = 'survival', again = false, extra = 0 } = {}) {
  const filled = Math.min(doneSteps(extra), BLOCKS);
  const total = filled * XP_STEP;

  const bar = h('div', { class: 'xp-bar', role: 'img', 'aria-label': `경험치 ${total}/${XP_TOTAL}` });
  for (let i = 0; i < BLOCKS; i++) bar.appendChild(h('i', { class: i < filled ? 'xp-on' : 'xp-off' }));

  return h('div', { class: `xp ${tone}` },
    h('div', { class: 'xp-row' },
      h('span', {
        class: `xp-gain ${again ? 'again' : ''}`.trim(),
        text: again ? XP_AGAIN : xpLine(XP_STEP),
      }),
      h('span', { class: 'xp-total', text: `${total} / ${XP_TOTAL} XP` }),
    ),
    bar,
  );
}
