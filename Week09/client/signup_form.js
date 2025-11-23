// client/signup_form.js
const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');

// 送出報名（POST /api/signup）
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  // 後端需要的額外欄位（簡化版 demo）
  payload.password = 'demoPass88';
  payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門'];
  payload.terms = true;

  try {
    resultEl.textContent = '送出中...';

    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '報名失敗');
    }

    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    resultEl.textContent = `❌ 錯誤：${error.message}`;
  }
});

// 查看報名清單（GET /api/signup）
const getListBtn = document.querySelector('#get-list');
getListBtn.addEventListener('click', async () => {
  try {
    resultEl.textContent = '加載中...';
    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();
    resultEl.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultEl.textContent = '❌ 無法取得清單';
  }
});

// 取消報名（DELETE /api/signup/:id）
const cancelIdInput = document.querySelector('#cancel-id');
const cancelBtn = document.querySelector('#cancel-btn');

cancelBtn.addEventListener('click', async () => {
  const id = cancelIdInput.value.trim();
  if (!id) {
    resultEl.textContent = '請先輸入要取消的 id（從清單複製）';
    return;
  }

  try {
    resultEl.textContent = '取消中...';

    const res = await fetch(`http://localhost:3001/api/signup/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '取消失敗');
    }

    resultEl.textContent = JSON.stringify(data, null, 2);
    cancelIdInput.value = '';
  } catch (error) {
    resultEl.textContent = `❌ ${error.message}`;
  }
});