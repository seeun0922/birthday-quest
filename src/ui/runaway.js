// 누를 수 없는 버튼. 다가가면 도망간다.
//
// 지켜야 할 것 두 가지:
//   1. 절대 화면 밖으로 나가지 않는다
//   2. 절대 스크롤을 만들지 않는다
// 그래서 버튼은 #roam (position:fixed 레이어) 안에 살고, 좌표를 뷰포트 안으로 묶는다.
// fixed 는 transform 이 걸린 조상 안에서 깨지기 때문에 본문 바깥에 둬야 한다.
import { h } from './book.js';
import { burst } from './particles.js';

const MARGIN = 10;          // 화면 가장자리에서 최소한 띄울 거리
const CLEAR = 14;           // YES 버튼 둘레로 비워둘 거리

// 좌표를 [MARGIN, max - MARGIN] 안으로 묶는다
const clamp = (v, max) => Math.min(Math.max(MARGIN, v), Math.max(MARGIN, max - MARGIN));

const layer = () => document.getElementById('roam');

export function clearRoam() {
  const el = layer();
  if (el) el.replaceChildren();
}

// avoid()  겹치면 안 되는 요소를 돌려주는 함수 (YES 버튼)
// onTry()  도망칠 때마다 부른다 (몇 번째 시도인지 넘겨준다).
//          문자열을 돌려주면 도망친 버튼 옆에 말풍선으로 띄운다.
export function runaway({ label, anchor, avoid, onTry }) {
  const el = layer();
  if (!el) return null;

  const btn = h('button', {
    class: 'btn roam-btn',
    type: 'button',
    'aria-label': `${label} — 누를 수 없다`,
  }, label);
  // 놀리는 말은 버튼을 따라다닌다. 화면 위쪽 말풍선은 건드리지 않는다.
  const taunt = h('div', { class: 'roam-say', role: 'status' });
  el.append(btn, taunt);

  let tries = 0;
  let placed = false;

  // 처음에는 anchor 자리에 얌전히 앉아 있는다
  const sit = () => {
    if (placed) return;
    const a = anchor();
    if (!a || a.width === 0) return;
    btn.style.width = `${Math.round(a.width)}px`;
    move(a.left, a.top, false);
  };

  const move = (x, y, bounce = true) => {
    btn.style.left = `${Math.round(x)}px`;
    btn.style.top = `${Math.round(y)}px`;
    if (!bounce) return;
    btn.classList.remove('bounce');
    void btn.offsetWidth;            // 재생을 다시 시작시키려면 리플로우가 필요하다
    btn.classList.add('bounce');
  };

  let lastFlee = 0;

  const flee = () => {
    // 터치에서는 pointerenter 와 pointerdown 이 같이 들어온다. 한 번으로 친다.
    const now = performance.now();
    if (now - lastFlee < 180) return;
    lastFlee = now;

    const was = btn.getBoundingClientRect();
    const cx = was.left + was.width / 2, cy = was.top + was.height / 2;
    burst('dust', cx, cy);          // 💨 떠난 자리에 연기
    burst('spark', cx, cy);         // ✨ 금색 픽셀 반짝임

    // 처음 도망칠 때 제 몸집으로 줄인다.
    // 자리에 앉아 있을 때는 YES 와 같은 전체폭이라, 그대로면 좌우로 움직일 틈이 없다.
    btn.style.width = '';
    const r = btn.getBoundingClientRect();

    const maxX = Math.max(MARGIN, innerWidth - r.width - MARGIN);
    const maxY = Math.max(MARGIN, innerHeight - r.height - MARGIN);
    const safe = avoid ? avoid() : null;

    // 위로는 달아나지 않는다. 화면 꼭대기까지 올라가면 폰에서 손이 닿지 않고,
    // 말풍선과 YES 를 가려서 정작 눌러야 할 것이 눌리지 않는다.
    // 그래서 YES 아래쪽 띠 안에서만 돌아다닌다.
    const minY = safe ? Math.min(safe.bottom + CLEAR, maxY) : MARGIN;

    let x = 0, y = 0;
    // 가로로는 YES 와 겹칠 수 있으니, 겹치면 몇 번 다시 뽑는다
    for (let i = 0; i < 24; i++) {
      x = MARGIN + Math.random() * (maxX - MARGIN);
      y = minY + Math.random() * (maxY - minY);
      if (!safe || !overlaps(x, y, r.width, r.height, safe)) break;
    }

    placed = true;
    btn.classList.add('fled');
    // 누를 때마다 크기가 조금씩 변한다 (단, 너무 작아지지는 않게)
    btn.style.transform = `scale(${(0.82 + Math.random() * 0.26).toFixed(2)})`;
    move(x, y);

    tries += 1;
    const line = onTry ? onTry(tries) : null;
    if (line) show(line, { left: x, top: y, width: r.width, height: r.height });
  };

  // 말풍선을 버튼이 "도착할" 자리 바로 위에 띄운다. 위가 좁으면 아래로 내린다.
  //
  // 버튼의 현재 좌표를 재면 안 된다 — left/top 에 트랜지션이 걸려 있어서
  // 방금 옮긴 직후에는 아직 떠나기 전 자리를 돌려준다. 목적지를 직접 받는다.
  // opacity 로만 숨기므로 꺼져 있어도 크기를 잴 수 있다 — 한 프레임 깜빡이지 않는다.
  const show = (text, b) => {
    taunt.textContent = text;
    const t = taunt.getBoundingClientRect();

    const x = clamp(b.left + b.width / 2 - t.width / 2, innerWidth - t.width);
    const above = b.top - t.height - 8;
    const y = clamp(above < MARGIN ? b.top + b.height + 8 : above, innerHeight - t.height);

    taunt.style.left = `${Math.round(x)}px`;
    taunt.style.top = `${Math.round(y)}px`;
    taunt.classList.add('on');

    clearTimeout(show._t);
    show._t = setTimeout(() => taunt.classList.remove('on'), 1900);
  };

  // 데스크톱은 가까이 오기만 해도, 모바일은 건드리는 순간 도망간다
  btn.addEventListener('pointerenter', flee);
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); flee(); });
  btn.addEventListener('click', (e) => { e.preventDefault(); flee(); });
  // 키보드로 접근해도 똑같이 반응한다 (누를 수 있는 것처럼 보이면 안 된다)
  btn.addEventListener('focus', flee);

  sit();
  requestAnimationFrame(sit);        // 글꼴이 늦게 붙어 자리가 밀리는 경우 대비
  addEventListener('resize', onResize);

  // 글꼴·그림·영상은 늦게 도착해서 본문 높이를 바꾼다. 그때 다시 앉지 않으면
  // 버튼이 옛 자리에 남아 YES 위에 겹친다. 아직 도망가기 전에만 따라다닌다.
  let watch = null;
  if (typeof ResizeObserver === 'function') {
    watch = new ResizeObserver(() => {
      if (!btn.isConnected || placed) { watch.disconnect(); return; }
      sit();
    });
    watch.observe(document.body);
  }

  function onResize() {
    if (!layer() || !btn.isConnected) { removeEventListener('resize', onResize); return; }
    // 말풍선은 버튼에 붙어 있으므로, 자리를 다시 잡는 동안은 치운다
    taunt.classList.remove('on');
    if (!placed) { placed = false; sit(); return; }
    // 창이 줄어 버튼이 화면 밖으로 나가면 도로 끌어들인다
    const r = btn.getBoundingClientRect();
    const x = Math.min(Math.max(MARGIN, r.left), Math.max(MARGIN, innerWidth - r.width - MARGIN));
    const y = Math.min(Math.max(MARGIN, r.top), Math.max(MARGIN, innerHeight - r.height - MARGIN));
    move(x, y, false);
  }

  return btn;
}

function overlaps(x, y, w, h, box) {
  return x < box.right + CLEAR && x + w > box.left - CLEAR
    && y < box.bottom + CLEAR && y + h > box.top - CLEAR;
}
