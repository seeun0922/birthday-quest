// 3. Birthday Quest 안내
import { QUEST } from '../data/content.ko.js';
import { h, book, p, btn } from '../ui/book.js';

export const step = null;
export const back = ['greet', {}];

export function render({ go }) {
  return h('div', {},
    book({
      title: QUEST.title,
      kids: [
        ...QUEST.body.map((t) => p(t)),
        h('div', { class: 'quest-list' },
          ...QUEST.list.map((q, i) => h('div', { class: 'quest-item' },
            h('b', { text: q.icon }),
            h('span', { text: q.text }),
            h('span', { class: 'quest-no', text: `${i + 1}/4` }),
          )),
        ),
      ],
    }),
    btn(QUEST.button, { primary: true, onClick: () => go('style') }),
  );
}
