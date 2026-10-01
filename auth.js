(function () {
  'use strict';

  const SUPABASE_URL = 'https://hwggubjyeavxgyoqqelw.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_6EzzcMnrKlFWXkVaSP3jzA_gV9Eq5tT';
  const SESSION_KEY = 'englishup-auth-session';
  const STUDENT_KEY = 'englishup-student-session';
  let session = readSession();
  let user = null;
  let student = null;
  try { student = JSON.parse(sessionStorage.getItem(STUDENT_KEY) || 'null'); } catch (_) {}

  const styles = document.createElement('style');
  styles.textContent = `
    .topbar-inner{position:relative}.englishup-auth-trigger{border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.16);color:#fff;border-radius:999px;padding:8px 14px;font-weight:800;white-space:nowrap}.englishup-auth-trigger:hover{background:rgba(255,255,255,.25)}.englishup-auth-trigger.signed-in{background:#fff;color:#5e55d7}.englishup-auth-overlay{position:fixed;inset:0;z-index:10000;background:rgba(30,31,57,.55);display:none;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(7px)}.englishup-auth-overlay.open{display:flex}.englishup-auth-card{width:min(470px,100%);max-height:calc(100vh - 36px);overflow:auto;background:#fff;border-radius:28px;padding:25px;box-shadow:0 26px 80px rgba(32,28,78,.28);color:#293251}.englishup-auth-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.englishup-auth-head h2{margin:0;font-size:1.65rem}.englishup-auth-head p{margin:5px 0 0;color:#6d7591}.englishup-auth-close{border:0;background:#f1effb;color:#5c54c8;width:38px;height:38px;border-radius:12px;font-size:1.25rem}.englishup-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#f2effc;padding:5px;border-radius:14px;margin:20px 0}.englishup-auth-tab{border:0;background:transparent;color:#6c7190;padding:10px;border-radius:10px;font-weight:850}.englishup-auth-tab.active{background:#fff;color:#5d53d4;box-shadow:0 4px 15px rgba(70,57,140,.12)}.englishup-auth-form{display:grid;gap:13px}.englishup-auth-form[hidden]{display:none}.englishup-auth-form label{font-weight:750;font-size:.92rem}.englishup-auth-form input,.englishup-auth-form select{display:block;width:100%;margin-top:6px;border:1.5px solid #ded9ef;border-radius:13px;padding:11px 12px;color:#293251;background:#fff}.englishup-auth-form input:focus,.englishup-auth-form select:focus{outline:0;border-color:#7569e8;box-shadow:0 0 0 4px rgba(117,105,232,.12)}.englishup-auth-submit{border:0;border-radius:14px;padding:12px 16px;background:linear-gradient(135deg,#7064e8,#4a9cdd);color:#fff;font-weight:900;margin-top:4px}.englishup-auth-message{display:none;border-radius:13px;padding:11px 13px;margin:15px 0 0;font-size:.92rem}.englishup-auth-message.show{display:block}.englishup-auth-message.ok{background:#e8f8ef;color:#176b47}.englishup-auth-message.error{background:#fff0f1;color:#a52c45}.englishup-profile{display:grid;gap:14px;margin-top:20px}.englishup-profile[hidden]{display:none}.englishup-profile-box{background:#f7f5ff;border:1px solid #e5e0f5;border-radius:18px;padding:17px}.englishup-profile-box strong{display:block;font-size:1.15rem}.englishup-profile-box span{display:block;color:#727995;margin-top:3px;overflow-wrap:anywhere}.englishup-role{display:inline-block!important;width:max-content;margin-top:10px!important;background:#e5f7ff;color:#25718e!important;border-radius:999px;padding:4px 9px;font-weight:800;font-size:.82rem}.englishup-auth-note{font-size:.84rem;color:#777e99;margin:0}.englishup-signout{border:0;border-radius:14px;padding:11px 15px;background:#fff0f1;color:#b33650;font-weight:850}.englishup-auth-spinner{opacity:.7;pointer-events:none}@media(max-width:720px){.topbar-inner{gap:10px}.englishup-auth-trigger{padding:7px 10px;font-size:.82rem}.englishup-auth-card{border-radius:21px;padding:20px}}
  `;
  document.head.appendChild(styles);
  styles.textContent += `.englishup-auth-tabs{grid-template-columns:repeat(3,1fr)}.englishup-auth-tabs[hidden]{display:none}.englishup-auth-tab{font-size:.85rem;padding:9px 4px}.englishup-teacher{border-top:1px solid #e5e0f5;padding-top:16px}.englishup-teacher[hidden]{display:none}.englishup-teacher h3{margin:0 0 12px}.englishup-student-row{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #e5e0f5;border-radius:13px;padding:10px;margin-top:9px}.englishup-student-row span{display:block;margin-top:4px;color:#626b88}.englishup-student-row button{border:0;border-radius:10px;padding:9px;background:#ece9ff;color:#4e46aa;font-weight:800;cursor:pointer}@media(max-width:420px){.englishup-student-row{align-items:stretch;flex-direction:column}}`;
  styles.textContent += `.englishup-student-row>div{min-width:0;flex:1}.englishup-results{margin-top:10px}.englishup-results summary{cursor:pointer;color:#5547ce;font-weight:800}.englishup-results ul{list-style:none;margin:8px 0 0;padding:0;max-height:260px;overflow:auto}.englishup-results li{padding:8px 0;border-top:1px solid #ebe7f6;font-size:14px;line-height:1.4}.englishup-results time{display:block;color:#747b98;font-size:12px}`;

  const topbar = document.querySelector('.topbar-inner');
  if (!topbar) return;
  const moduleLabel = topbar.querySelector('.module-label');
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'englishup-auth-trigger';
  trigger.textContent = 'Войти';
  if (moduleLabel) topbar.insertBefore(trigger, moduleLabel);
  else topbar.appendChild(trigger);

  const overlay = document.createElement('div');
  overlay.className = 'englishup-auth-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Личный кабинет');
  overlay.innerHTML = `
    <section class="englishup-auth-card">
      <div class="englishup-auth-head"><div><h2>Личный кабинет</h2><p>Твой профиль в EnglishUp OGE Trainer</p></div><button type="button" class="englishup-auth-close" aria-label="Закрыть">×</button></div>
      <div class="englishup-auth-tabs"><button type="button" class="englishup-auth-tab active" data-auth-tab="login">Учитель</button><button type="button" class="englishup-auth-tab" data-auth-tab="student">Ученик</button><button type="button" class="englishup-auth-tab" data-auth-tab="signup">Регистрация учителя</button></div>
      <form class="englishup-auth-form" data-auth-form="login">
        <label>Email<input name="email" type="email" autocomplete="email" required placeholder="name@example.com"></label>
        <label>Пароль<input name="password" type="password" autocomplete="current-password" minlength="6" required placeholder="Не менее 6 символов"></label>
        <button class="englishup-auth-submit" type="submit">Войти</button>
      </form>
      <form class="englishup-auth-form" data-auth-form="student" hidden>
        <label>Код от учителя<input name="code" autocomplete="off" maxlength="20" required placeholder="Введи свой код"></label>
        <button class="englishup-auth-submit" type="submit">Войти по коду</button>
      </form>
      <form class="englishup-auth-form" data-auth-form="signup" hidden>
        <label>Имя и фамилия<input name="full_name" autocomplete="name" required placeholder="Например, Анна Иванова"></label>
        <label>Email<input name="email" type="email" autocomplete="email" required placeholder="name@example.com"></label>
        <label>Пароль<input name="password" type="password" autocomplete="new-password" minlength="6" required placeholder="Не менее 6 символов"></label>
        <button class="englishup-auth-submit" type="submit">Создать аккаунт</button>
      </form>
      <div class="englishup-auth-message" aria-live="polite"></div>
      <div class="englishup-profile" hidden>
        <div class="englishup-profile-box"><strong data-profile-name></strong><span data-profile-email></span><span class="englishup-role" data-profile-role></span></div>
        <form class="englishup-auth-form" data-role-form><label>Роль в тренажёре<select name="role"><option value="student">Ученик</option><option value="teacher">Учитель</option></select></label><button class="englishup-auth-submit" type="submit">Сохранить роль</button></form>
        <section class="englishup-teacher" hidden>
          <h3>Мои ученики</h3>
          <form class="englishup-auth-form" data-student-form><label>Имя ученика<input name="name" maxlength="80" required placeholder="Например, Алина"></label><button class="englishup-auth-submit" type="submit">Добавить ученика</button></form>
          <div data-student-list aria-live="polite">Загрузка учеников…</div>
        </section>
        <button type="button" class="englishup-signout">Выйти из аккаунта</button>
      </div>
      <div class="englishup-profile" data-student-profile hidden><div class="englishup-profile-box"><strong data-student-name></strong><span>Вход по коду учителя</span></div><button type="button" class="englishup-signout" data-student-signout>Выйти</button></div>
    </section>`;
  document.body.appendChild(overlay);

  const card = overlay.querySelector('.englishup-auth-card');
  const tabs = overlay.querySelector('.englishup-auth-tabs');
  const message = overlay.querySelector('.englishup-auth-message');
  const profile = overlay.querySelector('.englishup-profile');
  const forms = [...overlay.querySelectorAll('[data-auth-form]')];

  trigger.addEventListener('click', openModal);
  overlay.querySelector('.englishup-auth-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  overlay.querySelectorAll('[data-auth-tab]').forEach(button => button.addEventListener('click', () => selectTab(button.dataset.authTab)));
  overlay.querySelector('[data-auth-form="login"]').addEventListener('submit', login);
  overlay.querySelector('[data-auth-form="signup"]').addEventListener('submit', signup);
  overlay.querySelector('[data-auth-form="student"]').addEventListener('submit', loginStudent);
  overlay.querySelector('[data-student-signout]').addEventListener('click', () => { student = null; sessionStorage.removeItem(STUDENT_KEY); render(); });
  overlay.querySelector('[data-role-form]').addEventListener('submit', updateRole);
  overlay.querySelector('[data-student-form]').addEventListener('submit', addStudent);
  overlay.querySelector('.englishup-signout').addEventListener('click', logout);

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { return null; }
  }
  function saveSession(value) {
    session = value;
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else localStorage.removeItem(SESSION_KEY);
  }
  async function api(path, options = {}) {
    const headers = Object.assign({'apikey': SUPABASE_KEY, 'Content-Type': 'application/json'}, options.headers || {});
    const response = await fetch(SUPABASE_URL + path, Object.assign({}, options, {headers}));
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(readableError(data));
    return data;
  }
  function readableError(data) {
    const raw = data.msg || data.message || data.error_description || data.error || 'Не удалось выполнить запрос';
    const map = {
      'Invalid login credentials': 'Неверный email или пароль.',
      'Email not confirmed': 'Сначала подтверди email по ссылке из письма.',
      'User already registered': 'Аккаунт с таким email уже существует.',
      'Password should be at least 6 characters': 'Пароль должен содержать не менее 6 символов.'
    };
    return map[raw] || raw;
  }
  function setBusy(value) { card.classList.toggle('englishup-auth-spinner', value); card.querySelectorAll('button,input,select').forEach(x => x.disabled = value); }
  function showMessage(text, type) { message.textContent = text; message.className = 'englishup-auth-message show ' + type; }
  function clearMessage() { message.textContent = ''; message.className = 'englishup-auth-message'; }
  function selectTab(name) {
    if (profile.hidden === false || overlay.querySelector('[data-student-profile]').hidden === false) return;
    clearMessage();
    overlay.querySelectorAll('[data-auth-tab]').forEach(x => x.classList.toggle('active', x.dataset.authTab === name));
    forms.forEach(x => x.hidden = x.dataset.authForm !== name);
  }
  function openModal() { clearMessage(); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; render(); }
  function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  function storeAuthResponse(data) {
    if (!data.access_token) return false;
    student = null; sessionStorage.removeItem(STUDENT_KEY);
    saveSession({access_token:data.access_token, refresh_token:data.refresh_token, expires_at:Date.now() + ((data.expires_in || 3600) * 1000)});
    user = data.user || null;
    render();
    return true;
  }
  async function login(event) {
    event.preventDefault(); clearMessage();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    try {
      const result = await api('/auth/v1/token?grant_type=password', {method:'POST', body:JSON.stringify({email:data.email.trim(), password:data.password})});
      storeAuthResponse(result); form.reset(); showMessage('Вход выполнен.', 'ok');
    } catch (error) { showMessage(error.message, 'error'); }
    finally { setBusy(false); }
  }
  async function signup(event) {
    event.preventDefault(); clearMessage();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    try {
      const result = await api('/auth/v1/signup', {method:'POST', body:JSON.stringify({email:data.email.trim(), password:data.password, data:{full_name:data.full_name.trim(), role:'teacher'}})});
      if (storeAuthResponse(result)) showMessage('Аккаунт создан, ты уже вошёл.', 'ok');
      else { selectTab('login'); showMessage('Аккаунт создан. Открой письмо от Supabase, подтверди email и затем войди.', 'ok'); }
      form.reset();
    } catch (error) { showMessage(error.message, 'error'); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try { if (session?.access_token) await api('/auth/v1/logout', {method:'POST', headers:{Authorization:'Bearer ' + session.access_token}}); } catch (_) {}
    saveSession(null); user = null; clearMessage(); setBusy(false); render();
  }
  async function loginStudent(event) {
    event.preventDefault(); clearMessage();
    const form = event.currentTarget;
    const code = String(new FormData(form).get('code') || '').trim().toUpperCase();
    setBusy(true);
    try {
      const rows = await api('/rest/v1/rpc/student_login', {method:'POST', body:JSON.stringify({input_code:code})});
      if (!rows?.length) throw new Error('Код не найден. Проверь его у учителя.');
      student = {id:rows[0].id, name:rows[0].name, code};
      sessionStorage.setItem(STUDENT_KEY, JSON.stringify(student));
      form.reset(); render(); showMessage('Добро пожаловать, ' + student.name + '!', 'ok');
    } catch (error) { showMessage(error.message, 'error'); }
    finally { setBusy(false); }
  }
  async function updateRole(event) {
    event.preventDefault(); clearMessage();
    const role = new FormData(event.currentTarget).get('role');
    if (!session?.access_token || !user) return;
    setBusy(true);
    try {
      user = await api('/auth/v1/user', {method:'PUT', headers:{Authorization:'Bearer ' + session.access_token}, body:JSON.stringify({data:Object.assign({}, user.user_metadata || {}, {role})})});
      render(); showMessage('Роль сохранена.', 'ok');
    } catch (error) { showMessage(error.message, 'error'); }
    finally { setBusy(false); }
  }
  async function fetchUser() {
    if (!session?.access_token) return;
    try {
      user = await api('/auth/v1/user', {headers:{Authorization:'Bearer ' + session.access_token}});
      render();
    } catch (_) {
      if (session.refresh_token) {
        try {
          const refreshed = await api('/auth/v1/token?grant_type=refresh_token', {method:'POST', body:JSON.stringify({refresh_token:session.refresh_token})});
          storeAuthResponse(refreshed); return;
        } catch (_) {}
      }
      saveSession(null); user = null; render();
    }
  }
  async function loadStudents() {
    const list = overlay.querySelector('[data-student-list]');
    if (!user || user.user_metadata?.role !== 'teacher') return;
    list.textContent = 'Загрузка учеников…';
    try {
      const rows = await api('/rest/v1/students?select=id,name,access_code&teacher_id=eq.' + encodeURIComponent(user.id) + '&order=created_at.desc', {headers:{Authorization:'Bearer ' + session.access_token}});
      list.replaceChildren();
      if (!rows.length) { list.textContent = 'Пока нет учеников. Добавь первого и передай ему код.'; return; }
      rows.forEach(row => {
        const item = document.createElement('div'); item.className = 'englishup-student-row';
        const details = document.createElement('div');
        const name = document.createElement('strong'); name.textContent = row.name;
        const code = document.createElement('span'); code.textContent = 'Код: ' + row.access_code;
        const progress = document.createElement('span'); progress.textContent = 'Загрузка результатов…';
        details.append(name, code, progress);
        const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Скопировать код';
        copy.addEventListener('click', () => navigator.clipboard.writeText(row.access_code).then(() => showMessage('Код скопирован.', 'ok')).catch(() => showMessage('Выдели и скопируй код вручную.', 'error')));
        item.append(details, copy); list.append(item);
        api('/rest/v1/rpc/teacher_student_results', {method:'POST', headers:{Authorization:'Bearer ' + session.access_token}, body:JSON.stringify({input_student_id:row.id})})
          .then(results => { const count = results.length; const xp = results.reduce((sum, r) => sum + Number(r.xp || 0), 0); progress.textContent = count ? 'Результатов: ' + count + ' · XP: ' + xp : 'Пока нет результатов';
            if (count) {
              const ordered = [...results].sort((a, b) => Date.parse(b.completed_at || 0) - Date.parse(a.completed_at || 0));
              const recent = ordered[0], last = document.createElement('span');
              last.textContent = 'Последний: ' + sectionTitle(recent.section) + ' — ' + recent.score + ' / ' + recent.max_score;
              const history = document.createElement('details'); history.className = 'englishup-results';
              const summary = document.createElement('summary'); summary.textContent = 'Показать все результаты (' + count + ')';
              const entries = document.createElement('ul');
              ordered.forEach(result => {
                const entry = document.createElement('li');
                entry.textContent = sectionTitle(result.section) + (result.variant_number ? ', вариант ' + result.variant_number : '') + ' — ' + result.score + ' / ' + result.max_score;
                if (result.completed_at && !Number.isNaN(Date.parse(result.completed_at))) {
                  const date = document.createElement('time');
                  date.dateTime = result.completed_at;
                  date.textContent = new Date(result.completed_at).toLocaleString('ru-RU', {dateStyle:'short', timeStyle:'short'});
                  entry.append(date);
                }
                entries.append(entry);
              });
              history.append(summary, entries); details.append(last, history);
            }
          }).catch(() => { progress.textContent = 'Результаты пока недоступны'; });
      });
    } catch (error) { list.textContent = 'Не удалось загрузить учеников: ' + error.message; }
  }
  async function addStudent(event) {
    event.preventDefault();
    if (!user || user.user_metadata?.role !== 'teacher') return;
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') || '').trim();
    if (!name) return;
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const access_code = Array.from(bytes, byte => alphabet[byte & 31]).join('');
    try {
      await api('/rest/v1/students', {method:'POST', headers:{Authorization:'Bearer ' + session.access_token, Prefer:'return=minimal'}, body:JSON.stringify({teacher_id:user.id,name,access_code})});
      form.reset(); showMessage('Ученик добавлен. Передай ему код доступа.', 'ok'); await loadStudents();
    } catch (error) { showMessage('Не удалось добавить ученика: ' + error.message, 'error'); }
  }
  function sectionTitle(section) {
    const labels = {listening:'Аудирование',reading:'Чтение',grammar:'Грамматика',letter:'Письмо (самопроверка)',speaking:'Говорение (самопроверка)'};
    return labels[section] || section;
  }
  window.englishupSaveScore = async function(section, variant, score, max, status) {
    if (!student?.code) {
      if (status) status.textContent = 'Для отправки балла войди по коду ученика.';
      return;
    }
    if (status) status.textContent = 'Сохраняем результат Алины…'.replace('Алины', student.name);
    try {
      await api('/rest/v1/rpc/save_student_result', {method:'POST', body:JSON.stringify({input_code:student.code,input_section:section,input_variant_number:variant,input_score:score,input_max_score:max})});
      if (status) status.textContent = 'Результат сохранён для ' + student.name + '. Учитель увидит его в кабинете.';
    } catch (error) {
      if (status) status.textContent = 'Не удалось отправить результат: ' + error.message;
      showMessage('Не удалось отправить результат: ' + error.message, 'error');
    }
  };
  function scoreMeta(key, value) {
    let match = /^oge-mock-(\d+)-(listening|reading|grammar|letter-precheck|speaking-precheck)$/.exec(key);
    if (match) return {section:match[2].replace('-precheck',''), variant:Number(match[1]), score:Number(value), max:{listening:15,reading:13,grammar:15,letter:10,speaking:15}[match[2].replace('-precheck','')]};
    match = /^oge-(reading|listen)-best-(?:[^-]+-)?(\d+)$/.exec(key);
    if (match) return {section:match[1] === 'listen' ? 'listening' : 'reading', variant:Number(match[2])+1, score:Number(value), max:5};
    if (key === 'oge-grammar-best') return {section:'grammar',variant:0,score:Number(value),max:10};
    return null;
  }
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (this !== localStorage || !student?.code) return;
    const result = scoreMeta(String(key), value);
    if (!result || !Number.isFinite(result.score) || result.score < 0 || result.score > result.max) return;
    api('/rest/v1/rpc/save_student_result', {method:'POST',body:JSON.stringify({input_code:student.code,input_section:result.section,input_variant_number:result.variant,input_score:result.score,input_max_score:result.max})})
      .catch(error => { showMessage('Результат пока не отправлен: ' + error.message, 'error'); });
  };
  function render() {
    const signedIn = Boolean(session && user && !student);
    const studentIn = Boolean(student && !signedIn);
    tabs.hidden = signedIn || studentIn;
    forms.forEach(x => x.hidden = signedIn || studentIn || x.dataset.authForm !== 'login');
    profile.hidden = !signedIn;
    overlay.querySelector('[data-student-profile]').hidden = !studentIn;
    if (studentIn) { trigger.classList.add('signed-in'); trigger.textContent = student.name; overlay.querySelector('[data-student-name]').textContent = student.name; return; }
    trigger.classList.toggle('signed-in', signedIn);
    if (!signedIn) { trigger.textContent = 'Войти'; return; }
    const metadata = user.user_metadata || {};
    const name = metadata.full_name || user.email?.split('@')[0] || 'Пользователь';
    const role = metadata.role === 'teacher' ? 'Учитель' : 'Ученик';
    trigger.textContent = name.length > 18 ? name.slice(0, 17) + '…' : name;
    profile.querySelector('[data-profile-name]').textContent = name;
    profile.querySelector('[data-profile-email]').textContent = user.email || '';
    profile.querySelector('[data-profile-role]').textContent = role;
    profile.querySelector('[data-role-form] select').value = metadata.role === 'teacher' ? 'teacher' : 'student';
    const teacher = profile.querySelector('.englishup-teacher');
    teacher.hidden = metadata.role !== 'teacher';
    if (!teacher.hidden) loadStudents();
  }
  function consumeRedirect() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (!params.get('access_token')) return false;
    saveSession({access_token:params.get('access_token'), refresh_token:params.get('refresh_token'), expires_at:Date.now() + (Number(params.get('expires_in') || 3600) * 1000)});
    history.replaceState(null, '', location.pathname + location.search);
    return true;
  }

  consumeRedirect();
  render();
  fetchUser();
})();
