// example3_script.js
// 密碼強度 + 即時驗證 + 全形轉半形修正

const form = document.getElementById('signup-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm');
const passwordError = document.getElementById('password-error');
const confirmError = document.getElementById('confirm-error');
const bar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

const touched = new Set();

// 將全形轉半形並去空白
function normalize(str) {
  return str.normalize('NFKC').replace(/\s+/g, '');
}

// 密碼強度分數
function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

// 更新強度條
function renderStrength(pw) {
  const s = scorePassword(pw);
  const widths = ['0%', '25%', '50%', '75%', '100%'];
  const classes = ['bg-danger','bg-danger','bg-warning','bg-info','bg-success'];
  const labels  = ['太弱','偏弱','普通','良好','強'];

  bar.className = 'progress-bar ' + classes[s];
  bar.style.width = widths[s];
  strengthText.textContent = pw ? `強度：${labels[s]}（${s}/4）` : '';
}

// 顏色提示
function setFieldState(input, ok) {
  input.classList.toggle('is-invalid', !ok);
  input.classList.toggle('is-valid', ok);
}

// 驗證密碼
function validatePassword() {
  const raw = password.value;
  const value = normalize(raw);
  if (raw !== value) password.value = value;

  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  let message = '';

  if (!value) {
    message = '請輸入密碼。';
  } else if (value.length < 8) {
    message = '密碼至少需 8 碼。';
  } else if (!hasLetter || !hasNumber) {
    message = '請同時包含英文字母與數字。';
  }

  password.setCustomValidity(message);
  passwordError.textContent = message;
  setFieldState(password, !message);
  renderStrength(value);
  return !message;
}

// 驗證確認密碼
function validateConfirm() {
  const passwordValue = password.value.trim();
  const confirmValue = confirmPassword.value.trim();
  let message = '';

  if (!confirmValue) {
    message = '請再次輸入密碼。';
  } else if (passwordValue !== confirmValue) {
    message = '兩次輸入的密碼不一致。';
  }

  confirmPassword.setCustomValidity(message);
  confirmError.textContent = message;
  setFieldState(confirmPassword, !message);
  return !message;
}

// 記錄被操作過的欄位
function handleBlur(event) {
  touched.add(event.target.id);
  runValidation(event.target.id);
}

// 即時輸入後驗證
function handleInput(event) {
  if (!touched.has(event.target.id)) return;
  runValidation(event.target.id);
}

function runValidation(fieldId) {
  if (fieldId === 'password') {
    validatePassword();
    if (touched.has('confirm')) validateConfirm();
  }
  if (fieldId === 'confirm') {
    validateConfirm();
  }
}

// 綁定事件
[password, confirmPassword].forEach((input) => {
  input.addEventListener('blur', handleBlur);
  input.addEventListener('input', handleInput);
});

// 即時強度更新
password.addEventListener('input', () => renderStrength(password.value));

// 表單送出
form.addEventListener('submit', (event) => {
  event.preventDefault();
  touched.add('password');
  touched.add('confirm');
  const passwordOk = validatePassword();
  const confirmOk = validateConfirm();

  if (passwordOk && confirmOk) {
    alert('註冊成功');
    form.reset();
    passwordError.textContent = '';
    confirmError.textContent = '';
    strengthText.textContent = '';
    bar.style.width = '0%';
    bar.className = 'progress-bar';
    touched.clear();
    password.classList.remove('is-valid', 'is-invalid');
    confirmPassword.classList.remove('is-valid', 'is-invalid');
  }
});