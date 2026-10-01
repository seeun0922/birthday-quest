// 배경. 외부 이미지 없이 CSS 그라데이션 + 생성한 네모로 밤바다를 만든다.
//
// 별·구름 위치는 매번 바뀌면 산만하므로 고정 시드로 뽑는다.
// 본문(양피지 책)이 이 위에 올라오므로, 화려함보다 "덜 시끄러운" 쪽을 택한다.
import { h } from './book.js';

// 작은 결정론적 난수 (mulberry32)
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 구름 한 덩이의 모양. 한 줄이 [칸x, 칸너비] 이고, 위에서 아래로 쌓인다.
// 줄마다 시작과 너비가 어긋나야 마인크래프트 구름 같은 계단이 나온다.
const CLOUDS = [
  [[2, 4], [0, 8], [1, 5]],
  [[1, 3], [0, 7], [2, 4]],
  [[3, 3], [1, 6], [0, 9], [2, 4]],
  [[0, 5], [1, 6], [3, 3]],
  [[2, 5], [0, 9], [1, 6], [3, 3]],
];

// 능선 위 창불빛. [가로%, 아래에서 띄울 px] — 봉우리가 높은 자리에만 놓는다.
const WINDOWS = [[16, 6], [18, 11], [19, 6], [57, 8], [59, 13], [78, 7], [80, 12], [81, 6]];

export function buildScene(root) {
  const r = rng(1024);

  // ── 하늘 ────────────────────────────────
  const sky = h('div', { class: 'sky' });

  for (let i = 0; i < 80; i++) {
    const s = r() < 0.18 ? 3 : 2;
    sky.appendChild(h('i', {
      class: 'star',
      style: {
        left: `${(r() * 100).toFixed(2)}%`, top: `${(r() * 62).toFixed(2)}%`,
        width: `${s}px`, height: `${s}px`,
        animationDelay: `${(r() * 6).toFixed(2)}s`,
        opacity: String((0.35 + r() * 0.6).toFixed(2)),
      },
    }));
  }

  // 십자로 반짝이는 큰 별. 몇 개만 둔다 — 많으면 하늘이 시끄럽다.
  for (let i = 0; i < 9; i++) {
    const s = 7 + Math.round(r() * 6);
    sky.appendChild(h('i', {
      class: 'sx',
      style: {
        left: `${(2 + r() * 92).toFixed(2)}%`, top: `${(r() * 50).toFixed(2)}%`,
        width: `${s}px`, height: `${s}px`,
        animationDelay: `${(r() * 5).toFixed(2)}s`,
      },
    }));
  }

  for (const cloud of CLOUDS) sky.appendChild(makeCloud(cloud, r));

  // ── 바다 ────────────────────────────────
  const sea = h('div', { class: 'sea' });

  // 달빛 기둥. 위는 밝고 넓게, 아래로 갈수록 흐려지고 좁아진다.
  const path = h('div', { class: 'moon-path' });
  for (let i = 0; i < 20; i++) {
    const w = (26 - i * 0.8) * (0.45 + r() * 0.75);
    path.appendChild(h('i', {
      style: {
        top: `${(i * 5).toFixed(1)}%`,
        width: `${Math.max(4, w).toFixed(0)}px`,
        marginLeft: `${(-w / 2 + (r() * 9 - 4.5)).toFixed(0)}px`,
        opacity: String(Math.max(0.05, 0.5 - i * 0.022).toFixed(2)),
        animationDelay: `${(r() * 3).toFixed(2)}s`,
      },
    }));
  }
  sea.appendChild(path);

  for (let i = 0; i < 10; i++) {
    sea.appendChild(h('i', {
      class: 'wave',
      style: {
        top: `${5 + i * 9.5}%`,
        animationDelay: `${(i * 0.7).toFixed(1)}s`,
        animationDuration: `${(8 + r() * 5).toFixed(1)}s`,
        opacity: String((0.5 - i * 0.04).toFixed(2)),
      },
    }));
  }

  // 수평선 양옆 랜턴 불빛과, 그 아래 물에 비친 금빛
  const lamps = [6, 15, 84, 93];
  const lanterns = h('div', { class: 'lanterns' },
    ...lamps.map((x, i) => h('i', { class: 'lantern', style: { left: `${x}%`, animationDelay: `${i * 0.5}s` } })),
  );
  lamps.forEach((x, i) => {
    for (let n = 0; n < 5; n++) {
      sea.appendChild(h('i', {
        class: 'glint',
        style: {
          left: `calc(${x}% + ${(r() * 5 - 2).toFixed(0)}px)`,
          top: `${(2 + n * 3.4).toFixed(1)}%`,
          height: `${(2 + r() * 2).toFixed(0)}px`,
          opacity: String((0.5 - n * 0.09).toFixed(2)),
          animationDelay: `${(i * 0.4 + r()).toFixed(2)}s`,
        },
      }));
    }
  });

  const wins = h('div', { class: 'wins' },
    ...WINDOWS.map(([x, up], i) => h('i', {
      class: 'win',
      style: { left: `${x}%`, bottom: `${up}px`, animationDelay: `${(i * 0.37).toFixed(2)}s` },
    })),
  );

  const moon = h('div', { class: 'moon' },
    h('i', { class: 'a' }), h('i', { class: 'b' }), h('i', { class: 'c' }),
  );

  // 바탕 그림 두 장을 겹쳐 두고 .festa 로 갈아 끼운다. 그 위에 덮개, 그 위에 .scene.
  // .scene 안의 달·구름·섬·물결은 CSS 에서 꺼져 있다 (그림이 이미 그려둔 것들이라).
  // 별과 십자반짝임만 살아남아 그림 위에서 반짝인다.
  root.append(
    h('div', { class: 'photo night' }),
    h('div', { class: 'photo festa-photo' }),
    h('div', { class: 'scrim' }),
  );

  root.appendChild(h('div', { class: 'scene' },
    sky,
    h('div', { class: 'halo' }),
    moon,
    h('div', { class: 'horizon' }),
    h('div', { class: 'hills' }),
    wins,
    sea,
    lanterns,
    makeFesta(r),
  ));
}

// ── 축제 (계획이 다 세워진 뒤) ────────────
// 늘 깔려 있지만 투명하다. #bg 에 .festa 가 붙으면 서서히 떠오른다.
// 화면마다 배경을 새로 짓지 않으므로 전환이 끊기지 않는다.
function makeFesta(r) {
  const g = h('div', { class: 'festa-layer' });

  // 폭죽 한 송이 = 네모 하나. 부채살은 CSS 그라데이션이 긋는다 (아래 .fw 참고).
  // [가로%, 세로%, 지름px, 색]
  const BURSTS = [
    [61, 17, 150, 'pink'], [78, 27, 116, 'gold'], [49, 30, 104, 'gold'],
    [88, 18, 92, 'violet'], [68, 38, 84, 'pink'],
  ];
  for (const [x, y, size, hue] of BURSTS) {
    g.appendChild(h('i', {
      class: `fw ${hue}`,
      style: {
        left: `${x}%`, top: `${y}%`,
        width: `${size}px`, height: `${size}px`,
        marginLeft: `${-size / 2}px`, marginTop: `${-size / 2}px`,
        animationDelay: `-${(r() * 6).toFixed(1)}s`,
        animationDuration: `${(5.5 + r() * 2.5).toFixed(1)}s`,
      },
    }));
  }

  // 물가를 따라 걸린 깃발 가랜드
  const garland = h('div', { class: 'garland' }, h('i', { class: 'line' }));
  for (let i = 0; i < 26; i++) {
    garland.appendChild(h('b', {
      style: { left: `${(i * 3.9 + 1).toFixed(1)}%`, animationDelay: `${(i * 0.21).toFixed(2)}s` },
    }));
  }
  g.appendChild(garland);

  return g;
}

// 줄 목록을 받아 계단형 구름 한 덩이를 만든다.
// 맨 윗줄은 달빛을 받아 밝게, 맨 아랫줄은 어둡게 둬서 두께가 보이게 한다.
function makeCloud(shape, r) {
  const u = 5 + Math.round(r() * 5);          // 한 칸의 크기(px)
  const pink = r() < 0.4;                      // 몇 덩이는 노을빛을 머금는다
  const c = h('div', {
    class: 'cloud',
    style: {
      top: `${(6 + r() * 46).toFixed(1)}%`,
      animationDuration: `${(110 + r() * 90).toFixed(0)}s`,
      animationDelay: `-${(r() * 110).toFixed(0)}s`,
      opacity: String((0.4 + r() * 0.35).toFixed(2)),
    },
  });

  shape.forEach(([cx, cw], n) => {
    const top = n === 0;
    c.appendChild(h('i', {
      class: top ? 'top' : (pink && n === 1 ? 'blush' : ''),
      style: { left: `${cx * u}px`, top: `${n * u}px`, width: `${cw * u}px`, height: `${u}px` },
    }));
  });
  return c;
}
