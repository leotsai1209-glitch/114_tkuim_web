// 猜數字遊戲
let answer = Math.floor(Math.random() * 100) + 1;
let guess;
let count = 0;
let message = "";

do {
  guess = parseInt(prompt("請輸入 1~100 的數字："));
  count++;

  if (isNaN(guess)) {
    alert("請輸入有效數字！");
  } else if (guess > answer) {
    alert("再小一點！");
  } else if (guess < answer) {
    alert("再大一點！");
  } else {
    alert(`恭喜你答對了！總共猜了 ${count} 次！`);
    message = `答案是：${answer}\n總共猜了 ${count} 次。`;
  }
} while (guess !== answer);

document.getElementById("output").textContent = message;