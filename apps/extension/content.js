(() => {
  if (window.__TAB_OVERLAY_INJECTED__) return;
  window.__TAB_OVERLAY_INJECTED__ = true;

  const host = document.createElement('div');
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `
    <style>
      :host { all: initial; position: fixed; top: 45%; right: 16px; z-index: 2147483647; }
      button, textarea, section { font: 16px system-ui; }
      button { cursor: pointer; }
      section { direction: rtl; width: min(280px, 80vw); padding: 16px; margin-bottom: 8px;
        border-radius: 14px; background: #191928; color: white; box-shadow: 0 3px 20px #0005; }
      textarea { box-sizing: border-box; width: 100%; margin: 8px 0; }
      #toggle { float: right; background: #272139; color: white; padding: 10px; border-radius: 12px; }
    </style>
    <section hidden><label>מה הצעד הבא שלך כאן?<textarea maxlength="500" rows="2"></textarea></label>
      <button id="save">שמירה</button> <button id="remove">מחיקה</button>
      <div role="status"></div></section>
    <button id="toggle" aria-expanded="false" aria-label="הצעד הבא שלי">✦</button>`;
  document.documentElement.append(host);
  const panel = root.querySelector('section');
  const field = root.querySelector('textarea');
  const toggle = root.querySelector('#toggle');
  const status = root.querySelector('[role=status]');
  let page = location.href;
  const key = url => 'step:' + url;

  function show(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }

  async function load() {
    const url = page = location.href;
    show(false);
    field.value = '';
    status.textContent = '';
    try {
      const saved = await chrome.storage.local.get(key(url));
      if (location.href !== url) return;
      field.value = saved[key(url)] || '';
      show(Boolean(field.value));
    } catch {
      status.textContent = 'לא הצלחנו לקרוא את הצעד השמור.';
    }
  }

  async function update(remove) {
    const url = location.href;
    if (page !== url) return load();
    const value = field.value.trim();
    if (!remove && !value) return field.focus();
    try {
      if (remove) await chrome.storage.local.remove(key(url));
      else await chrome.storage.local.set({ [key(url)]: value });
      if (location.href !== url) return;
      if (remove) field.value = '';
      status.textContent = remove ? 'הצעד נמחק' : 'הצעד נשמר בדפדפן הזה';
    } catch {
      status.textContent = 'השינוי לא נשמר. אפשר לנסות שוב.';
    }
  }

  function openOrClose() {
    show(panel.hidden);
    if (!panel.hidden) field.focus();
  }
  toggle.onclick = openOrClose;
  root.querySelector('#save').onclick = () => update(false);
  root.querySelector('#remove').onclick = () => update(true);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === ';') {
      event.preventDefault();
      openOrClose();
    }
  });
  window.navigation?.addEventListener('currententrychange', () => {
    if (page !== location.href) load();
  });
  load();
})();
