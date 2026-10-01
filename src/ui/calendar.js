// 순위를 매기는 달력. 누른 순서대로 1·2·3순위가 붙고, 다시 누르면 빠지면서 뒤가 당겨진다.
//
// birthdayStyle 과는 아무 상관이 없다. 어떤 모드를 골랐든 선택지는 똑같다.
import { CANDIDATE_DATES, CAL_MONTHS, BIRTHDAY, rankLabel } from '../data/content.ko.js';
import { h } from './book.js';
import { toggle } from './rank.js';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const key = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const today = () => {
  const n = new Date();
  return key(n.getFullYear(), n.getMonth() + 1, n.getDate());
};

// onChange(nextPrefs) 를 부르고, 호출한 쪽이 다시 그린다.
export function calendar(prefs, onChange) {
  const wrap = h('div', { class: 'cal-wrap' });
  const min = today();

  for (const { y, m } of CAL_MONTHS) {
    const grid = h('div', { class: 'cal-grid' },
      ...DOW.map((d, i) => h('div', { class: `cal-dow dow-${i}`, text: d })),
    );

    const first = new Date(y, m - 1, 1).getDay();
    const days = new Date(y, m, 0).getDate();
    for (let i = 0; i < first; i++) grid.appendChild(h('div', { class: 'cal-pad' }));

    for (let d = 1; d <= days; d++) {
      const k = key(y, m, d);
      const past = k < min;
      const cand = CANDIDATE_DATES.includes(k);
      const pick = prefs.find((p) => p.date === k);
      const bday = y === BIRTHDAY.y && m === BIRTHDAY.m && d === BIRTHDAY.d;

      const cls = ['cal-day'];
      if (past) cls.push('past');
      if (cand) cls.push('cand');
      if (pick) cls.push('on');
      if (bday) cls.push('bday');

      const cell = h('button', {
        class: cls.join(' '),
        type: 'button',
        disabled: past || null,
        'aria-label': `${m}월 ${d}일${pick ? ` ${pick.rank}순위` : ''}`,
        onClick: past ? null : () => onChange(toggle(prefs, k, 'date')),
      },
        pick ? h('i', { class: 'cal-rank', text: rankLabel(pick.rank) }) : null,
        h('span', { class: 'cal-num', text: String(d) }),
        cand ? h('i', { class: 'cal-star', text: '✨' }) : null,
        bday ? h('i', { class: 'cal-cake', text: '🎂' }) : null,
      );
      grid.appendChild(cell);
    }

    wrap.appendChild(h('div', { class: 'cal' },
      h('div', { class: 'cal-head', text: `${y}년 ${m}월` }),
      grid,
    ));
  }
  return wrap;
}
