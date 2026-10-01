// 7. 갖고 싶은 것
import { GIFT } from '../data/content.ko.js';
import { birthdayPlan, set, answered } from '../data/plan.js';
import { h, book, say, btn, input } from '../ui/book.js';

export const step = 'gift';
// params.ret 은 "요약에서 한 줄 고치러 왔다" 는 표시. 그때는 왔던 자리로 되돌아간다.
export const back = (params) => (params.ret ? ['summary', {}] : ['food', {}]);

// 타이머를 모듈 하나로 둔다. 화면을 몇 번 다시 그려도 돌아가는 건 늘 하나뿐이라,
// 옛 타이머가 살아남아 말풍선이 둘로 보이는 일이 생길 수 없다.
let nagTimer = 0;
const stopNag = () => { clearInterval(nagTimer); nagTimer = 0; };

export function render({ go, params }) {
  stopNag();

  // 이 화면에 들어온 시점에 이미 답이 있었는지. XP 를 두 번 주지 않기 위해 본다.
  const again = answered().gift;

  const optsSlot = h('div', { class: 'opts' });
  const writeSlot = h('div', {});
  // 고치러 온 길이면 보상 화면을 건너뛰고 곧장 결과로 돌아간다
  const onNext = () => (params.ret ? go('summary') : go('payoff', { from: 'gift', again, particle: 'fire' }));
  const next = btn(GIFT.button, { primary: true, onClick: onNext });

  // 적는 동안 입력칸 아래에서 쫑알대는 말풍선.
  // redraw() 가 writeSlot 을 갈아끼워도 이 노드 하나를 계속 옮겨 쓴다.
  const nagBox = h('div', { class: 'nag', text: GIFT.nags[0] });
  let nagAt = 0;

  // 글자는 한 번에 바꾼다. 예전처럼 '지웠다가 190ms 뒤에 새로 넣는' 방식은
  // 그 사이에 옛 글과 새 글이 함께 보일 틈을 만든다. 등장 효과는 애니메이션으로만.
  const swap = (text) => {
    nagBox.textContent = text;
    nagBox.classList.remove('in');
    void nagBox.offsetWidth;          // 애니메이션을 다시 트리거하려면 리플로우가 필요하다
    nagBox.classList.add('in');
  };

  const startNag = () => {
    if (nagTimer) return;
    nagTimer = setInterval(() => {
      // 화면을 떠나면 노드가 문서에서 떨어진다. 그때 스스로 멈춘다.
      if (!nagBox.isConnected) return stopNag();
      nagAt = (nagAt + 1) % GIFT.nags.length;
      swap(GIFT.nags[nagAt]);
    }, 3800);
  };

  let timer = 0;
  const onNote = (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => { set('giftNote', v); refresh(); }, 400);
  };

  const refresh = () => {
    const have = birthdayPlan.giftType === 'have';
    next.disabled = !birthdayPlan.giftType || (have && !birthdayPlan.giftNote.trim());
  };

  const redraw = () => {
    optsSlot.replaceChildren(...GIFT.options.map((o) => h('button', {
      class: `opt ${birthdayPlan.giftType === o.key ? 'on' : ''}`.trim(),
      type: 'button',
      onClick: () => { set('giftType', o.key); redraw(); },
    },
      h('span', { class: 'opt-icon', text: o.icon }),
      h('span', { class: 'opt-label', text: o.label }),
    )));

    const have = birthdayPlan.giftType === 'have';
    writeSlot.replaceChildren(have
      ? h('div', { class: 'nag-wrap' },
        input({
          label: GIFT.haveLabel,
          placeholder: GIFT.havePlaceholder,
          value: birthdayPlan.giftNote,
          onInput: onNote,
        }),
        nagBox,
      )
      : h('span', { class: 'hidden' }));
    if (have) startNag(); else stopNag();
    refresh();
  };
  redraw();

  return h('div', {},
    say(GIFT.say),
    book({ title: GIFT.title, kids: [optsSlot, writeSlot] }),
    next,
  );
}
