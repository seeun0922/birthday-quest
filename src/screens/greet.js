// 2. 인사 — "순순히 답해라 이경"
//
// NO 는 누를 수 없다. 다가가면 도망간다.
// 도망 로직은 ui/runaway.js 에 있고, NO 는 어떤 값으로도 저장되지 않는다.
import { GREET } from '../data/content.ko.js';
import { h, btn } from '../ui/book.js';
import { runaway } from '../ui/runaway.js';
import { burst } from '../ui/particles.js';

export const step = null;
export const back = ['intro', {}];

export function render({ go }) {
  // 이 줄은 끝까지 바뀌지 않는다. 놀리는 말은 도망친 NO 옆에 따로 뜬다.
  const line = h('p', { class: 'say-line', text: GREET.line });
  const reply = h('div', {});           // YES 를 누르면 여기에 한 줄이 더 붙는다

  const yes = btn(GREET.yes, { primary: true, cls: 'yes', onClick: accept });
  // NO 가 떠난 자리를 비워둬서, 도망쳐도 YES 가 들썩이지 않는다
  const slot = h('div', { class: 'no-slot' });

  runaway({
    label: GREET.no,
    anchor: () => slot.getBoundingClientRect(),
    avoid: () => yes.getBoundingClientRect(),
    // 돌려준 문구를 runaway 가 버튼 옆에 띄운다. 끝까지 가면 처음으로 돌아가 계속 돈다.
    onTry: (n) => GREET.taunts[(n - 1) % GREET.taunts.length],
  });

  function accept() {
    const r = yes.getBoundingClientRect();
    burst('heart', r.left + r.width / 2, r.top);
    yes.classList.add('glow');
    yes.disabled = true;
    reply.replaceChildren(h('p', { class: 'say-line', text: GREET.accept }));
    setTimeout(() => go('quest'), 950);
  }

  return h('div', {},
    h('div', { class: 'say' },
      h('span', { class: 'say-face', text: '🎂' }),
      h('div', { class: 'say-bubble' }, line, reply),
    ),
    clipFrame(),
    h('div', { class: 'yesno' }, yes, slot),
  );
}

// 말풍선 아래에 끼워 넣은 짧은 영상 (눈 피하는 그 짤).
// GIF 대신 소리 없는 mp4 를 쓴다 — 보이는 건 같은데 용량이 30분의 1이다.
function clipFrame() {
  const clip = h('video', {
    class: 'clip',
    src: 'assets/clip/lk.mp4',
    loop: true,
    playsinline: true,
    'aria-hidden': 'true',
  });
  // muted 는 속성만 달면 브라우저가 자동재생을 막는다. 프로퍼티로 꺼야 통한다.
  clip.muted = true;
  clip.autoplay = true;
  // 자동재생이 막히는 환경이 있다. 조용히 넘어가고 첫 프레임만 보여준다.
  const p = clip.play();
  if (p && p.catch) p.catch(() => {});

  const frame = h('div', { class: 'clip-frame' }, clip);
  // 영상 파일이 없으면(공개 저장소에서는 개인 영상을 뺀다) 빈 액자만 남는다.
  // 그럴 바에는 액자째 치우는 편이 낫다.
  clip.addEventListener('error', () => frame.remove());
  return frame;
}
