// 9. 완료. 결과를 실제로 보내는 곳이기도 하다.
//
// 보내는 것은 그림 한 장이다. 글(summaryText)은 그림을 못 만들거나
// 파일 공유가 막힌 환경을 위한 대비책으로 남겨둔다.
import { DONE, SHARE } from '../data/content.ko.js';
import { summaryText, shareText, chip, reset, birthdayPlan } from '../data/plan.js';
import { h, book, p, btn } from '../ui/book.js';
import { xpBar } from '../ui/xp.js';
import { fireworks } from '../ui/particles.js';
import { resultImage } from '../ui/card.js';

export const step = 'done';
export const back = ['summary', {}];
export const festa = true;

const FILE = '이경-birthday-quest.png';

export function render({ go }) {
  const shotSlot = h('div', { class: 'shot' });
  const manualSlot = h('div', {});

  requestAnimationFrame(() => fireworks(true));

  // 그림은 한 번만 만들어 두고 미리보기와 보내기가 같이 쓴다.
  // 모바일에서는 이 미리보기를 길게 누르는 것이 가장 확실한 저장 방법이다.
  let url = '';
  const made = resultImage().then((blob) => {
    if (!blob) return null;
    url = URL.createObjectURL(blob);
    shotSlot.replaceChildren(
      h('img', { class: 'shot-img', src: url, alt: '생일 계획 결과 이미지' }),
      p(SHARE.imageHint, 'line small center'),
    );
    return blob;
  }).catch(() => null);

  const send = async () => {
    const text = summaryText();
    const blob = await made;

    if (blob) {
      const file = new File([blob], FILE, { type: 'image/png' });
      // canShare 로 먼저 물어봐야 한다. 파일 공유를 지원하지 않는 브라우저가 많다.
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          return chip(SHARE.shared);
        } catch (e) {
          if (e && e.name === 'AbortError') return;
          // 공유가 실패하면 아래 글 보내기로 흘러간다
        }
      }
    } else {
      chip(SHARE.imageFail);
    }

    const r = await shareText(text);
    if (r === 'shared') return chip(SHARE.shared);
    if (r === 'copied') return chip(SHARE.copied);
    if (r === 'cancelled') return;
    manual(manualSlot, text);                 // 공유도 복사도 막힌 환경
  };

  // 아티팩트는 샌드박스 안에서 돌아가므로 <a download> 가 그냥 막힌다.
  // 파일을 건네주는 공식 통로는 downloads 기능 하나뿐이고, 그마저 없으면 캡처를 부탁한다.
  const download = async () => {
    const blob = await made;
    if (!blob) return chip(SHARE.imageFail);

    const c = window.claude;
    const dl = c && typeof c.use === 'function' ? await c.use('downloads') : null;
    if (!dl) return chip(SHARE.noDownload);

    try {
      await dl.save({ filename: FILE, data: blob });
      chip(SHARE.savedImage);
    } catch (e) {
      if (e && e.code === 'declined') return;      // 본인이 취소한 것은 알릴 일이 아니다
      chip(SHARE.noDownload);
    }
  };

  const home = () => {
    fireworks(false);
    if (url) URL.revokeObjectURL(url);
    reset();
    go('intro');
  };

  return h('div', {},
    h('h1', { class: 'done-title', text: DONE.title }),
    book({
      title: DONE.sub,
      kids: [
        p(DONE.body, 'line big center'),
        // 여기까지 오면 진행 표시의 마지막 점도 켜져 있다. 막대도 같이 꽉 채운다.
        xpBar({ tone: birthdayPlan.birthdayStyle || 'survival', extra: 1 }),
        shotSlot,
        manualSlot,
      ],
    }),
    btn(DONE.send, { primary: true, onClick: send }),
    btn(DONE.save, { onClick: download }),
    btn(DONE.restart, { onClick: home }),
  );
}

function manual(slot, text) {
  const ta = h('textarea', { class: 'write', rows: 8, readonly: true });
  ta.value = text;
  slot.replaceChildren(p(SHARE.manual, 'line small'), ta);
  setTimeout(() => { ta.focus(); ta.select(); }, 30);
}
