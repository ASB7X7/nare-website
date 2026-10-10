'use strict';
(() => {
  const form = document.querySelector('#fortune-form');
  if (!form) return;
  const input = document.querySelector('#fortune-file');
  const consent = document.querySelector('#fortune-consent');
  const submit = document.querySelector('#fortune-submit');
  const status = document.querySelector('#fortune-status');
  const preview = document.querySelector('#fortune-preview');
  const photo = document.querySelector('#fortune-photo');
  const answer = document.querySelector('#fortune-answer');
  const placeholder = document.querySelector('#fortune-placeholder');
  const copy = document.querySelector('#fortune-copy');
  const remove = document.querySelector('#fortune-remove');
  const result = document.querySelector('.fortune-result');
  const config = (window.NARE_FORTUNE_API || '').replace(/\/$/, '');
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  let api = '';
  try {
    const url = new URL(config || (local ? location.origin : ''));
    if (url.protocol === 'https:' || (local && url.origin === location.origin)) api = url.origin;
  } catch { /* Keep unavailable until a valid backend is configured. */ }
  let file = null, objectURL = '', ready = false, busy = false, selection = 0;
  const update = () => { submit.disabled = !ready || !file || !consent.checked || busy; };
  const say = (text) => { status.textContent = text; };
  const clearResult = () => { answer.textContent = ''; answer.hidden = true; copy.hidden = true; placeholder.hidden = false; };
  function clearPhoto(resetInput = true) {
    selection++;
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = ''; file = null; photo.removeAttribute('src'); preview.hidden = true;
    if (resetInput) input.value = '';
    update();
  }
  async function checkService() {
    if (!api) return;
    try {
      const res = await fetch(`${api}/api/fortune/status`, { signal: AbortSignal.timeout(12000), credentials: 'omit' });
      const data = await res.json();
      ready = res.ok && data.ready === true;
      say(ready ? 'Выберите фото и подтвердите его отправку, чтобы начать.' : 'Гадание ещё подключается. Фотография остаётся на вашем устройстве.');
    } catch { say('Сервис пока недоступен. Можно обновить страницу и попробовать позже.'); }
    update();
  }
  input.addEventListener('change', async () => {
    const candidate = input.files[0];
    clearPhoto(false); clearResult();
    if (!candidate) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(candidate.type) || !candidate.size || candidate.size > 5 * 1024 * 1024) {
      say('Выберите JPG, PNG или WebP размером до 5 МБ.'); return;
    }
    const current = selection;
    objectURL = URL.createObjectURL(candidate);
    photo.src = objectURL;
    try { await photo.decode(); } catch {
      if (current === selection) { clearPhoto(); say('Не удалось открыть фотографию. Попробуйте другой файл.'); }
      return;
    }
    if (current !== selection) return;
    if (photo.naturalWidth * photo.naturalHeight > 40000000) { clearPhoto(); say('Уменьшите фотографию до 40 мегапикселей или меньше.'); return; }
    file = candidate; preview.hidden = false;
    say(ready ? 'Фотография готова. Нажмите «Прочитать мою чашку».' : 'Предпросмотр готов. Отправка станет доступна после подключения гадания.');
    update();
  });
  remove.addEventListener('click', () => { clearPhoto(); clearResult(); say(ready ? 'Выберите новую фотографию.' : 'Гадание ещё подключается.'); input.focus(); });
  consent.addEventListener('change', update);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !ready || !file || !consent.checked) return;
    busy = true; input.disabled = true; consent.disabled = true; remove.disabled = true;
    result.setAttribute('aria-busy', 'true'); clearResult(); update();
    say('Читаем узоры вашей чашки. Это может занять до двух минут…');
    placeholder.textContent = 'Рассматриваем линии, силуэты и маленькие знаки…';
    try {
      const res = await fetch(`${api}/api/fortune`, {
        method: 'POST', headers: { 'Content-Type': file.type, 'X-Nare-Consent': 'yes' },
        body: file, credentials: 'omit', signal: AbortSignal.timeout(130000)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось получить чтение. Попробуйте позже.');
      if (typeof data.reading !== 'string' || !data.reading.trim()) throw new Error('Ответ оказался пустым. Попробуйте позже.');
      // Plain text deliberately prevents model output from creating HTML or links.
      answer.textContent = data.reading; answer.hidden = false; copy.hidden = false; placeholder.hidden = true;
      say('Послание готово. Можно сохранить его или выбрать другую фотографию.');
      document.querySelector('#fortune-result-title').focus({ preventScroll: true });
    } catch (error) {
      say(error.name === 'TimeoutError' ? 'Ожидание истекло. Ответ не получен; не отправляйте фото повторно сразу.' : error instanceof TypeError ? 'Связь с сервисом прервалась. Попробуйте позже.' : error.message);
      placeholder.textContent = 'Чтение не завершилось. Здесь появится ответ после успешной отправки.';
    } finally {
      busy = false; input.disabled = false; consent.disabled = false; remove.disabled = false;
      result.setAttribute('aria-busy', 'false'); update();
    }
  });
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(answer.textContent); say('Послание скопировано.'); }
    catch { say('Не удалось скопировать автоматически. Выделите текст послания вручную.'); }
  });
  checkService();
})();
