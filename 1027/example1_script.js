// example1_script.js
// 使用事件委派：處理新增、刪除、完成切換、統計更新

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const stats = document.getElementById('stats');

// 🔹 更新統計資訊
function updateStats() {
  const total = list.querySelectorAll('li').length;
  const done = list.querySelectorAll('.list-group-item-success').length;
  stats.textContent = `總項目：${total}　已完成：${done}`;
}

// 🔹 新增項目
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `
    ${value}
    <div>
      <button class="btn btn-sm btn-outline-success me-2" data-action="done">完成</button>
      <button class="btn btn-sm btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  list.appendChild(item);
  input.value = '';
  input.focus();
  updateStats();
});

// 🔹 委派事件：處理「刪除」與「完成」
list.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  const action = target.dataset.action;
  const item = target.closest('li');
  if (!item) return;

  if (action === 'remove') {
    item.remove();
  } else if (action === 'done') {
    item.classList.toggle('list-group-item-success');
  }
  updateStats();
});

// 🔹 監聽 Enter（其實表單 submit 已自動支援，但這裡示範 keyup）
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    form.requestSubmit(); // 模擬送出表單
  }
});

// 初始化統計
updateStats();