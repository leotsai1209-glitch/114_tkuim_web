// example1_script.js
// 使用 var 與傳統函式宣告

// 頁面載入時的提示與輸出
alert('歡迎來到 JavaScript！');
console.log('Hello JavaScript from console');

var el = document.getElementById('result');
el.textContent = '這行文字是由外部 JS 檔案寫入的。\n姓名：蔡琦浚\n學號：413637066';

// 延伸練習：按鈕點擊事件
var btn = document.getElementById('helloBtn');
var count = 0;

btn.addEventListener('click', function() {
  count++;
  alert('你好，這是第 ' + count + ' 次打招呼！');
  el.textContent += '\n你已經按了按鈕 ' + count + ' 次。';
});