// example2_script.js
// 變數宣告與基本型態操作 + 延伸練習

var text = '123';              
var num = 45;                  
var isPass = true;             
var emptyValue = null;         
var notAssigned;               

var lines = '';
lines += 'text = ' + text + '，typeof: ' + (typeof text) + '\n';
lines += 'num = ' + num + '，typeof: ' + (typeof num) + '\n';
lines += 'isPass = ' + isPass + '，typeof: ' + (typeof isPass) + '\n';
lines += 'emptyValue = ' + emptyValue + '，typeof: ' + (typeof emptyValue) + '\n';
lines += 'notAssigned = ' + notAssigned + '，typeof: ' + (typeof notAssigned) + '\n\n';

// 轉型示範
var textToNumber = parseInt(text, 10);
lines += 'parseInt(\'123\') = ' + textToNumber + '\n';
lines += 'String(45) = ' + String(num) + '\n\n';

// 延伸練習：輸入兩個數字字串，相加
var input1 = prompt("請輸入第一個數字字串：");
var input2 = prompt("請輸入第二個數字字串：");

// 轉成數字
var n1 = parseFloat(input1);
var n2 = parseFloat(input2);
var sum = n1 + n2;

lines += '你輸入的兩個數字分別是：' + n1 + ' 和 ' + n2 + '\n';
lines += '相加結果為：' + sum + '\n';

alert("相加結果為：" + sum);
document.getElementById('result').textContent = lines;