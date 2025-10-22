// example4_script.js
// 判斷輸入數字是否為奇數或偶數 + 分數等第判斷

var input = prompt('請輸入一個整數：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// switch 範例
var choice = prompt('輸入 1/2/3 試試 switch：');
switch (choice) {
  case '1':
    msg += '\n你輸入了 1';
    break;
  case '2':
    msg += '\n你輸入了 2';
    break;
  case '3':
    msg += '\n你輸入了 3';
    break;
  default:
    msg += '\n非 1/2/3';
}

// 延伸練習：分數判斷
var score = prompt('請輸入分數（0–100）：');
var s = parseFloat(score);
if (isNaN(s) || s < 0 || s > 100) {
  msg += '\n\n⚠️ 分數輸入錯誤，請輸入 0–100 之間的數字。';
} else if (s >= 90) {
  msg += '\n\n你的等第是 A';
} else if (s >= 80) {
  msg += '\n\n你的等第是 B';
} else if (s >= 70) {
  msg += '\n\n你的等第是 C';
} else if (s >= 60) {
  msg += '\n\n你的等第是 D';
} else {
  msg += '\n\n你的等第是 F';
}

document.getElementById('result').textContent = msg;