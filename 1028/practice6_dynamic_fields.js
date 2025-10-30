// practice6_dynamic_fields.js
// 動態新增報名欄位 + 事件委派 + 即時驗證 + 送出攔截 + 人數上限 + 防重送

const form = document.getElementById('dynamic-form');
const list = document.getElementById('participant-list');
const addBtn = document.getElementById('add-participant');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const countLabel = document.getElementById('count');

const maxParticipants = 5;
let participantIndex = 0;

// 建立一張參與者卡片
function createParticipantCard() {
  const index = participantIndex++;
  const wrapper = document.createElement('div');
  wrapper.className = 'participant card border-0 shadow-sm';
  wrapper.dataset.index = index;

  wrapper.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="card-title mb-0">參與者 ${index + 1}</h5>
        <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove">移除</button>
      </div>

      <div class="mb-3">
        <label class="form-label" for="name-${index}">姓名</label>
        <input id="name-${index}" name="name-${index}" class="form-control"
               type="text" required aria-describedby="name-${index}-error" aria-invalid="false">
        <p id="name-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>

      <div class="mb-0">
        <label class="form-label" for="email-${index}">Email</label>
        <input id="email-${index}" name="email-${index}" class="form-control"
               type="email" inputmode="email" required
               aria-describedby="email-${index}-error" aria-invalid="false">
        <p id="email-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
    </div>
  `;
  return wrapper;
}

// 更新人數與新增按鈕狀態
function updateCount() {
  countLabel.textContent = list.children.length;
  addBtn.disabled = list.children.length >= maxParticipants;
}

// 設定錯誤訊息與樣式
function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  const invalid = Boolean(message);
  input.classList.toggle('is-invalid', invalid);
  input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
}

// 驗證單一欄位
function validateInput(input) {
  const value = input.value.trim();
  if (!value) {
    setError(input, '此欄位必填');
    return false;
  }
  if (input.type === 'email') {
    // 基本 Email 檢查（避免過度嚴格）
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(input, 'Email 格式不正確');
      return false;
    }
  }
  setError(input, '');
  return true;
}

// 新增一位參與者
function handleAddParticipant() {
  if (list.children.length >= maxParticipants) return;
  const participant = createParticipantCard();
  list.appendChild(participant);
  updateCount();
  // 聚焦到新增卡片的第一個輸入框
  participant.querySelector('input').focus();
}

// —— 事件綁定 —— //

// 新增
addBtn.addEventListener('click', handleAddParticipant);

// 委派：移除
list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) return;
  const participant = button.closest('.participant');
  participant?.remove();
  updateCount();
  // 重新標號（僅更新標題顯示，不改 id）
  Array.from(list.querySelectorAll('.participant .card-title')).forEach((h5, i) => {
    h5.textContent = `參與者 ${i + 1}`;
  });
});

// 委派：失焦驗證（true=使用捕獲階段才能抓到子元素 blur）
list.addEventListener('blur', (event) => {
  if (event.target.matches('input')) validateInput(event.target);
}, true);

// 委派：即時輸入 -> 若本來有錯才即時再驗
list.addEventListener('input', (event) => {
  if (!event.target.matches('input')) return;
  if (event.target.validationMessage || event.target.classList.contains('is-invalid')) {
    validateInput(event.target);
  }
});

// 送出攔截：至少一位、全數通過、聚焦第一個錯誤
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (list.children.length === 0) {
    alert('請至少新增一位參與者');
    handleAddParticipant();
    return;
  }

  let firstInvalid = null;
  list.querySelectorAll('input').forEach((input) => {
    const ok = validateInput(input);
    if (!ok && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // 防重送
  addBtn.disabled = true;
  submitBtn.disabled = true;
  resetBtn.disabled = true;
  const oldText = submitBtn.textContent;
  submitBtn.textContent = '送出中...';

  // 模擬非同步送出
  await new Promise((resolve) => setTimeout(resolve, 1000));

  alert('表單已送出！');

  // 還原表單
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();

  addBtn.disabled = false;
  submitBtn.disabled = false;
  resetBtn.disabled = false;
  submitBtn.textContent = oldText;
});

// 重設
resetBtn.addEventListener('click', () => {
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  addBtn.disabled = false;
});

// 預設先放一筆，方便操作
handleAddParticipant();