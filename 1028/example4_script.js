// example4_script.js
// 無障礙表單：錯誤即時提示、aria-live、錯誤自動聚焦、aria-invalid 標示、字數計數

const form = document.getElementById('access-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const msgInput = document.getElementById('message');
const nameErr = document.getElementById('name-error');
const ageErr = document.getElementById('age-error');
const msgCount = document.getElementById('message-count');
const submitBtn = document.getElementById('submit-btn');

const fields = [
  { input: nameInput, error: nameErr, validate: validateName },
  { input: ageInput,  error: ageErr,  validate: validateAge  }
];

// —— 驗證函式 —— //
function validateName() {
  const input = nameInput;
  let message = '';
  if (input.validity.valueMissing) {
    message = '此欄位為必填。';
  }
  applyValidity(input, nameErr, message);
  return !message;
}

function validateAge() {
  const input = ageInput;
  let message = '';
  if (input.validity.valueMissing) {
    message = '此欄位為必填。';
  } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
    message = `請輸入 ${input.min} 到 ${input.max} 之間的數字。`;
  }
  applyValidity(input, ageErr, message);
  return !message;
}

// 套用錯誤狀態：訊息、aria-invalid、Bootstrap 樣式
function applyValidity(input, errorEl, message) {
  input.setCustomValidity(message);
  errorEl.textContent = message;
  const invalid = Boolean(message);
  input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  input.classList.toggle('is-invalid', invalid);
  input.classList.toggle('is-valid', !invalid);
}

// 即時輸入時：若原本有錯再檢查；失焦時一定檢查
fields.forEach(({ input, validate }) => {
  input.addEventListener('input', () => {
    if (input.validationMessage) validate();
  });
  input.addEventListener('blur', validate);
});

// 留言字數計數（可及性：aria-live polite）
msgInput.addEventListener('input', () => {
  msgCount.textContent = `已輸入 ${msgInput.value.length} / 200`;
});

// 送出：逐欄驗證、聚焦第一個錯誤、成功後重置
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let firstInvalid = null;
  fields.forEach(({ input, validate }) => {
    const ok = validate();
    if (!ok && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // 模擬送出：防連點
  submitBtn.disabled = true;
  alert('表單送出成功');
  form.reset();
  msgCount.textContent = '已輸入 0 / 200';

  // 清除狀態
  [nameInput, ageInput].forEach((el) => {
    el.removeAttribute('aria-invalid');
    el.classList.remove('is-valid', 'is-invalid');
  });
  nameErr.textContent = '';
  ageErr.textContent = '';
  submitBtn.disabled = false;
});