// 5. 제대로 축하할 날짜 — 선호 순위 매기기.
//
// birthdayStyle 을 읽지 않는다. 어떤 모드를 골랐든 선택지는 똑같다.
import { DATE, CANDIDATE_DATES, rankLabel } from '../data/content.ko.js';
import { birthdayPlan, set, answered } from '../data/plan.js';
import { h, book, p, say, btn, input } from '../ui/book.js';
import { calendar } from '../ui/calendar.js';

export const step = 'date';
// params.ret 은 "요약에서 한 줄 고치러 왔다" 는 표시. 그때는 왔던 자리로 되돌아간다.
export const back = (params) => (params.ret ? ['summary', {}] : ['style', {}]);

export function render({ go, params }) {
  // 이 화면에 들어온 시점에 이미 답이 있었는지. XP 를 두 번 주지 않기 위해 본다.
  const again = answered().date;

  const calSlot = h('div', {});
  const pickedSlot = h('div', { class: 'picked' });
  // 고치러 온 길이면 보상 화면을 건너뛰고 곧장 결과로 돌아간다
  const onNext = () => (params.ret ? go('summary') : go('payoff', { from: 'date', again, particle: 'xp' }));
  const next = btn(DATE.button, { primary: true, onClick: onNext });

  const redraw = () => {
    calSlot.replaceChildren(calendar(birthdayPlan.datePreferences, (prefs) => {
      set('datePreferences', prefs);
      redraw();
    }));

    const sorted = [...birthdayPlan.datePreferences].sort((a, b) => a.rank - b.rank);
    pickedSlot.replaceChildren(...sorted.map((d) => {
      const [, m, day] = d.date.split('-');
      const star = CANDIDATE_DATES.includes(d.date) ? ' ✨' : '';
      return h('span', { class: 'picked-chip', text: `${rankLabel(d.rank)} ${Number(m)}/${Number(day)}${star}` });
    }));

    next.disabled = sorted.length === 0;
    next.textContent = sorted.length === 0 ? DATE.empty : DATE.button;
  };
  redraw();

  let timer = 0;
  const onNote = (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => set('dateNote', v), 400);
  };

  return h('div', {},
    say(DATE.say),
    book({
      title: DATE.title,
      kids: [
        p(DATE.sub),
        p(DATE.howto, 'line big'),
        calSlot,
        pickedSlot,
        p(DATE.calNote, 'line small'),
        input({
          label: DATE.noteLabel,
          placeholder: DATE.notePlaceholder,
          value: birthdayPlan.dateNote,
          rows: 3,
          onInput: onNote,
        }),
      ],
    }),
    next,
  );
}
