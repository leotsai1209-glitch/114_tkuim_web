// example5_script.js
// 攔截 submit：驗證 → 聚焦並平滑捲動到第一個錯誤 → 模擬送出
const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agree = document.getElementById('agree');
const content = document.getElementById('content');
const contentCount = document.getElementById('content-count');
const msgBox = document.getElementById('msg');

// 全形轉半形並去除多餘空白
function normalize(str) {
  return str.normalize('NFKC').replace(/\s+/g, ' ').trim();
}

// 即時字數
function updateCount() {
  contentCount.textContent = `${content.value.length} / ${content.getAttribute('maxlength')}`;
}
updateCount();
content.addEventListener('input', updateCount);

// 勾選同意才能送出
agree.addEventListener('change', () => {
  submitBtn.disabled = !agree.checked;
});

// 逐一檢查，回傳第一個無效控制項
function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));

  controls.forEach((control) => {
    // 清除舊狀態
    control.classList.remove('is-invalid');

    // 資料清理（text/textarea）
    if (control.tagName === 'TEXTAREA' || (control.tagName === 'INPUT' && control.type === 'text')) {
      const cleaned = normalize(control.value || '');
      if (control.value !== cleaned) control.value = cleaned;
    }

    // 內建驗證
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) firstInvalid = control;
    }
  });

  return firstInvalid;
}

// 平滑帶到錯誤欄位
function focusAndScroll(el) {
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  msgBox.innerHTML = '';
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    focusAndScroll(firstInvalid);
    return;
  }

  // 模擬非同步送出
  await new Promise((r) => setTimeout(r, 1000));
  msgBox.innerHTML = `<div class="alert alert-success">資料已送出，感謝您的聯絡！</div>`;

  form.reset();
  updateCount();
  // 清除樣式
  Array.from(form.elements).forEach((el) => el.classList && el.classList.remove('is-invalid'));
  submitBtn.disabled = true; // reset 後需重新勾選同意
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  updateCount();
  msgBox.innerHTML = '';
  Array.from(form.elements).forEach((el) => el.classList && el.classList.remove('is-invalid'));
  submitBtn.disabled = true;
});

// 即時移除錯誤外觀
form.addEventListener('input', (event) => {
  const t = event.target;
  if (t.classList && t.classList.contains('is-invalid') && t.checkValidity()) {
    t.classList.remove('is-invalid');
  }
});