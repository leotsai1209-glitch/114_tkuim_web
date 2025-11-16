// ====== 房型資料 ======
const ROOMS = [
  { id: 1, type: 'standard', title: '標準房', price: 2500, breakfast: false, img: 'assets/1.jpg' },
  { id: 2, type: 'deluxe', title: '豪華房', price: 3500, breakfast: true, img: 'assets/2.jpg' },
  { id: 3, type: 'suite', title: '套房', price: 5200, breakfast: true, img: 'assets/3.jpg' },
  { id: 4, type: 'standard', title: '標準雙床', price: 2700, breakfast: false, img: 'assets/4.jpg' },
  { id: 5, type: 'deluxe', title: '海景豪華房', price: 4200, breakfast: true, img: 'assets/5.jpg' }
];

// ====== DOM 元素 ======
const grid = document.getElementById('room-grid');
const roomCount = document.getElementById('room-count');
const filterType = document.getElementById('filter-type');
const filterBreakfast = document.getElementById('filter-breakfast');
const filterPrice = document.getElementById('filter-price');
const filterReset = document.getElementById('filter-reset');
const showFavs = document.getElementById('show-favs');
const clearFavs = document.getElementById('clear-favs');

const bookingForm = document.getElementById('booking-form');
const guestName = document.getElementById('guestName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const roomType = document.getElementById('roomType');
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');
const rooms = document.getElementById('rooms');
const adults = document.getElementById('adults');
const children = document.getElementById('children');
const breakfast = document.getElementById('breakfast');
const note = document.getElementById('note');
const noteCount = document.getElementById('note-count');
const agree = document.getElementById('agree');
const priceEl = document.getElementById('price');
const bookBtn = document.getElementById('book-btn');
const resetBtn = document.getElementById('reset-btn');
const formMsg = document.getElementById('form-msg');

// ====== 成為會員區 DOM ======
const memberForm = document.getElementById('member-form');
const mEmail = document.getElementById('m-email');
const mPassword = document.getElementById('m-password');
const pwBar = document.getElementById('pw-strength');
const pwText = document.getElementById('pw-strength-text');

// ====== 收藏功能 ======
const LS_FAV = 'hotel_favs';
const getFav = () => JSON.parse(localStorage.getItem(LS_FAV) || '[]');
const setFav = (arr) => localStorage.setItem(LS_FAV, JSON.stringify(arr));
let onlyFav = false;

// ====== 工具函式 ======
function normalize(s) { return (s || '').normalize('NFKC').trim(); }

function setErr(input, msg, id) {
  const el = document.getElementById(id);
  input.setCustomValidity(msg);
  el.textContent = msg;
  input.classList.toggle('is-invalid', !!msg);
}

function nightsBetween(ci, co) {
  const a = new Date(ci), b = new Date(co);
  const ms = b - a;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function getSelectedRoom() {
  const id = Number(roomType.value);
  return ROOMS.find(r => r.id === id) || null;
}

// ====== 房型顯示與篩選 ======
function renderRoomOptions() {
  ROOMS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.title}（NT$ ${r.price}/晚${r.breakfast ? '・含早' : ''}）`;
    roomType.appendChild(opt);
  });
}

function renderRooms() {
  grid.innerHTML = '';
  const favs = getFav();
  const tp = filterType.value;
  const bf = filterBreakfast.value;
  const maxP = Number(filterPrice.value) || Infinity;

  const data = ROOMS.filter(r =>
    (!tp || r.type === tp) &&
    (bf === '' || (bf === '1' ? r.breakfast : !r.breakfast)) &&
    r.price <= maxP &&
    (!onlyFav || favs.includes(r.id))
  );

  data.forEach(r => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100 card-hover">
        <img src="${r.img}" class="card-img-top" alt="${r.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${r.title}</h5>
          <p class="text-muted small mb-2">${r.breakfast ? '含早餐' : '不含早餐'}・NT$ ${r.price}/晚</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-primary" data-action="book" data-id="${r.id}">立即訂</button>
            <button class="btn btn-sm btn-link fav-btn ${favs.includes(r.id) ? 'active' : ''}"
                    data-action="fav" data-id="${r.id}">收藏</button>
          </div>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  roomCount.textContent = `${data.length} 間`;
}

// 收藏與立即訂事件
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const act = btn.dataset.action;

  if (act === 'fav') {
    const favs = getFav();
    const i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1); else favs.push(id);
    setFav(favs);
    renderRooms();
  }

  if (act === 'book') {
    roomType.value = String(id);
    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
    guestName.focus();
    calcPrice();
  }
});

// 篩選器事件
[filterType, filterBreakfast].forEach(el => el.addEventListener('change', renderRooms));
filterPrice.addEventListener('input', renderRooms);
filterReset.addEventListener('click', () => { 
  filterType.value=''; 
  filterBreakfast.value=''; 
  filterPrice.value=''; 
  renderRooms(); 
});
showFavs.addEventListener('click', () => { 
  onlyFav = !onlyFav; 
  showFavs.classList.toggle('btn-primary', onlyFav); 
  renderRooms(); 
});
clearFavs.addEventListener('click', () => { 
  setFav([]); 
  renderRooms(); 
});

// ====== 即時計價 ======
rooms.value = rooms.value || '1';
adults.value = adults.value || '1';
children.value = children.value || '0';

['input','change'].forEach(evt => {
  bookingForm.addEventListener(evt, calcPrice);
});

function calcPrice() {
  const r = getSelectedRoom();
  const ci = checkin.value;
  const co = checkout.value;

  const nRooms = Number(rooms.value);
  const nAdults = Number(adults.value);
  const nChildren = Number(children.value);

  const nights = nightsBetween(ci, co);
  const validDates = ci && co && Number.isFinite(nights) && nights > 0;

  if (!r || !validDates || !Number.isFinite(nRooms) || nRooms <= 0) {
    priceEl.textContent = 'NT$ 0';
    return;
  }

  let base = r.price * nights * nRooms;

  let breakfastFee = 0;
  if (breakfast.value === 'adult') breakfastFee = 200 * Math.max(0, nAdults) * nights;
  if (breakfast.value === 'all')   breakfastFee = 200 * (Math.max(0, nAdults) + Math.max(0, nChildren)) * nights;

  let sum = base + breakfastFee;

  if (nights >= 3) sum *= 0.95;

  sum *= 1.1;

  priceEl.textContent = `NT$ ${Math.round(sum).toLocaleString()}`;
}

// ====== 驗證 ======
function setValidation(input, checkFn, errId, msgFn) {
  input.addEventListener('blur', () => checkFn(msgFn));
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid')) checkFn(msgFn);
  });
}

function vRequired(input, errId, msg = '此欄位必填。') {
  const val = normalize(input.value);
  setErr(input, val ? '' : msg, errId);
  return !!val;
}
function vEmail(input, errId) {
  const val = normalize(input.value);
  let msg = '';
  if (!val) msg = '此欄位必填。';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Email 格式不正確。';
  setErr(input, msg, errId);
  return !msg;
}
function vPhone(input, errId) {
  const val = normalize(input.value).replace(/\s/g, '');
  let msg = '';
  if (!val) msg = '此欄位必填。';
  else if (!/^09\d{8}$/.test(val)) msg = '請輸入 09 開頭的 10 碼手機。';
  setErr(input, msg, errId);
  return !msg;
}

// ====== 表單送出 ======
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.innerHTML = '';

  const ok =
    vRequired(guestName, 'guestName-err') &
    vEmail(email, 'email-err') &
    vPhone(phone, 'phone-err') &
    vRequired(roomType, 'roomType-err') &
    vRequired(checkin, 'checkin-err') &
    vRequired(checkout, 'checkout-err');

  if (!ok) return;

  if (!agree.checked) {
    document.getElementById('agree-err').textContent = '須同意訂房條款才能送出。';
    agree.focus();
    return;
  }

  bookBtn.disabled = true;
  bookBtn.classList.add('loading');
  bookBtn.textContent = '送出中...';

  await new Promise(r => setTimeout(r, 1000));

  formMsg.innerHTML = `<div class="alert alert-success mt-3">訂房成功！確認信已寄送至 ${email.value}</div>`;
  bookingForm.reset();
  priceEl.textContent = 'NT$ 0';
  noteCount.textContent = '0 / 200';
  bookBtn.disabled = false;
  bookBtn.classList.remove('loading');
  bookBtn.textContent = '送出訂單';
  Array.from(bookingForm.querySelectorAll('.is-invalid')).forEach(el => el.classList.remove('is-invalid'));
});

resetBtn.addEventListener('click', () => {
  bookingForm.reset();
  formMsg.innerHTML = '';
  priceEl.textContent = 'NT$ 0';
  noteCount.textContent = '0 / 200';
  Array.from(bookingForm.querySelectorAll('.is-invalid')).forEach(el => el.classList.remove('is-invalid'));
});

// ====== 初始化 ======
function init() {
  renderRoomOptions();
  renderRooms();
  calcPrice();
}
init();

// ====== 成為會員：密碼強度與驗證 ======
if (memberForm && mPassword && pwBar && pwText) {

  function checkPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0~4
  }

  mPassword.addEventListener('input', () => {
    const pw = mPassword.value;
    const level = checkPasswordStrength(pw);

    pwBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
    pwBar.style.width = (level * 25) + '%';

    if (!pw) {
      pwText.textContent = '';
      return;
    }

    if (level <= 1) {
      pwBar.classList.add('bg-danger');
      pwText.textContent = '強度：低（建議至少 8 碼，並包含大寫、小寫與數字）';
    } else if (level === 2 || level === 3) {
      pwBar.classList.add('bg-warning');
      pwText.textContent = '強度：中';
    } else if (level === 4) {
      pwBar.classList.add('bg-success');
      pwText.textContent = '強度：高';
    }
  });

  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;

    if (!mEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mEmail.value)) {
      document.getElementById('m-email-err').textContent = 'Email 格式不正確';
      ok = false;
    } else {
      document.getElementById('m-email-err').textContent = '';
    }

    if (mPassword.value.length < 8) {
      document.getElementById('m-pass-err').textContent = '密碼至少 8 碼以上';
      ok = false;
    } else {
      document.getElementById('m-pass-err').textContent = '';
    }

    if (!ok) return;

    alert('加入會員成功');
    memberForm.reset();
    pwBar.style.width = '0%';
    pwText.textContent = '';
  });
}
