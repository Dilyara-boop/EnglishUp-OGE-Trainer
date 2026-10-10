(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    .oge-ai-launch{position:fixed;right:20px;bottom:20px;z-index:200;border:0;border-radius:999px;padding:13px 19px;background:linear-gradient(100deg,#6559e6,#459edc);color:#fff;font:750 15px system-ui,sans-serif;box-shadow:0 10px 32px #25265c44;cursor:pointer}.oge-ai-launch[hidden]{display:none}
    .oge-ai-dialog{position:fixed;right:20px;bottom:82px;width:min(410px,calc(100vw - 32px));height:min(520px,calc(100dvh - 110px));z-index:201;display:flex;flex-direction:column;background:#fff;border:1px solid #dedaf5;border-radius:22px;box-shadow:0 18px 60px #25265c55;overflow:hidden;color:#273153;font:15px/1.45 system-ui,sans-serif}
    .oge-ai-dialog[hidden]{display:none}.oge-ai-head{padding:14px 17px;background:linear-gradient(110deg,#6259dd,#4da1da);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px}.oge-ai-title{display:flex;align-items:center;gap:11px}.oge-ai-avatar{display:grid;place-items:center;width:39px;height:39px;border-radius:13px;background:#ffffff34;font-size:20px}.oge-ai-head strong{display:block;font-size:16px}.oge-ai-head small{display:block;font-size:12px;opacity:.88}.oge-ai-close{width:34px;height:34px;background:#ffffff2b;border:0;border-radius:10px;color:#fff;font-size:23px;line-height:1;cursor:pointer}
    .oge-ai-log{padding:18px;min-height:0;overflow:auto;flex:1;display:flex;flex-direction:column;gap:12px}.oge-ai-line{padding:11px 14px;border-radius:16px;max-width:90%;white-space:pre-wrap;overflow-wrap:anywhere}.oge-ai-line.user{align-self:flex-end;background:#eeeaff;border-bottom-right-radius:5px}.oge-ai-line.assistant{align-self:flex-start;background:#eff8fc;border-bottom-left-radius:5px}.oge-ai-status{padding:0 16px;color:#a33143;font-size:13px;min-height:0}.oge-ai-status:not(:empty){padding-bottom:9px}
    .oge-ai-form{display:flex;align-items:end;gap:8px;padding:12px 14px;border-top:1px solid #eae6f6;flex:0 0 auto;background:#fff}.oge-ai-form textarea{flex:1;min-width:0;min-height:0!important;height:54px!important;max-height:54px!important;resize:none!important;border:1px solid #cac5e8;border-radius:13px!important;padding:9px 12px!important;font:14px/1.3 system-ui,sans-serif!important;box-sizing:border-box}.oge-ai-form button{flex:0 0 auto;height:54px;align-self:end;border:0;border-radius:13px;padding:0 15px;background:#6356d9;color:#fff;font:750 14px system-ui,sans-serif;cursor:pointer}.oge-ai-form button:disabled{opacity:.5;cursor:wait}
    .oge-ai-quick-actions{display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px 4px;background:#fff}
    .oge-ai-quick-actions button{border:1px solid #ddd9ff;background:#f7f5ff;color:#4d46a8;border-radius:18px;padding:7px 10px;font-size:12px;font-weight:600;cursor:pointer}
    .oge-ai-quick-actions button:hover{background:#ebe8ff;transform:translateY(-1px)}
    .oge-ai-save{display:block;margin-top:9px;padding:5px 9px;border:1px solid #c7c3ef;border-radius:9px;background:#fff;color:#4d46a8;cursor:pointer;font-size:12px}
    .oge-ai-saved-toggle{border:0;background:#f4f1ff;color:#5045ad;padding:8px 14px;text-align:left;cursor:pointer;font-weight:650}
    .oge-ai-saved-panel{padding:10px 14px;max-height:220px;overflow:auto;border-bottom:1px solid #eae6f6;background:#faf9ff}
    .oge-ai-saved-panel[hidden]{display:none}.oge-ai-saved-item{background:#fff;border:1px solid #e5e1fa;border-radius:12px;padding:10px;margin:7px 0;overflow-wrap:anywhere}
    .oge-ai-saved-item p{white-space:pre-wrap;max-height:110px;overflow:auto;margin:7px 0}.oge-ai-saved-item button{margin-right:8px;margin-top:6px;border:1px solid #ddd9ff;border-radius:8px;background:#f7f5ff;padding:5px 8px;cursor:pointer}
    @media(max-width:600px){.oge-ai-launch{right:12px;bottom:12px}.oge-ai-dialog{right:8px;bottom:76px;width:calc(100vw - 16px);height:min(600px,calc(100dvh - 95px))}}
  `;
  document.head.append(style);
  const launch = document.createElement('button');
  launch.type = 'button'; launch.className = 'oge-ai-launch'; launch.textContent = '✦ Помощник ОГЭ';
  launch.setAttribute('aria-label','Открыть помощника ОГЭ');
  launch.hidden = true;
  const dialog = document.createElement('section');
  dialog.className = 'oge-ai-dialog'; dialog.hidden = true;
  dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-label','Помощник по английскому ОГЭ');
  dialog.innerHTML = '<div class="oge-ai-head"><div class="oge-ai-title"><span class="oge-ai-avatar" aria-hidden="true">✦</span><span><strong>Помощник ОГЭ</strong><small>Разбираем английский вместе</small></span></div><button class="oge-ai-close" type="button" aria-label="Закрыть">×</button></div><div class="oge-ai-log" role="log" aria-live="polite"></div><div class="oge-ai-status" aria-live="polite"></div><form class="oge-ai-form"><textarea rows="2" maxlength="500" aria-label="Вопрос помощнику" placeholder="Спроси о задании…" required></textarea><button type="submit">Отправить</button></form>';
  document.body.append(launch,dialog);
  const savedToggle = document.createElement('button');
  savedToggle.type = 'button';
  savedToggle.className = 'oge-ai-saved-toggle';
  savedToggle.textContent = '📁 Мои материалы (0)';
  const savedPanel = document.createElement('div');
  savedPanel.className = 'oge-ai-saved-panel';
  savedPanel.hidden = true;
  dialog.querySelector('.oge-ai-log').before(savedToggle, savedPanel);
  const log = dialog.querySelector('.oge-ai-log');
  const status = dialog.querySelector('.oge-ai-status');
  const form = dialog.querySelector('form');
  const input = form.querySelector('textarea');
  const send = form.querySelector('button');
  let history = [];
  // Materials are kept only in this browser, separately for each known account.
  function storageKey() {
    let account = null;
    try { account = JSON.parse(localStorage.getItem('englishup-auth-session') || 'null'); } catch (_) {}
    let student = null;
    try { student = JSON.parse(sessionStorage.getItem('englishup-student-session') || 'null'); } catch (_) {}
    const identity = account?.user?.id || account?.user?.email || student?.code || 'local';
    return 'englishup-ai-saved-v1:' + encodeURIComponent(String(identity));
  }
  function readSaved() {
    try {
      const items = JSON.parse(localStorage.getItem(storageKey()) || '[]');
      return Array.isArray(items) ? items.filter(x => x && typeof x.text === 'string').slice(0, 60) : [];
    } catch (_) { return []; }
  }
  function writeSaved(items) {
    try { localStorage.setItem(storageKey(), JSON.stringify(items)); return true; }
    catch (_) { status.textContent = 'Не удалось сохранить: память браузера заполнена или отключена.'; return false; }
  }
  function renderSaved() {
    const items = readSaved();
    savedToggle.textContent = '📁 Мои материалы (' + items.length + ')';
    savedPanel.replaceChildren();
    if (!items.length) { const empty = document.createElement('p'); empty.textContent = 'Пока нет сохранённых материалов.'; savedPanel.append(empty); }
    items.forEach((entry, index) => {
      const wrap = document.createElement('div'); wrap.className = 'oge-ai-saved-item';
      const date = document.createElement('small'); date.textContent = entry.date || 'Сохранено';
      const content = document.createElement('p'); content.textContent = entry.text;
      const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = '📋 Копировать';
      copy.onclick = async () => { try { await navigator.clipboard.writeText(entry.text); copy.textContent = '✓ Скопировано'; } catch (_) { status.textContent = 'Не удалось скопировать текст.'; } };
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '🗑 Удалить';
      remove.onclick = () => { const updated = readSaved(); updated.splice(index, 1); if (writeSaved(updated)) renderSaved(); };
      wrap.append(date, content, copy, remove); savedPanel.append(wrap);
    });
  }
  savedToggle.onclick = () => { savedPanel.hidden = !savedPanel.hidden; if (!savedPanel.hidden) renderSaved(); };
  window.addEventListener('focus', () => { if (!savedPanel.hidden) renderSaved(); });
  renderSaved();
  const quickActions = document.createElement('div');
quickActions.className = 'oge-ai-quick-actions';
let verifiedTeacher = false;
let checkedToken = null;
let checkingToken = null;
const SUPABASE_URL = 'https://hwggubjyeavxgyoqqelw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6EzzcMnrKlFWXkVaSP3jzA_gV9Eq5tT';
function currentToken() {
  try { return JSON.parse(localStorage.getItem('englishup-auth-session') || 'null')?.access_token || null; }
  catch (_) { return null; }
}
async function checkTeacherRole() {
  const token = currentToken();
  if (token === checkedToken || token === checkingToken) return;
  if (!token) { checkedToken = null; verifiedTeacher = false; renderActions(); return; }
  checkingToken = token;
  try {
    const response = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token }
    });
    if (!response.ok) throw new Error('Не удалось проверить роль');
    const user = await response.json();
    if (currentToken() !== token) return;
    verifiedTeacher = user?.user_metadata?.role === 'teacher';
    checkedToken = token;
  } catch (_) {
    if (currentToken() === token) { verifiedTeacher = false; checkedToken = null; }
  } finally {
    if (checkingToken === token) checkingToken = null;
    renderActions();
  }
}
function renderActions() {
const isTeacher = verifiedTeacher && Boolean(currentToken());
if (isTeacher) {
  quickActions.innerHTML = `
    <button type="button" data-prompt="Создай задание в формате ОГЭ по английскому языку по теме: ">📝 Создай задание</button>
    <button type="button" data-prompt="Проверь ответ ученика. Укажи ошибки, объясни их и предложи исправленный вариант: ">✅ Проверь ответ</button>
    <button type="button" data-prompt="Проанализируй ошибки ученика, определи слабые темы и предложи, что нужно повторить: ">📊 Разбери ошибки</button>
    <button type="button" data-prompt="Составь план занятия по английскому языку с подготовкой к ОГЭ по теме: ">🎓 План урока</button>
    <button type="button" data-prompt="Объясни эту тему простыми словами так, чтобы я могла объяснить её ученику: ">💡 Объясни тему</button>
  `;
} else {
  quickActions.innerHTML = `
    <button type="button" data-prompt="Объясни мне это задание простыми словами, но не давай готовый ответ: ">📘 Объясни задание</button>
    <button type="button" data-prompt="Переведи это слово или выражение, объясни его значение и приведи пример: ">🌍 Переведи слово</button>
    <button type="button" data-prompt="Проверь мой ответ, укажи ошибки и объясни, как их исправить: ">✍️ Проверь мой ответ</button>
    <button type="button" data-prompt="Потренируй меня по английскому языку в формате ОГЭ. Задавай по одному заданию и жди моего ответа.">🎯 Потренируй меня</button>
    <button type="button" data-prompt="Мне сложно. Объясни эту тему очень просто и помоги разобраться по шагам: ">💛 Мне сложно</button>
  `;
}

dialog.querySelector('.oge-ai-head strong').textContent = isTeacher ? 'ИИ-помощник учителя' : 'Помощник ОГЭ';
dialog.querySelector('.oge-ai-head small').textContent = isTeacher ? 'Задания, проверка и планы уроков' : 'Разбираем английский вместе';
}
renderActions();
form.parentNode.insertBefore(quickActions, form);

quickActions.addEventListener('click', event => {
  const button = event.target.closest('button[data-prompt]');
  if (!button) return;
  input.value = button.dataset.prompt;
  input.focus();
});
  function updateVisibility() {
    let teacher = null;
    try { teacher = JSON.parse(localStorage.getItem('englishup-auth-session') || 'null'); } catch (_) {}
    let student = null;
    try { student = JSON.parse(sessionStorage.getItem('englishup-student-session') || 'null'); } catch (_) {}
    launch.hidden = !teacher?.access_token && !student?.code;
    if (launch.hidden) dialog.hidden = true;
    checkTeacherRole();
  }
  updateVisibility();
  window.addEventListener('storage',updateVisibility);
  window.addEventListener('focus',updateVisibility);
  setInterval(updateVisibility,1500);

  function line(role,text) {
    const item = document.createElement('div');
    item.className = 'oge-ai-line ' + role;
    item.textContent = text;
    if (role === 'assistant' && text && !text.startsWith('Привет! Помогу разобраться')) {
      const save = document.createElement('button');
      save.type = 'button'; save.className = 'oge-ai-save'; save.textContent = '💾 Сохранить ответ';
      save.onclick = () => {
        const items = readSaved();
        if (items.some(x => x.text === text)) { save.textContent = '✓ Уже сохранено'; return; }
        items.unshift({text, date: new Date().toLocaleString('ru-RU')});
        if (writeSaved(items.slice(0, 60))) { save.textContent = '✓ Сохранено'; renderSaved(); }
      };
      item.append(save);
    }
    log.append(item);
    log.scrollTop = log.scrollHeight;
  }
  line('assistant','Привет! Помогу разобраться с заданием ОГЭ по английскому. Напиши, что непонятно.');
  launch.onclick = () => { dialog.hidden = !dialog.hidden; if (!dialog.hidden) input.focus(); };
  dialog.querySelector('.oge-ai-close').onclick = () => { dialog.hidden = true; launch.focus(); };
  dialog.addEventListener('keydown',event => { if (event.key === 'Escape') { dialog.hidden = true; launch.focus(); } });
  input.addEventListener('keydown',event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });

  form.onsubmit = async event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || send.disabled) return;
  let teacher = null;
let student = null;
try { teacher = JSON.parse(localStorage.getItem('englishup-auth-session') || 'null'); } catch (_) {}
try { student = JSON.parse(sessionStorage.getItem('englishup-student-session') || 'null'); } catch (_) {}

if (!teacher?.access_token && !student?.code) {
  status.textContent = 'Сначала войди в аккаунт.';
  return;
}
    status.textContent = '';
    send.disabled = true;
    line('user',message);
    input.value = '';
    try {const response = await fetch('https://dilyara-boop-englishup-oge-trainer-031d.twc1.net/api/assistant', {
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message,history:history.slice(-6),context:document.querySelector('.module-label')?.textContent?.trim() || 'Разделы ОГЭ'})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Не удалось получить ответ.');
      line('assistant',data.answer);
      history.push({role:'user',text:message},{role:'assistant',text:data.answer});
      history = history.slice(-6);
    } catch (error) { status.textContent = error.message || 'Помощник пока недоступен.'; }
    finally { send.disabled = false; input.focus(); }
  };
})();
