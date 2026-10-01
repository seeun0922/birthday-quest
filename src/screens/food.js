// 6. 음식 — 두 가지를 따로 묻는다.
//   무엇을 먹을까  (순위)
//   어떻게 먹을까  (순위)
// 두 질문은 서로 독립이다. 한쪽에서 "알아서" 를 골라도 다른 쪽은 그대로다.
import { FOOD } from '../data/content.ko.js';
import { birthdayPlan, set, foodDone, mealDone, answered } from '../data/plan.js';
import { h, book, say, btn, input } from '../ui/book.js';
import { rankList, anyOption } from '../ui/rank.js';

export const step = 'food';
// params.ret 은 "요약에서 한 줄 고치러 왔다" 는 표시. 그때는 왔던 자리로 되돌아간다.
export const back = (params) => (params.ret ? ['summary', {}] : ['date', {}]);

export function render({ go, params }) {
  // 이 화면에 들어온 시점에 이미 답이 있었는지. XP 를 두 번 주지 않기 위해 본다.
  const again = answered().food;

  const kindSlot = h('div', { class: 'block' });
  const waySlot = h('div', { class: 'block' });
  // 고치러 온 길이면 보상 화면을 건너뛰고 곧장 결과로 돌아간다
  const onNext = () => (params.ret ? go('summary') : go('payoff', { from: 'food', again, particle: 'fire' }));
  const next = btn(FOOD.button, { primary: true, onClick: onNext });

  // '기타' 는 적어야 고른 것으로 친다. 무엇을·어떻게 양쪽 다 같은 규칙이다.
  const pickedOther = (prefs) => prefs.some((p) => p.key === 'other');
  const needKindText = () => pickedOther(birthdayPlan.foodPreferences) && !birthdayPlan.customFood.trim();
  const needWayText = () => pickedOther(birthdayPlan.mealPreferences) && !birthdayPlan.customMeal.trim();

  const refresh = () => {
    if (!foodDone() || !mealDone()) {
      next.disabled = true;
      next.textContent = FOOD.empty;
    } else if (needKindText()) {
      next.disabled = true;
      next.textContent = FOOD.needCustom;
    } else if (needWayText()) {
      next.disabled = true;
      next.textContent = FOOD.needCustomWay;
    } else {
      next.disabled = false;
      next.textContent = FOOD.button;
    }
  };

  // 글자는 멈춘 뒤에 저장한다. 두 입력칸이 서로의 타이머를 지우면 안 되므로 따로 만든다.
  const writer = (key) => {
    let timer = 0;
    return (v) => {
      clearTimeout(timer);
      timer = setTimeout(() => { set(key, v); refresh(); }, 400);
    };
  };
  const onKindText = writer('customFood');
  const onWayText = writer('customMeal');

  // ── 무엇을 ────────────────────────────
  const drawKinds = () => {
    const wroteOther = pickedOther(birthdayPlan.foodPreferences);
    kindSlot.replaceChildren(
      h('div', { class: 'block-head' },
        h('span', { class: 'block-title', text: FOOD.kindLabel }),
        h('span', { class: 'block-hint', text: FOOD.kindHint }),
      ),
      rankList(FOOD.kinds, birthdayPlan.foodPreferences, (prefs) => {
        set('foodPreferences', prefs);
        if (prefs.length > 0 && birthdayPlan.foodAny) set('foodAny', false);
        drawKinds();
        refresh();
      }),
      anyOption(FOOD.kindAny, birthdayPlan.foodAny, () => {
        const on = !birthdayPlan.foodAny;
        set('foodAny', on);
        if (on) set('foodPreferences', []);
        drawKinds();
        refresh();
      }),
      wroteOther
        ? input({
          label: FOOD.otherLabel,
          placeholder: FOOD.otherPlaceholder,
          value: birthdayPlan.customFood,
          onInput: onKindText,
        })
        : h('span', { class: 'hidden' }),
    );
  };

  // ── 어떻게 ────────────────────────────
  const drawWays = () => {
    const wroteOther = pickedOther(birthdayPlan.mealPreferences);
    waySlot.replaceChildren(
      h('div', { class: 'block-head' },
        h('span', { class: 'block-title', text: FOOD.wayLabel }),
        h('span', { class: 'block-hint', text: FOOD.wayHint }),
      ),
      // 설명이 붙은 카드 4개라 한 줄에 다 넣으면 글자가 눌린다. 2열로 고정한다.
      rankList(FOOD.ways, birthdayPlan.mealPreferences, (prefs) => {
        set('mealPreferences', prefs);
        if (prefs.length > 0 && birthdayPlan.mealAny) set('mealAny', false);
        drawWays();
        refresh();
      }, 'opts-2'),
      anyOption(FOOD.wayAny, birthdayPlan.mealAny, () => {
        const on = !birthdayPlan.mealAny;
        set('mealAny', on);
        if (on) set('mealPreferences', []);
        drawWays();
        refresh();
      }),
      wroteOther
        ? input({
          label: FOOD.wayOtherLabel,
          placeholder: FOOD.wayOtherPlaceholder,
          value: birthdayPlan.customMeal,
          onInput: onWayText,
        })
        : h('span', { class: 'hidden' }),
    );
  };

  drawKinds();
  drawWays();
  refresh();

  return h('div', {},
    say(FOOD.say),
    book({ title: FOOD.title, kids: [kindSlot, h('hr', { class: 'book-rule' }), waySlot] }),
    next,
  );
}
