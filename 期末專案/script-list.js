const API_URL = "http://localhost:3000/api/events";

async function loadEvents() {
  const list = document.getElementById("eventList");
  list.innerHTML = "載入中...";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    list.innerHTML = "";

    data.data.forEach(event => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${event.title}</strong><br>
        日期：${event.date.split("T")[0]}<br>
        地點：${event.location}<br>
        人數：${event.capacity}<br>
        狀態：${event.status}
      `;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = "載入失敗";
  }
}

loadEvents();