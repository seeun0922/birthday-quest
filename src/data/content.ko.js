// 화면에 나오는 모든 한국어 문구. 로직은 screens/ 에 있고, 여기 있는 건 전부 데이터다.
// 말투를 고치고 싶으면 이 파일만 만지면 된다.

export const BIRTHDAY = { y: 2026, m: 10, d: 24 };

// ✨ 로 강조할, 내가 미리 생각해둔 날짜. 선택을 제한하지는 않는다.
// 생일(10/24) 앞뒤로 흩어져 있다 — 시험기간을 피한 주말 위주.
export const CANDIDATE_DATES = [
  '2026-10-06', '2026-10-07',
  '2026-10-13',
  '2026-11-05', '2026-11-06',
  '2026-11-12', '2026-11-13',
];

// 달력에 펼쳐 보여줄 달
export const CAL_MONTHS = [{ y: 2026, m: 10 }, { y: 2026, m: 11 }];

// ── 진행 표시 ─────────────────────────────
export const STEPS = [
  { key: 'style', icon: '🎂', label: '생일 당일' },
  { key: 'date', icon: '📅', label: '날짜' },
  { key: 'food', icon: '🍴', label: '음식' },
  { key: 'gift', icon: '🎁', label: '선물' },
  { key: 'done', icon: '❤️', label: '완료' },
];

export const QUEST_TITLE = '🎂 BIRTHDAY QUEST';

// ── 1. 타이틀 ─────────────────────────────
export const INTRO = {
  title: 'HAPPY\nBIRTHDAY',
  sub: '해피이경데이 🎉',
  button: '🎂 START QUEST ▶',
};

// ── 2. 인사 ───────────────────────────────
export const GREET = {
  line: '"앞으로 물어보는 것들에 대해 눈 피하지말고 순순히 답해라 이경.."',
  yes: 'YES ❤️',
  no: 'NO 💀',
  // NO 를 누르려 할 때마다 한 줄씩, 도망친 버튼 옆에 뜬다.
  // 끝까지 가면 처음으로 돌아가 계속 돈다.
  taunts: [
    '어딜 누르는 것이더냐 😏',
    '오소이',
    '느려',
    '에베베',
    '얼씨구?',
    '누를 수 있으면 눌러보거라~',
    '포기해라 이경.',
    '짐을 거부할 수는 없도다~',
    '거부는 거부한다.',
    '거기서 뭐함?',
    '아직도 포기 안 했느냐? 끈질기도다.',
    '헛수고다 이경.',
    '혼쭐?',
    '완전히 메롱이다~',
  ],
  accept: '"아암.. 그래야지~"',
};

// ── 3. Birthday Quest 안내 ────────────────
export const QUEST = {
  title: '🎂 이경의 생일이 다가온다~',
  body: [
    '생일이 시험기간과 겹쳐버렸다...',
    '과연 이경은 생일을 어떻게 보내고 싶을까?',
    '몇 가지 질문에 답해주면\n그 의견을 참고해서 생일을 준비하도록 하마!',
  ],
  list: [
    { icon: '🎂', text: '생일 당일은 어떻게?' },
    { icon: '📅', text: '제대로 축하할 날은 언제?' },
    { icon: '🍴', text: '먹고 싶은 음식은?' },
    { icon: '🎁', text: '갖고 싶은 것은?' },
  ],
  button: '퀘스트 시작하기 ▶',
};

// ── 4. 생일 당일 플레이 스타일 ─────────────
export const STYLE = {
  say: '일단 가장 중요한 것부터 물어보도록 하지.',
  title: '🎂 생일 당일의 플레이 스타일을 선택하시오.',
  sub: '10월 24일은 시험기간이다.\n\n그렇다면 생일 당일에는\n어떻게 보내고 싶은가?',
  note: '※ 이건 어디까지나 의견 수렴이다.\n네가 고른다고 무조건 그렇게 되는 것은 아님 ㅎㅅㅎ',
  options: [
    {
      key: 'survival',
      tone: 'survival',
      chip: '🟩 SURVIVAL MODE',
      name: '시험기간 생존 모드',
      tagline: '📚 시험기간이니까 체력 보존이 중요함',
      lines: ['🎂 생일 당일에는 간단하게 축하하고', '📚 시험 끝난 뒤 제대로 놀기'],
      stars: '★★☆☆☆',
      button: '🛡️ 생존을 선택한다',
      particle: 'xp',
      reply: {
        lines: ['"오호..."', '"현명한 선택이었도다~~ 복복"'],
        gain: '📚 생존 모드 선호도를 기록했다!',
      },
    },
    {
      key: 'birthday',
      tone: 'birthday',
      chip: '🟥 BIRTHDAY MODE',
      name: '생일 풀파워 모드',
      tagline: '🎉 시험기간? 그런 건 모르겠고 오늘은 생일이다.',
      lines: ['🎂 생일 당일 제대로 축하하기', '🍴 맛있는 거 먹기', '🎁 생일답게 놀기'],
      stars: '★★★★★',
      button: '🔥 생일을 불태운다',
      particle: 'fire',
      reply: {
        lines: ['"오..."', '"시험기간이어도 생일은 생일이다 이건가?"'],
        gain: '🔥 풀파워 모드 선호도를 기록했다!',
      },
    },
    {
      key: 'random',
      tone: 'random',
      chip: '🟪 RANDOM MODE',
      name: '운명에 맡기기',
      tagline: '🎲 알아서 잘 해봐라',
      lines: ['"나는 아무거나 좋아."', '"네가 알아서 계획해줘."'],
      stars: '?????',
      button: '🎲 운명을 맡긴다',
      particle: 'random',
      reply: {
        lines: ['"흠냐... 확실하느냐?"', '"확실하지 않아도 돌이킬 수 없도다~"'],
        gain: '🎲 생일의 운명이 당신에게 맡겨졌습니다.',
      },
    },
  ],
};

// ── 5. 날짜 ───────────────────────────────
export const DATE = {
  say: '자, 그럼 이제 진짜 중요한 걸 물어보도록 하지.',
  title: '📅 제대로 축하할 날은 언제가 좋을까?',
  sub: '10월 24일은 시험기간이니까\n제대로 생일파티를 한다면 언제가 좋을지 골라줘!',
  howto: '가능한 날짜를 선호하는 순서대로 눌러줘.\n\n내가 생각해둔 날짜도 있지만\n꼭 거기서 고를 필요는 없다!',
  calNote: '✨ 짐이 미리 생각해둔 날은 반짝이고 있도다~\n연속되어 빛나는 날은 외박의 가능성이 높을지도..~?\n\n하지만 꼭 이 날짜일 필요는 없다.\n네가 진짜 편하고 좋은 날짜를 골라줘.',
  noteLabel: '💬 날짜에 대해 하고 싶은 말이 있다면?',
  notePlaceholder: '예) 평일이면 저녁만 가능해!\n예) 13일이 제일 좋아!\n예) 주말이면 좋을 것 같아!',
  empty: '하루라도 골라줘야 다음으로 넘어갈 수 있다.',
  button: '❤️ 확인했도다~',
};

export const RANKS = ['🥇', '🥈', '🥉'];
export const rankLabel = (n) => (RANKS[n - 1] || `${n}순위`);

// ── 6. 음식 ───────────────────────────────
// 두 가지를 따로 묻는다. "뭘" 과 "어떻게" 는 다른 질문이다.
export const FOOD = {
  say: ['"좋아. 날짜는 어느 정도 알겠고..."', '"그럼 뭘 먹고 싶지?"'],
  title: '🍴 먹고 싶은 음식은?',

  kindLabel: '무엇을 먹을까?',
  kindHint: '좋은 순서대로 눌러줘. 여러 개 골라도 된다.',
  kinds: [
    { key: 'pork', icon: '🥩', label: '돼지고기' },
    { key: 'beef', icon: '🥩', label: '소고기' },
    { key: 'seafood', icon: '🦀', label: '해산물' },
    { key: 'other', icon: '📝', label: '기타' },
  ],
  kindAny: { icon: '❓', label: '알아서 잘 해봐라' },
  otherLabel: '목록에 없는 음식이 있다면 적어줘!',
  otherPlaceholder: '예) 파스타, 초밥, 마라탕...',

  wayLabel: '어떻게 먹을까?',
  wayHint: '이것도 좋은 순서대로!',
  ways: [
    { key: 'restaurant', icon: '🍽️', label: '음식점', desc: '예약해서 제대로' },
    { key: 'bbq', icon: '🔥', label: '바베큐', desc: '숯불에 구워먹기' },
    { key: 'cook', icon: '👨‍🍳', label: '짐이 요리', desc: '엣헴 짐을 믿느냐?' },
    { key: 'other', icon: '📝', label: '기타', desc: '생각해둔 게 있느냐?' },
  ],
  wayAny: { icon: '🎲', label: '알아서 잘 해봐라' },
  wayOtherLabel: '목록에 없는 방법이 있다면 적어줘!',
  wayOtherPlaceholder: '예) 좋은 아이디어 있으면 적어보거라~',

  empty: '둘 다 골라줘야 다음으로 넘어갈 수 있다.',
  needCustom: '기타를 골랐으면 뭘 먹고 싶은지 적어줘!',
  needCustomWay: '기타를 골랐으면 어떻게 먹고 싶은지 적어줘!',
  button: '다음 퀘스트 ▶',
};

// ── 7. 선물 ───────────────────────────────
export const GIFT = {
  say: ['"마지막으로..."', '"갖고 싶은 건 있나?"'],
  title: '🎁 갖고 싶은 것은?',
  options: [
    { key: 'have', icon: '💎', label: '있어!' },
    { key: 'any', icon: '🎁', label: '알아서 잘 해봐라!' },
  ],
  haveLabel: '좋아. 솔직하게 말해보도록.',
  havePlaceholder: '예) 세은의 사랑 💘',
  // 적는 동안 입력칸 옆에서 번갈아 뜨는 잔소리. 끝까지 가면 처음으로 돌아간다.
  nags: [
    '편하고 솔직하게 적거라~',
    '어차피 여친 능력 밖은 못 사준다~ 😇',
    '그래도 일단 적어보거라. 혹시 모르지 않느냐?',
    '근데 뭘 적든 어차피 짐 마음대로다',
    '그저 참고용일뿐이니 편하게 적거라~',
    '완전히 소원을 말해봐다~',
    '엣헴 소원을 들어만 주는 마법 지니다~',
  ],
  button: '퀘스트 완료 ▶',
};

// ── 퀘스트 보상 (네 질문이 전부 같은 문법으로 끝난다) ──
// 각 질문을 마치면 리액션 → XP → 다음 질문 예고 순서로 한 장에 보여준다.
//
// XP 는 위쪽 진행 표시(STEPS)와 같은 눈금을 쓴다.
// 점 하나 = 막대 한 칸 = XP_STEP. 둘이 늘 같은 속도로 찬다.
export const XP_STEP = 20;
export const XP_TOTAL = STEPS.length * XP_STEP;

export const PAYOFF = {
  style: {
    n: 1,
    body: '10월 24일 생일 당일에 대한\n선호 스타일을 확인했다.\n\n이제...',
    quote: '"그렇다면 제대로 축하하는 날은 언제가 좋을까?"',
    button: '다음 퀘스트 ▶',
  },
  date: {
    n: 2,
    lines: ['"좋아."', '"이 날짜들을 참고해서 정해보도록 하지."'],
    body: '제대로 축하할 날짜 후보를 받아두었다.',
    quote: '"그럼 그날 뭘 먹고 싶지?"',
    button: '다음 퀘스트 ▶',
  },
  food: {
    n: 3,
    lines: ['"적어두었다."', '"맛있게 먹을 방법을 궁리해보겠노라."'],
    body: '먹고 싶은 음식과 먹는 방식을 확인했다.',
    quote: '"이제 마지막 하나다."',
    button: '다음 퀘스트 ▶',
  },
  gift: {
    n: 4,
    lines: ['"흠... 잘 기억해두마."'],
    body: '네 개의 퀘스트를 모두 마쳤다.\n\n이제 결과를 확인할 차례다.',
    quote: '"어디 한번 볼까?"',
    button: '결과 보기 ▶',
  },
};

export const payoffTitle = (n) => `📜 퀘스트 ${n}/4 완료`;
export const xpLine = (xp) => `+${xp} XP`;
// 이미 답했던 질문을 고쳐서 다시 온 경우. XP 는 한 번만 준다.
export const XP_AGAIN = '✅ 이미 받은 보상이로다~';

// ── 8. 요약 ───────────────────────────────
export const SUMMARY = {
  title: '📜 Birthday Quest 결과',
  // goto 는 그 줄을 눌렀을 때 돌아갈 화면
  rows: [
    { key: 'style', goto: 'style', icon: '🎂', label: '10월 24일' },
    { key: 'date', goto: 'date', icon: '📅', label: '제대로 축하할 날짜' },
    { key: 'food', goto: 'food', icon: '🍴', label: '먹고 싶은 음식' },
    { key: 'way', goto: 'food', icon: '🍽️', label: '먹는 방식' },
    { key: 'gift', goto: 'gift', icon: '🎁', label: '선물' },
  ],
  editHint: '항목을 누르면 다시 고를 수 있다.',
  noteTitle: '📌 참고사항',
  note: '이것은 이경의 의견을 바탕으로\n생일을 준비하기 위한 자료입니다.\n\n최종 계획은...',
  punch: '짐이 알아서 잘 해보도록 하지. 😎',
  // 요약 맨 아래, 마지막으로 자유롭게 적는 칸
  lastLabel: '💌 마지막으로 하고싶은 말이 있다면 해도 좋다~',
  lastPlaceholder: '예) 기대하고 있겠노라~',
  lastTitle: '마지막 한마디',
  button: '❤️ 이대로 진행하기',
};

export const STYLE_SUMMARY = {
  survival: '🛡️ SURVIVAL MODE',
  birthday: '🔥 BIRTHDAY MODE',
  random: '🎲 RANDOM MODE',
};

export const FOOD_LABEL = {
  pork: '🥩 돼지고기',
  beef: '🥩 소고기',
  seafood: '🦀 해산물',
  other: '📝 기타',
};

export const WAY_LABEL = {
  restaurant: '🍽️ 음식점',
  bbq: '🔥 바베큐',
  cook: '👨‍🍳 짐이 요리',
  other: '📝 기타',
};

export const ANY_SUMMARY = '🎲 알아서 잘 해봐라';

export const GIFT_SUMMARY = {
  have: '💎 직접 알려줌',
  any: '🎁 알아서 잘 해봐라',
};

// ── 9. 완료 ───────────────────────────────
export const DONE = {
  title: 'PLAN COMPLETE!',
  sub: '🎂 생일 계획 접수 완료!',
  body: '엣헴 알겠도다~\n\n의견은 충분히 들었다.\n\n이제 짐이 잘 준비해보겠노라 ❤️',
  send: '📤 결과 보내기',
  save: '🖼️ 이미지로 저장',
  restart: '🏠 처음으로 돌아가기',
};

// ── 보내기 / 저장 ─────────────────────────
export const SHARE = {
  title: '🎂 Birthday Quest 결과',
  shared: '보냈어요!',
  copied: '복사했어요! 붙여넣기 해주세요',
  manual: '아래 내용을 길게 눌러 복사해주세요',
  savedImage: '이미지를 저장했어요!',
  imageHint: '이 그림을 보내주면 된다~\n길게 누르거나 아래 [이미지로 저장]을 눌러보거라.',
  imageFail: '이미지를 만들지 못했어요. 글로 보낼게요',
  // 저장이 막힌 환경(아티팩트 창 안에서는 다운로드가 차단될 수 있다)
  noDownload: '저장이 막혀 있구나. 화면을 캡처해서 보내다오~ 📸',
};

export const CREDITS = {
  font: 'Galmuri11 (SIL OFL 1.1)',
  fontUrl: 'https://github.com/quiple/galmuri',
};
