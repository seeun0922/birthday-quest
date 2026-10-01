// 선호 순위 매기기. 달력과 음식 코너가 같이 쓴다.
//
// 누른 순서대로 1·2·3순위가 붙고, 다시 누르면 빠지면서 뒤가 당겨진다.
// 뺀 뒤 항상 1..n 으로 다시 번호를 매기므로 순위에 구멍이 생길 수 없다.
import { rankLabel } from '../data/content.ko.js';
import { h } from './book.js';

const renumber = (prefs) => prefs
  .slice()
  .sort((a, b) => a.rank - b.rank)
  .map((p, i) => ({ ...p, rank: i + 1 }));

// field 는 값을 담는 칸 이름. 달력은 'date', 음식은 'key' 를 쓴다.
export function toggle(prefs, value, field = 'key') {
  const hit = prefs.find((p) => p[field] === value);
  if (hit) return renumber(prefs.filter((p) => p[field] !== value));
  return renumber([...prefs, { [field]: value, rank: prefs.length + 1 }]);
}

export const sorted = (prefs) => [...prefs].sort((a, b) => a.rank - b.rank);

// 순위를 매길 수 있는 카드 목록.
// cls 로 열 수를 지정한다 (기본은 폭에 맞춰 자동, 'opts-3' 이면 3열 고정).
export function rankList(options, prefs, onChange, cls = '') {
  return h('div', { class: `opts ${cls}`.trim() }, ...options.map((o) => {
    const hit = prefs.find((p) => p.key === o.key);
    return h('button', {
      class: `opt ${hit ? 'on' : ''}`.trim(),
      type: 'button',
      'aria-label': `${o.label}${hit ? ` ${hit.rank}순위` : ''}`,
      onClick: () => onChange(toggle(prefs, o.key)),
    },
      hit ? h('i', { class: 'opt-rank', text: rankLabel(hit.rank) }) : null,
      h('span', { class: 'opt-icon', text: o.icon }),
      h('span', { class: 'opt-label', text: o.label }),
      o.desc ? h('span', { class: 'opt-desc', text: o.desc }) : null,
    );
  }));
}

// "알아서 잘 해봐라" — 순위를 매기지 않고 넘어가는 선택지
export function anyOption(def, on, onClick) {
  return h('button', {
    class: `opt any ${on ? 'on' : ''}`.trim(),
    type: 'button',
    onClick,
  },
    h('span', { class: 'opt-icon', text: def.icon }),
    h('span', { class: 'opt-label', text: def.label }),
  );
}

// 고른 걸 한 줄짜리 칩으로
export function chips(prefs, label) {
  return h('div', { class: 'picked' }, ...sorted(prefs).map((p) => h('span', {
    class: 'picked-chip', text: `${rankLabel(p.rank)} ${label(p)}`,
  })));
}
