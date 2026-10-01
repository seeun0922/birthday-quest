// 결과를 양피지 그림 한 장으로 그린다.
//
// 요약 화면을 그대로 찍지 않는다. 완료 화면에 오면 그 화면은 이미 문서에서 사라졌고,
// DOM 을 캡처하는 방식은 글꼴이 늦게 붙으면 글자가 깨진다.
// 같은 내용을 캔버스에 다시 그리면 여백도 글꼴도 우리가 통제할 수 있다.
import { SUMMARY } from '../data/content.ko.js';
import { summaryRows } from '../data/plan.js';

const W = 720;          // 논리 폭 (실제 픽셀은 SCALE 배로 그린다)
const SCALE = 2;
const FRAME = 12;       // 나무 테두리 두께
const PAD = 26;         // 테두리 안쪽 여백

const C = {
  wood: '#6b4528', woodLite: '#95704a', woodDark: '#3d2614',
  paper: '#e8d3a5', paper2: '#dbc38d', edge: '#c0a469',
  ink: '#3b2a14', soft: '#6b5331',
};

// 줄 높이
const H = { title: 40, label: 24, value: 28, rule: 22, foot: 27 };

// 한 줄짜리 상자의 높이. 높이를 재는 쪽과 그리는 쪽이 같은 식을 써야 어긋나지 않는다.
const boxOf = (n) => 12 + H.label + n * H.value + 6;
const GAP = 10;

const font = (px) => `${px}px Galmuri11, monospace`;

// 한글은 단어 단위로 끊으면 어색하게 남는다. 글자 단위로 접는다.
function wrap(ctx, text, max) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const ch of para) {
      if (line && ctx.measureText(line + ch).width > max) { out.push(line); line = ch; }
      else line += ch;
    }
    out.push(line);
  }
  return out;
}

export async function resultImage() {
  // 글꼴이 붙기 전에 그리면 기본 글꼴로 찍힌다
  try { await document.fonts.ready; } catch { /* 지원 안 하면 그냥 그린다 */ }

  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d');

  const left = FRAME + PAD;
  const inner = W - left * 2;
  const textX = left + 44;              // 아이콘 자리를 비운다
  const textW = inner - 44;

  // ── 1) 접힌 줄을 먼저 구해서 전체 높이를 잰다 ──
  ctx.font = font(18);
  const blocks = summaryRows({ withLast: true })
    .map((r) => ({ ...r, out: r.lines.flatMap((l) => wrap(ctx, l, textW)) }));
  ctx.font = font(14);
  const foot = wrap(ctx, SUMMARY.punch, inner);

  let height = FRAME + PAD + H.title + H.rule;
  for (const b of blocks) height += boxOf(b.out.length) + GAP;
  height += H.rule + foot.length * H.foot + PAD + FRAME;

  cv.width = W * SCALE;
  cv.height = Math.round(height) * SCALE;
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.textBaseline = 'alphabetic';

  // ── 2) 바탕과 나무 테두리 ──
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, height);
  // 양피지 느낌의 가로 결
  ctx.fillStyle = C.paper2;
  for (let y = FRAME; y < height - FRAME; y += 8) ctx.fillRect(FRAME, y, W - FRAME * 2, 1);

  ctx.fillStyle = C.wood;
  ctx.fillRect(0, 0, W, FRAME);
  ctx.fillRect(0, height - FRAME, W, FRAME);
  ctx.fillRect(0, 0, FRAME, height);
  ctx.fillRect(W - FRAME, 0, FRAME, height);
  // 입체감 — 위/왼쪽은 밝게, 아래/오른쪽은 어둡게
  ctx.fillStyle = C.woodLite;
  ctx.fillRect(0, 0, W, 3); ctx.fillRect(0, 0, 3, height);
  ctx.fillStyle = C.woodDark;
  ctx.fillRect(0, height - 3, W, 3); ctx.fillRect(W - 3, 0, 3, height);

  // ── 3) 내용 ──
  let y = FRAME + PAD + 26;

  ctx.fillStyle = C.ink;
  ctx.font = font(24);
  ctx.textAlign = 'center';
  ctx.fillText(SUMMARY.title, W / 2, y);
  y += H.title - 26 + H.rule;

  ctx.textAlign = 'left';
  rule(ctx, left, y - 14, inner);

  for (const b of blocks) {
    const boxTop = y;
    const boxH = boxOf(b.out.length);

    ctx.fillStyle = 'rgba(255,255,255,.34)';
    ctx.fillRect(left, boxTop, inner, boxH);
    ctx.strokeStyle = C.edge;
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 1, boxTop + 1, inner - 2, boxH - 2);

    y += 12 + 16;
    ctx.font = font(20);
    ctx.fillStyle = C.ink;
    ctx.fillText(b.icon, left + 12, y + 2);

    ctx.font = font(13);
    ctx.fillStyle = C.soft;
    ctx.fillText(b.label, textX, y);
    y += H.label - 16;

    ctx.font = font(18);
    ctx.fillStyle = C.ink;
    for (const line of b.out) { y += 20; ctx.fillText(line, textX, y); y += H.value - 20; }

    y = boxTop + boxH + GAP;
  }

  y += H.rule - 8;
  rule(ctx, left, y - 14, inner);

  ctx.font = font(14);
  ctx.fillStyle = C.soft;
  ctx.textAlign = 'center';
  for (const line of foot) { y += 18; ctx.fillText(line, W / 2, y); y += H.foot - 18; }

  return new Promise((resolve) => cv.toBlob((b) => resolve(b), 'image/png'));
}

function rule(ctx, x, y, w) {
  ctx.fillStyle = C.edge;
  ctx.fillRect(x, y, w, 2);
}
