const API_URL = "http://127.0.0.1:3000/api/events";

// 小工具：支援 id 或 name 兩種抓法
function pickField(key) {
  return (
    document.getElementById(key) ||
    document.querySelector(`[name="${key}"]`)
  );
}

function pickListContainer() {
  return document.getElementById("eventList") || document.querySelector("#eventList, [data-event-list]");
}

async function loadEvents() {
  const list = pickListContainer();
  if (!list) {
    console.warn("找不到活動列表容器，請在 HTML 放 <div id='eventList'></div> 或 <div data-event-list></div>");
    return;
  }

  list.textContent = "載入中...";

  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    if (!result.success) {
      list.textContent = "載入失敗（API success=false）";
      return;
    }

    const events = result.data || [];
    if (events.length === 0) {
      list.textContent = "目前沒有活動";
      return;
    }

    list.innerHTML = "";
    events.forEach((e) => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.margin = "8px 0";
      div.style.padding = "8px";

      div.innerHTML = `
        <strong>${e.title ?? "(no title)"}</strong><br>
        日期：${(e.date ?? "").toString().slice(0, 10)}<br>
        地點：${e.location ?? ""}<br>
        名額：${e.capacity ?? ""}<br>
        狀態：${e.status ?? ""}<br>
        說明：${e.description ?? ""}
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    list.textContent = "載入失敗（Failed to fetch / 後端沒開 / CORS）";
  }
}

async function createEvent(evt) {
  // 防止 form submit 刷新頁面
  if (evt && typeof evt.preventDefault === "function") evt.preventDefault();

  const titleEl = pickField("title");
  const dateEl = pickField("date");
  const locationEl = pickField("location");
  const capacityEl = pickField("capacity");
  const descriptionEl = pickField("description");
  const statusEl = pickField("status");

  // 如果抓不到欄位，直接在 console 告訴你缺哪個
  const missing = [];
  if (!titleEl) missing.push("title");
  if (!dateEl) missing.push("date");
  if (!locationEl) missing.push("location");
  if (!capacityEl) missing.push("capacity");
  if (!descriptionEl) missing.push("description");
  if (!statusEl) missing.push("status");

  if (missing.length) {
    alert("你的 HTML 欄位 id/name 不對，缺少： " + missing.join(", "));
    console.warn("缺少欄位：", missing);
    return;
  }

  const payload = {
    title: titleEl.value,
    date: dateEl.value,
    location: locationEl.value,
    capacity: Number(capacityEl.value),
    description: descriptionEl.value,
    status: statusEl.value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
      alert("新增失敗：" + (data.message || "unknown"));
      return;
    }

    alert("新增成功！");
    await loadEvents();
  } catch (err) {
    console.error(err);
    alert("新增失敗（Failed to fetch / 後端沒開 / CORS）");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 自動載入列表
  loadEvents();

  // 自動綁定按鈕（建議你 HTML 用 id="btnCreate"）
  const btn = document.getElementById("btnCreate");
  if (btn) btn.addEventListener("click", createEvent);

  // 如果你的新增區塊包在 form 裡，也會阻止 submit 刷新
  const form = document.querySelector("form");
  if (form) form.addEventListener("submit", createEvent);
});

// 讓你如果 HTML 還在用 onclick="createEvent()" 也能用
window.createEvent = createEvent;
window.loadEvents = loadEvents;