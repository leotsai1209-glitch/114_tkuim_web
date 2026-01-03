const API_URL = "http://127.0.0.1:3000/api/events";

document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    title: document.getElementById("title").value.trim(),
    date: document.getElementById("date").value, // yyyy-mm-dd
    location: document.getElementById("location").value.trim(),
    capacity: Number(document.getElementById("capacity").value),
    description: document.getElementById("description").value.trim(),
    status: document.getElementById("status").value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ❗fetch 不會因為 404/500 自己丟錯，所以一定要檢查
    const text = await res.text(); // 先用 text，避免後端回 HTML 造成 json() 直接爆
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    console.log("POST status =", res.status);
    console.log("POST response =", data);

    if (!res.ok) {
      alert(`新增失敗：HTTP ${res.status}\n${data.message || text}`);
      return;
    }

    if (!data.success) {
      alert(`新增失敗：${data.message || "後端回 success=false"}`);
      return;
    }

    alert("新增成功！");
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("新增失敗：連不到後端（Failed to fetch / CORS / 後端沒開）");
  }
});