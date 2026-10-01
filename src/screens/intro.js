// 1. 타이틀
import { INTRO } from '../data/content.ko.js';
import { h, btn } from '../ui/book.js';
import { burst } from '../ui/particles.js';
import { kick } from '../ui/music.js';

export const step = null;
export const back = null;

export function render({ go }) {
  const start = btn(INTRO.button, { primary: true, cls: 'start', onClick: begin });

  function begin() {
    // 노래는 여기서 시작한다. 브라우저가 소리를 허락하는 첫 순간이다.
    kick();
    const r = start.getBoundingClientRect();
    burst('heart', r.left + r.width / 2, r.top);
    start.disabled = true;
    // 하트가 올라가는 걸 잠깐 보여준 뒤 넘어간다
    document.getElementById('app').classList.add('fading');
    setTimeout(() => {
      document.getElementById('app').classList.remove('fading');
      go('greet');
    }, 420);
  }

  return h('div', { class: 'centered' },
    h('div', { class: 'hero' },
      h('div', { class: 'hero-cake', text: '🎂' }),
      h('h1', { class: 'hero-title', text: INTRO.title }),
      h('p', { class: 'hero-sub', text: INTRO.sub }),
    ),
    // 버튼 위에 뜨는 반짝임 (hover 때만 보인다)
    h('div', { class: 'start-wrap' },
      start,
      h('i', { class: 'spark s1', text: '✨' }),
      h('i', { class: 'spark s2', text: '✨' }),
      h('i', { class: 'spark s3', text: '✨' }),
    ),
  );
}
