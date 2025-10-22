// 溫度轉換器
let inputTemp = parseFloat(prompt("請輸入溫度值："));
let unit = prompt("請輸入單位（C 或 F）：").toUpperCase();
let resultText = "";

if (unit === "C") {
  let fahrenheit = inputTemp * 9 / 5 + 32;
  resultText = `${inputTemp}°C = ${fahrenheit.toFixed(2)}°F`;
} else if (unit === "F") {
  let celsius = (inputTemp - 32) * 5 / 9;
  resultText = `${inputTemp}°F = ${celsius.toFixed(2)}°C`;
} else {
  resultText = "單位輸入錯誤，請輸入 C 或 F。";
}

alert(resultText);
document.getElementById("result").textContent = resultText;