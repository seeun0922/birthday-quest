// 4. 생일 당일의 플레이 스타일.
//
// 여기서 고른 값은 의견 수렴일 뿐이다. 날짜 화면은 이 값을 읽지 않는다.
import { STYLE } from '../data/content.ko.js';
import { set, birthdayPlan, answered } from '../data/plan.js';
import { h, book, p, say } from '../ui/book.js';

export const step = 'style';
// params.ret 은 "요약에서 한 줄 고치러 왔다" 는 표시. 그때는 왔던 자리로 되돌아간다.
export const back = (params) => (params.ret ? ['summary', {}] : ['quest', {}]);

export function render({ go, params }) {
  // 이 화면에 들어온 시점에 이미 답이 있었는지. XP 를 두 번 주지 않기 위해 본다.
  const again = answered().style;

  const pick = (o) => {
    set('birthdayStyle', o.key);
    // 고치러 온 길이면 보상 화면을 건너뛰고 곧장 결과로 돌아간다
    if (params.ret) return go('summary');
    go('payoff', { from: 'style', again, lines: o.reply.lines, gain: o.reply.gain, tone: o.tone, particle: o.particle });
  };

  return h('div', {},
    say(STYLE.say),
    book({
      title: STYLE.title,
      kids: [
        p(STYLE.sub, 'line big'),
        p(STYLE.note, 'line small'),
      ],
    }),
    h('div', { class: 'cards' }, ...STYLE.options.map((o) => card(o, pick))),
  );
}

function card(o, pick) {
  const on = birthdayPlan.birthdayStyle === o.key;
  return h('button', {
    class: `card ${o.tone} ${on ? 'on' : ''}`.trim(),
    type: 'button',
    onClick: () => pick(o),
  },
    h('span', { class: 'card-chip', text: o.chip }),
    h('span', { class: 'card-name', text: o.name }),
    h('span', { class: 'card-tag', text: o.tagline }),
    h('span', { class: 'card-lines' }, ...o.lines.map((t) => h('span', { text: t }))),
    h('span', { class: 'card-foot' },
      h('span', { class: 'card-stars', text: `난이도 ${o.stars}` }),
      h('span', { class: 'card-go', text: o.button }),
    ),
  );
}
