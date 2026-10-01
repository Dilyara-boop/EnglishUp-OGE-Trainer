(function () {
  'use strict';
  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;

  function activeScope() {
    try {
      const student = JSON.parse(sessionStorage.getItem('englishup-student-session') || 'null');
      if (student && /^[0-9a-f-]{36}$/i.test(student.id)) return 'student:' + student.id;
    } catch (_) {}
    try {
      const session = JSON.parse(nativeGet.call(localStorage, 'englishup-auth-session') || 'null');
      const payload = session?.access_token?.split('.')[1];
      if (payload) {
        const jwt = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        if (jwt.sub) return 'teacher:' + jwt.sub;
      }
    } catch (_) {}
    return 'guest';
  }

  function scopedKey(storage, key) {
    const name = String(key);
    return storage === localStorage && name.startsWith('oge-')
      ? 'englishup-progress:' + activeScope() + ':' + name
      : name;
  }

  Storage.prototype.getItem = function (key) { return nativeGet.call(this, scopedKey(this, key)); };
  Storage.prototype.setItem = function (key, value) { return nativeSet.call(this, scopedKey(this, key), value); };
  Storage.prototype.removeItem = function (key) { return nativeRemove.call(this, scopedKey(this, key)); };
})();
