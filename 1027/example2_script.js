// example2_script.js
// 驗證 Email 與手機欄位，並加入即時提示與成功訊息顯示

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const messageBox = document.getElementById('message');

function showValidity(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title || '格式不正確');
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

// 🔹 表單送出驗證
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);

  if (emailOk && phoneOk) {
    messageBox.innerHTML = `
      <div class="alert alert-success fade show">
        ✅ 表單驗證成功！資料已送出。
      </div>`;
    form.reset();
  } else {
    messageBox.innerHTML = `
      <div class="alert alert-warning fade show">
        ⚠️ 尚有欄位未正確填寫，請檢查輸入格式。
      </div>`;
  }
});

// 🔹 blur（離開欄位時）檢查
email.addEventListener('blur', () => showValidity(email));
phone.addEventListener('blur', () => showValidity(phone));

// 🔹 keyup（即時輸入檢查）
email.addEventListener('keyup', () => showValidity(email));
phone.addEventListener('keyup', () => showValidity(phone));

// 🔹 Reset 清除訊息
form.addEventListener('reset', () => {
  messageBox.innerHTML = '';
});