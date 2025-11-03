// Week07_Lab / signup_form.js
// 事件委派（興趣標籤）、即時驗證（blur/input）、自訂訊息、可及性、送出攔截、防重送
// 加分：密碼強度條 + localStorage 暫存 + 重設

const form = document.getElementById('signup-form');
const msgBox = document.getElementById('msg');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const pwdInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const tagsWrap = document.getElementById('tags');
const agreeInput = document.getElementById('agree');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

const pwdBar = document.getElementById('strength-bar');
const pwdText = document.getElementById('strength-text');

// --- 工具：錯誤套用 ---
function setError(input, message, errorId) {
  const errorEl = document.getElementById(errorId);
  input.setCustomValidity(message);
  errorEl.textContent = message;
  const invalid = Boolean(message);
  input.classList.toggle('is-invalid', invalid);
  input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
}

// --- 规范化：全形轉半形 + 去空白 ---
function normalize(str) {
  return (str || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
}

// --- 密碼強度 ---
function scorePassword(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++; // 符號
  return s; // 0~4
}
function renderStrength(pw) {
  const s = scorePassword(pw);
  const widths = ['0%','25%','50%','75%','100%'];
  const classes = ['bg-danger','bg-danger','bg-warning','bg-info','bg-success'];
  const labels  = ['太弱','偏弱','普通','良好','強'];

  pwdBar.className = 'progress-bar ' + classes[s];
  pwdBar.style.width = widths[s];
  pwdText.textContent = pw ? `密碼強度：${labels[s]}（${s}/4）` : '';
}

// --- 欄位驗證 ---
function validateName() {
  const v = normalize(nameInput.value);
  if (nameInput.value !== v) nameInput.value = v;
  let msg = '';
  if (!v) msg = '此欄位必填。';
  setError(nameInput, msg, 'name-error');
  return !msg;
}

function validateEmail() {
  const v = normalize(emailInput.value);
  if (emailInput.value !== v) emailInput.value = v;
  let msg = '';
  if (!v) msg = '此欄位必填。';
  else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) msg = 'Email 格式不正確。';
  }
  setError(emailInput, msg, 'email-error');
  return !msg;
}

function validatePhone() {
  const v = normalize(phoneInput.value).replace(/\s/g, '');
  if (phoneInput.value !== v) phoneInput.value = v;
  let msg = '';
  if (!v) msg = '此欄位必填。';
  else if (!/^09\d{8}$/.test(v)) msg = '請輸入 09 開頭的 10 碼手機。';
  setError(phoneInput, msg, 'phone-error');
  return !msg;
}

function validatePassword() {
  const raw = pwdInput.value;
  const v = normalize(raw);
  if (raw !== v) pwdInput.value = v;
  let msg = '';
  const hasLetter = /[A-Za-z]/.test(v);
  const hasNumber = /\d/.test(v);
  if (!v) msg = '此欄位必填。';
  else if (v.length < 8) msg = '密碼至少需 8 碼。';
  else if (!hasLetter || !hasNumber) msg = '請同時包含英文字母與數字。';

  setError(pwdInput, msg, 'password-error');
  renderStrength(v);
  return !msg;
}

function validateConfirm() {
  const v = normalize(confirmInput.value);
  if (confirmInput.value !== v) confirmInput.value = v;
  let msg = '';
  if (!v) msg = '請再次輸入密碼。';
  else if (v !== pwdInput.value) msg = '兩次輸入的密碼不一致。';
  setError(confirmInput, msg, 'confirm-error');
  return !msg;
}

function validateTags() {
  const boxes = tagsWrap.querySelectorAll('input[type="checkbox"]');
  const anyChecked = Array.from(boxes).some(b => b.checked);
  const err = document.getElementById('tags-error');
  err.textContent = anyChecked ? '' : '請至少勾選 1 個興趣。';
  tagsWrap.dataset.invalid = anyChecked ? 'false' : 'true';
  return anyChecked;
}

function validateAgree() {
  const err = document.getElementById('agree-error');
  const ok = agreeInput.checked;
  err.textContent = ok ? '' : '須同意服務條款才能送出。';
  return ok;
}

// --- 事件委派：興趣標籤（切換樣式/計數） ---
tagsWrap.addEventListener('click', (e) => {
  const label = e.target.closest('.tag-item');
  if (!label) return;
  const box = label.querySelector('input[type="checkbox"]');
  if (!box) return;
  box.checked = !box.checked; // 手動切換（為了確保點 label 外圍也能切）
  label.classList.toggle('btn-outline-secondary', !box.checked);
  label.classList.toggle('btn-secondary', box.checked);
  validateTags();
});

// --- 即時驗證策略：blur 後顯示、input 時更新 ---
const touched = new Set();
function wireLiveValidation(input, validateFn, id) {
  input.addEventListener('blur', () => {
    touched.add(id);
    validateFn();
    if (id === 'password' && touched.has('confirm')) validateConfirm();
  });
  input.addEventListener('input', () => {
    if (!touched.has(id)) return;
    validateFn();
    if (id === 'password' && touched.has('confirm')) validateConfirm();
  });
}

wireLiveValidation(nameInput, validateName, 'name');
wireLiveValidation(emailInput, validateEmail, 'email');
wireLiveValidation(phoneInput, validatePhone, 'phone');
wireLiveValidation(pwdInput, validatePassword, 'password');
wireLiveValidation(confirmInput, validateConfirm, 'confirm');

// 密碼強度即時顯示
pwdInput.addEventListener('input', () => renderStrength(pwdInput.value));

// --- localStorage 暫存（加分） ---
const LS_KEY = 'week07_signup';
function saveDraft() {
  const data = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    password: pwdInput.value,
    confirm: confirmInput.value,
    tags: Array.from(tagsWrap.querySelectorAll('input[type="checkbox"]')).map(b => b.checked),
    agree: agreeInput.checked
  };
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function loadDraft() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (d.name) nameInput.value = d.name;
    if (d.email) emailInput.value = d.email;
    if (d.phone) phoneInput.value = d.phone;
    if (d.password) pwdInput.value = d.password;
    if (d.confirm) confirmInput.value = d.confirm;

    const boxes = tagsWrap.querySelectorAll('input[type="checkbox"]');
    if (Array.isArray(d.tags)) {
      boxes.forEach((b, i) => {
        b.checked = !!d.tags[i];
        const label = b.closest('.tag-item');
        if (!label) return;
        label.classList.toggle('btn-outline-secondary', !b.checked);
        label.classList.toggle('btn-secondary', b.checked);
      });
    }

    if (typeof d.agree === 'boolean') agreeInput.checked = d.agree;

    // 帶出強度條
    renderStrength(pwdInput.value);
  } catch {}
}
['input','change'].forEach(ev => form.addEventListener(ev, saveDraft));
loadDraft();

// --- 送出攔截 + 防重送 ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgBox.innerHTML = '';

  // 全面驗證
  const ok =
    validateName() &
    validateEmail() &
    validatePhone() &
    validatePassword() &
    validateConfirm() &
    validateTags() &
    validateAgree();

  // 聚焦第一個錯誤
  if (!validateName()) return nameInput.focus();
  if (!validateEmail()) return emailInput.focus();
  if (!validatePhone()) return phoneInput.focus();
  if (!validatePassword()) return pwdInput.focus();
  if (!validateConfirm()) return confirmInput.focus();
  if (!validateTags()) return tagsWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (!validateAgree()) return agreeInput.focus();

  // 防重送
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  const oldText = submitBtn.textContent;
  submitBtn.textContent = '送出中...';

  // 模擬 1s 送出
  await new Promise(r => setTimeout(r, 1000));

  msgBox.innerHTML = `<div class="alert alert-success">註冊成功！已收到您的資料。</div>`;

  // 收尾：清空、狀態回復、清除草稿
  form.reset();
  localStorage.removeItem(LS_KEY);
  touched.clear();
  [nameInput, emailInput, phoneInput, pwdInput, confirmInput].forEach(i => {
    i.classList.remove('is-invalid');
    i.removeAttribute('aria-invalid');
  });
  document.getElementById('name-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('phone-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('confirm-error').textContent = '';
  document.getElementById('tags-error').textContent = '';
  document.getElementById('agree-error').textContent = '';
  renderStrength('');

  // 還原按鈕
  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
  submitBtn.textContent = oldText;
});

// 重設按鈕：清欄位 + 錯誤 + 強度 + 草稿
resetBtn.addEventListener('click', () => {
  form.reset();
  localStorage.removeItem(LS_KEY);
  msgBox.innerHTML = '';
  touched.clear();
  [nameInput, emailInput, phoneInput, pwdInput, confirmInput].forEach(i => {
    i.classList.remove('is-invalid');
    i.removeAttribute('aria-invalid');
  });
  // 清興趣樣式
  tagsWrap.querySelectorAll('.tag-item').forEach(label => {
    label.classList.add('btn-outline-secondary');
    label.classList.remove('btn-secondary');
  });
  document.getElementById('name-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('phone-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('confirm-error').textContent = '';
  document.getElementById('tags-error').textContent = '';
  document.getElementById('agree-error').textContent = '';
  renderStrength('');
});