// 상단 진행 표시: ●━━━━○━━━━○━━━━○━━━━○
import { STEPS, QUEST_TITLE } from '../data/content.ko.js';
import { h } from './book.js';

// current: STEPS 의 key. null 이면 표시줄을 숨긴다.
export function progress(current) {
  const i = STEPS.findIndex((s) => s.key === current);
  if (i < 0) return h('div', { class: 'progress hidden' });

  const dots = [];
  STEPS.forEach((s, n) => {
    if (n > 0) dots.push(h('i', { class: `prog-bar ${n <= i ? 'on' : ''}`.trim() }));
    const state = n < i ? 'past' : n === i ? 'now' : 'next';
    dots.push(h('b', { class: `prog-dot ${state}`, text: n === i ? '●' : n < i ? '●' : '○' }));
  });

  const s = STEPS[i];
  return h('div', { class: 'progress' },
    h('div', { class: 'prog-head', text: QUEST_TITLE }),
    h('div', { class: 'prog-track' }, ...dots),
    h('div', { class: 'prog-label', text: `${s.icon} ${s.label}` }),
  );
}
