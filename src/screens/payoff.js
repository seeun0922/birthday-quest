// 퀘스트 보상 화면. 네 질문이 전부 여기로 모여서 같은 모양으로 끝난다.
//
// params = { from, lines?, gain?, tone?, particle? }
//   from   'style' | 'date' | 'food' | 'gift'
//   lines  리액션 대사 (없으면 PAYOFF 의 기본 대사)
//   gain   초록 띠에 쓸 문구 (없으면 'XX 퀘스트 완료!')
import { PAYOFF, payoffTitle } from '../data/content.ko.js';
import { birthdayPlan } from '../data/plan.js';
import { h, book, p, btn } from '../ui/book.js';
import { xpBar } from '../ui/xp.js';
import { burst } from '../ui/particles.js';

const NEXT = { style: 'date', date: 'food', food: 'gift', gift: 'summary' };

export const step = (params) => params.from;
export const back = (params) => [params.from, {}];
// 마지막 퀘스트(선물)를 마치는 순간부터 배경이 잔치로 바뀐다
export const festa = (params) => params.from === 'gift';

export function render({ go, params }) {
  const d = PAYOFF[params.from];
  if (!d) return h('div', {});

  // 색은 고른 모드를 따라간다. style 화면만 tone 을 직접 넘기므로,
  // 나머지 세 보상은 저장된 선택에서 가져와야 한다 (안 그러면 늘 초록이다).
  const tone = params.tone || birthdayPlan.birthdayStyle || 'survival';
  const lines = params.lines || d.lines || [];

  // 화면이 붙은 다음에 터뜨려야 캔버스 크기가 잡혀 있다
  requestAnimationFrame(() => burst(params.particle || 'xp'));

  return h('div', {},
    book({
      title: payoffTitle(d.n),
      kids: [
        ...lines.map((t) => p(t, 'line quote')),
        params.gain ? h('p', { class: `gain ${tone}`, text: params.gain }) : null,
        xpBar({ tone, again: !!params.again }),
        p(d.body),
        p(d.quote, 'line quote'),
      ].filter(Boolean),
    }),
    btn(d.button, { primary: true, onClick: () => go(NEXT[params.from]) }),
  );
}
