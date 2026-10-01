// 아주 작은 DOM 헬퍼 + 책/양피지 패널.
// 프레임워크 없이 화면을 만들기 때문에, 화면 모듈이 쓰는 어휘를 여기 모아둔다.

// h('div', {class:'x', onClick:fn}, '글', node) 형태.
// 문자열 자식은 textContent 로만 들어가므로 HTML 주입이 구조적으로 불가능하다.
export function h(tag, props = null, ...kids) {
  const node = document.createElement(tag);
  for (const k in props || {}) {
    const v = props[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  }
  return node;
}

// 줄바꿈이 들어간 문단. \n 을 그대로 살린다.
export const p = (text, cls = 'line') => h('p', { class: cls, text });

// 양피지 패널
export function book({ title = null, cls = '', kids = [] } = {}) {
  return h('div', { class: `book ${cls}`.trim() },
    title ? h('h2', { class: 'book-title', text: title }) : null,
    h('div', { class: 'book-body' }, ...kids),
  );
}

// 버튼
export function btn(label, { primary = false, cls = '', onClick = null, disabled = false } = {}) {
  return h('button', {
    class: `btn ${primary ? 'primary' : ''} ${cls}`.trim(),
    type: 'button',
    text: label,
    disabled: disabled || null,
    onClick,
  });
}

// 캐릭터 말풍선 (화면 위쪽)
export function say(lines) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return h('div', { class: 'say' },
    h('span', { class: 'say-face', text: '🎂' }),
    h('div', { class: 'say-bubble' }, ...arr.map((t) => p(t, 'say-line'))),
  );
}

// 입력창 (책에 적는 느낌)
export function input({ label = null, placeholder = '', value = '', onInput = null, rows = 2 } = {}) {
  const ta = h('textarea', {
    class: 'write', rows, placeholder, spellcheck: 'false',
    onInput: (e) => onInput && onInput(e.target.value),
  });
  ta.value = value;
  return h('div', { class: 'write-wrap' }, label ? h('div', { class: 'write-label', text: label }) : null, ta);
}
