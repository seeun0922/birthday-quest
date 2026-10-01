// 답변 상태와 저장.
//
// 저장은 이 기기 안에서만 한다. 답이 나에게 돌아오는 길은 완료 화면에서
// 본인이 보내주는 그림 한 장뿐이다 — 로그인 같은 걸 요구하지 않는 쪽이,
// 링크를 받은 사람이 바로 열어볼 수 있어서 낫다.
//
// 되살리기와 보관을 구분한다.
//   sessionStorage  이번 방문에만 산다. 답을 되살리는 건 여기서만 한다.
//   localStorage    보내기 전에 날아가지 않게 남기는 사본. 다시 읽지 않는다.
//
// 되살리기까지 localStorage 로 하면, 만들면서 눌러본 답이 다음에 들어온 사람
// 화면에 "미리 골라진" 채로 나타난다. 그래서 읽는 쪽만 세션으로 끊어두었다.
import { CANDIDATE_DATES, STYLE_SUMMARY, FOOD_LABEL, WAY_LABEL, ANY_SUMMARY, GIFT_SUMMARY, SHARE, SUMMARY, rankLabel } from './content.ko.js';

const KEY = 'birthday-quest-v1';
// 저장해둔 답의 형식 번호. 읽을 때 반드시 확인한다 — 번호가 다르면 통째로 버린다.
// 만들면서 눌러본 답이 남아 "미리 골라져 있는" 것처럼 보이면 이 숫자를 올리면 된다.
const VERSION = 2;

export const birthdayPlan = {
  birthdayStyle: '',      // 'survival' | 'birthday' | 'random'
  datePreferences: [],    // [{ date: '2026-10-13', rank: 1 }, ...]
  dateNote: '',
  foodPreferences: [],    // [{ key: 'seafood', rank: 1 }, ...]  무엇을
  foodAny: false,         // 알아서 잘 해봐라 (순위를 매기지 않음)
  customFood: '',         // foodPreferences 에 'other' 가 있을 때 쓴다
  mealPreferences: [],    // [{ key: 'bbq', rank: 1 }, ...]      어떻게
  mealAny: false,
  customMeal: '',         // mealPreferences 에 'other' 가 있을 때 쓴다
  giftType: '',           // 'have' | 'any'
  giftNote: '',
  lastWord: '',           // 요약 화면 맨 아래에 자유롭게 적는 한마디
};

// ── 로컬 ────────────────────────────────
// 되살리기는 이번 방문(sessionStorage)에서만. 새로고침은 버텨도 창을 닫으면 사라진다.
export function loadLocal() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return;
    const o = JSON.parse(raw);
    if (o && o.v === VERSION && o.plan) merge(o.plan);
  } catch { /* 시크릿 모드 등에서는 그냥 넘어간다 */ }
}

function merge(src) {
  for (const k of Object.keys(birthdayPlan)) {
    if (!(k in src)) continue;
    const mine = birthdayPlan[k];
    if (Array.isArray(mine)) birthdayPlan[k] = Array.isArray(src[k]) ? src[k] : [];
    else if (typeof mine === 'boolean') birthdayPlan[k] = !!src[k];
    else if (typeof src[k] === 'string') birthdayPlan[k] = src[k];
  }
}

const body = () => ({ v: VERSION, plan: { ...birthdayPlan }, updated: new Date().toISOString() });

function writeLocal() {
  const json = JSON.stringify(body());
  try { sessionStorage.setItem(KEY, json); } catch { /* 무시 */ }   // 되살리기용
  try { localStorage.setItem(KEY, json); } catch { /* 무시 */ }     // 보관용 사본
}

export function reset() {
  birthdayPlan.birthdayStyle = '';
  birthdayPlan.datePreferences = [];
  birthdayPlan.dateNote = '';
  birthdayPlan.foodPreferences = [];
  birthdayPlan.foodAny = false;
  birthdayPlan.customFood = '';
  birthdayPlan.mealPreferences = [];
  birthdayPlan.mealAny = false;
  birthdayPlan.customMeal = '';
  birthdayPlan.giftType = '';
  birthdayPlan.giftNote = '';
  birthdayPlan.lastWord = '';
  save();
}

// ── 저장 ────────────────────────────────
export function save() {
  writeLocal();
}

export function set(key, value) {
  birthdayPlan[key] = value;
  save();
}

// 네 질문 각각을 답했는지. 퀘스트 보상(XP) 계산에 쓴다.
// 음식은 "무엇을" 과 "어떻게" 를 둘 다 골라야 한 질문을 마친 것으로 본다.
export const foodDone = () => birthdayPlan.foodPreferences.length > 0 || birthdayPlan.foodAny;
export const mealDone = () => birthdayPlan.mealPreferences.length > 0 || birthdayPlan.mealAny;

export function answered() {
  return {
    style: !!birthdayPlan.birthdayStyle,
    date: birthdayPlan.datePreferences.length > 0,
    food: foodDone() && mealDone(),
    gift: !!birthdayPlan.giftType,
  };
}

// ── 요약 텍스트 ──────────────────────────
export function styleText() {
  return STYLE_SUMMARY[birthdayPlan.birthdayStyle] || '아직 안 골랐어요';
}

export function dateLines() {
  const ds = [...birthdayPlan.datePreferences].sort((a, b) => a.rank - b.rank);
  if (ds.length === 0) return ['아직 안 골랐어요'];
  return ds.map((d) => {
    const [, m, day] = d.date.split('-');
    const star = CANDIDATE_DATES.includes(d.date) ? ' ✨' : '';
    return `${rankLabel(d.rank)} ${Number(m)}월 ${Number(day)}일${star}`;
  });
}

// 순위가 매겨진 목록을 줄 단위로. 안 골랐으면 null 을 돌려준다.
function rankedLines(prefs, label) {
  if (prefs.length === 0) return null;
  return [...prefs].sort((a, b) => a.rank - b.rank).map((p) => `${rankLabel(p.rank)} ${label(p.key)}`);
}

export function foodLines() {
  const lines = rankedLines(birthdayPlan.foodPreferences, (k) => (
    k === 'other' && birthdayPlan.customFood ? `📝 ${birthdayPlan.customFood}` : FOOD_LABEL[k] || k
  ));
  if (lines) return lines;
  return [birthdayPlan.foodAny ? ANY_SUMMARY : '아직 안 골랐어요'];
}

export function mealLines() {
  const lines = rankedLines(birthdayPlan.mealPreferences, (k) => (
    k === 'other' && birthdayPlan.customMeal ? `📝 ${birthdayPlan.customMeal}` : WAY_LABEL[k] || k
  ));
  if (lines) return lines;
  return [birthdayPlan.mealAny ? ANY_SUMMARY : '아직 안 골랐어요'];
}

export function giftText() {
  if (birthdayPlan.giftType === 'have') {
    return birthdayPlan.giftNote ? `💎 ${birthdayPlan.giftNote}` : GIFT_SUMMARY.have;
  }
  return GIFT_SUMMARY[birthdayPlan.giftType] || '아직 안 골랐어요';
}

// 요약 화면·결과 그림·보내는 글이 같은 내용을 보여주도록 여기 한 군데서 만든다.
// 값은 여러 줄일 수 있다 (순위가 매겨진 날짜·음식).
//
// 마지막 한마디는 요약 화면에서 '적는 칸' 으로 따로 보여주므로 기본으로는 빼둔다.
// 내보낼 때(그림·글)만 withLast 로 붙인다. 비어 있으면 아예 넣지 않는다.
export function summaryRows({ withLast = false } = {}) {
  const value = {
    style: () => [styleText()],
    date: () => (birthdayPlan.dateNote ? [...dateLines(), `💬 ${birthdayPlan.dateNote}`] : dateLines()),
    food: () => foodLines(),
    way: () => mealLines(),
    gift: () => [giftText()],
  };
  const rows = SUMMARY.rows.map((r) => ({ ...r, lines: value[r.key]() }));

  const last = birthdayPlan.lastWord.trim();
  if (withLast && last) rows.push({ key: 'last', icon: '💌', label: SUMMARY.lastTitle, lines: last.split('\n') });
  return rows;
}

const RULE = '━━━━━━━━━━━━━━';

export function summaryText() {
  const out = [SHARE.title, RULE, ''];
  for (const r of summaryRows({ withLast: true })) {
    out.push(`${r.icon} ${r.label}`, ...r.lines.map((l) => `   ${l}`), '');
  }
  out.push(RULE, SUMMARY.punch);
  return out.join('\n');
}

// ── 보내기 ──────────────────────────────
export async function shareText(text) {
  try {
    if (navigator.share) { await navigator.share({ text }); return 'shared'; }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return 'copied';
    }
  } catch { /* 권한 없음 */ }
  return 'manual';
}

// ── 안내 칩 ─────────────────────────────
export function chip(text) {
  const el = document.getElementById('chip');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(chip._t);
  chip._t = setTimeout(() => el.classList.add('hidden'), 2400);
}
