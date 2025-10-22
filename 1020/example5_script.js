// example5_script.js
// 延伸版：可自訂乘法範圍

var start = parseInt(prompt('請輸入起始數（1-9）：'), 10);
var end = parseInt(prompt('請輸入結束數（1-9）：'), 10);
var output = '';

if (isNaN(start) || isNaN(end) || start < 1 || end > 9 || start > end) {
  output = '輸入範圍錯誤，請重新輸入 1~9 且起始 ≤ 結束！';
} else {
  for (var i = start; i <= end; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + 'x' + j + '=' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;