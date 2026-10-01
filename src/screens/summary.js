// 8. 결과 확인. 각 줄을 누르면 그 질문으로 되돌아간다.
import { SUMMARY } from '../data/content.ko.js';
import { summaryRows, save, set, birthdayPlan } from '../data/plan.js';
import { h, book, p, btn, input } from '../ui/book.js';

export const step = 'done';
export const back = ['gift', {}];
export const festa = true;

export function render({ go }) {
  // 적어둔 한마디는 결과 그림과 보내는 글에 그대로 따라붙는다 (plan.js summaryRows).
  let timer = 0;
  const onLast = (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => set('lastWord', v), 400);
  };

  const lastBox = input({
    label: SUMMARY.lastLabel,
    placeholder: SUMMARY.lastPlaceholder,
    value: birthdayPlan.lastWord,
    rows: 3,
    onInput: onLast,
  });

  // 적다가 곧바로 화면을 떠나면 400ms 가 아직 안 지나 한마디를 놓친다.
  // 떠나기 전에는 반드시 값을 확정한다 (고치러 갈 때도, 완료로 넘어갈 때도).
  const flush = () => {
    clearTimeout(timer);
    set('lastWord', lastBox.querySelector('textarea').value);
  };

  const finish = () => {
    flush();
    save();
    go('done');
  };

  return h('div', {},
    book({
      title: SUMMARY.title,
      kids: [
        // ret 를 달아 보내면 그 화면이 답을 받은 뒤 보상 화면을 건너뛰고
        // 곧장 여기로 돌아온다. 한 줄 고치러 갔다가 끝까지 다시 걷지 않아도 된다.
        h('div', { class: 'sum' }, ...summaryRows().map((r) => h('button', {
          class: 'sum-row', type: 'button', onClick: () => { flush(); go(r.goto, { ret: 1 }); },
        },
          h('span', { class: 'sum-icon', text: r.icon }),
          h('span', { class: 'sum-cell' },
            h('span', { class: 'sum-key', text: r.label }),
            h('span', { class: 'sum-val', text: r.lines.join('\n') }),
          ),
        ))),
        p(SUMMARY.editHint, 'line small center'),
        h('div', { class: 'sum-note' },
          p(SUMMARY.noteTitle, 'line'),
          p(SUMMARY.note, 'line small'),
          h('p', { class: 'sum-punch', text: SUMMARY.punch }),
        ),
        lastBox,
      ],
    }),
    btn(SUMMARY.button, { primary: true, onClick: finish }),
  );
}
