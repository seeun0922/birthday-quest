// 화면 위에 잠깐 뿌리는 픽셀 파티클. canvas 하나를 돌려 쓴다.
// 'xp'     초록 경험치 구슬 (SURVIVAL)
// 'fire'   불꽃 + 하트 (BIRTHDAY)
// 'random' ??? 픽셀 (RANDOM)
// 'firework' 완료 화면 불꽃놀이 (계속 터진다)

let cv = null, ctx = null, parts = [], raf = 0, forever = null;

function ensure() {
  if (cv) return;
  cv = document.getElementById('fx');
  if (!cv) return;
  ctx = cv.getContext('2d');
  resize();
  addEventListener('resize', resize);
}

function resize() {
  if (!cv) return;
  const r = Math.min(devicePixelRatio || 1, 2);
  // innerWidth 는 스크롤바를 포함한다. 캔버스가 실제로 차지한 크기를 쓴다.
  cv.width = Math.floor(cv.clientWidth * r);
  cv.height = Math.floor(cv.clientHeight * r);
  ctx.setTransform(r, 0, 0, r, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

// 캔버스 좌표계 크기 (파티클을 뿌릴 범위)
const W = () => (cv ? cv.clientWidth : innerWidth);
const H = () => (cv ? cv.clientHeight : innerHeight);

const rnd = (a, b) => a + Math.random() * (b - a);

// 종류마다 색·글리프·개수가 다르다
const HUE = {
  xp: [80, 130], fire: [-10, 45], random: [260, 310],
  heart: [330, 358], dust: [28, 52], spark: [38, 52],
};
const COUNT = { random: 14, dust: 10, heart: 16, spark: 10 };

function spawn(kind, x, y) {
  const n = COUNT[kind] || 22;
  const [h0, h1] = HUE[kind] || HUE.xp;
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2);
    const sp = kind === 'dust' ? rnd(25, 90) : rnd(40, 190);
    parts.push({
      kind, x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (kind === 'dust' ? rnd(10, 40) : rnd(40, 120)),
      life: rnd(0.7, 1.5), age: 0,
      size: kind === 'random' ? rnd(9, 15) : kind === 'heart' ? rnd(10, 16) : rnd(4, 9),
      glyph: kind === 'random' ? '?'
        : kind === 'heart' ? '♥'
          : kind === 'fire' && Math.random() < 0.35 ? '♥' : null,
      hue: rnd(h0, h1),
    });
  }
}

// 터뜨릴 자리를 안 주면 화면 가운데 위쪽
export function burst(kind, x, y) {
  ensure();
  if (!cv) return;
  spawn(kind, x === undefined ? W() / 2 : x, y === undefined ? H() * 0.42 : y);
  start();
}

// 완료 화면: 수평선 위로 계속 쏘아올린다
export function fireworks(on) {
  ensure();
  if (!cv) return;
  clearInterval(forever);
  forever = null;
  if (!on) return;
  const shoot = () => spawn('fire', rnd(W() * 0.15, W() * 0.85), rnd(H() * 0.18, H() * 0.45));
  shoot();
  forever = setInterval(shoot, 900);
  start();
}

function start() {
  if (raf) return;
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, cv.width, cv.height);

    for (const p of parts) {
      p.age += dt;
      p.vy += 330 * dt;              // 중력
      p.vx *= 1 - 1.4 * dt;          // 공기저항
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    parts = parts.filter((p) => p.age < p.life);

    for (const p of parts) {
      const t = 1 - p.age / p.life;
      ctx.globalAlpha = Math.max(0, t) * (p.kind === 'dust' ? 0.75 : 1);
      // 먼지는 채도를 낮춰야 연기처럼 보인다. 반짝임은 밝은 금색.
      const sat = p.kind === 'dust' ? 12 : p.kind === 'spark' ? 95 : 85;
      const lit = p.kind === 'xp' ? 55 : p.kind === 'dust' ? 82 : p.kind === 'spark' ? 70 : 62;
      ctx.fillStyle = `hsl(${p.hue} ${sat}% ${lit}%)`;
      if (p.glyph) {
        ctx.font = `${Math.round(p.size)}px Galmuri11, monospace`;
        ctx.fillText(p.glyph, p.x, p.y);
      } else {
        const s = Math.max(2, Math.round(p.size * t));
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      }
    }
    ctx.globalAlpha = 1;

    if (parts.length === 0 && !forever) { raf = 0; return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
