// example8_script.js
// 宣告一個學生物件，包含屬性與方法（含延伸練習 getGrade）

var student = {
  name: 'Leo',
  id: 'A123456789',
  scores: [85, 90, 78],
  
  // 計算平均
  getAverage: function() {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }
    return sum / this.scores.length;
  },
  
  // 顯示基本資料
  info: function() {
    return '姓名：' + this.name + '\n學號：' + this.id;
  },
  
  // 🔹 延伸：根據平均分數給等第
  getGrade: function() {
    var avg = this.getAverage();
    var grade = '';
    if (avg >= 90) {
      grade = 'A';
    } else if (avg >= 80) {
      grade = 'B';
    } else if (avg >= 70) {
      grade = 'C';
    } else if (avg >= 60) {
      grade = 'D';
    } else {
      grade = 'F';
    }
    return grade;
  }
};

// 輸出結果
var text = student.info()
         + '\n平均：' + student.getAverage().toFixed(2)
         + '\n等第：' + student.getGrade();

document.getElementById('result').textContent = text;