const API = "http://127.0.0.1:3000/api/events";

// 小工具：訊息框
function showMsg(el, text, type = "ok") {
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  el.classList.remove("ok", "bad");
  el.classList.add(type === "ok" ? "ok" : "bad");
}
function hideMsg(el) {
  if (!el) return;
  el.classList.remove("show", "ok", "bad");
  el.textContent = "";
}

function badge(status) {
  const cls = status === "open" ? "open" : "closed";
  return `<span class="badge ${cls}">${status}</span>`;
}

async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

/* =========================
   index.html：新增活動 + 快速查看
========================= */
async function initCreatePage() {
  const form = document.getElementById("createForm");
  if (!form) return;

  const msg = document.getElementById("createMsg");
  const apiStatus = document.getElementById("apiStatus");
  const countEl = document.getElementById("count");

  // 快速檢查 API / 筆數
  try {
    const res = await fetch(API);
    const data = await safeJson(res);
    if (res.ok && data.success) {
      if (apiStatus) apiStatus.textContent = "OK";
      if (countEl) countEl.textContent = Array.isArray(data.data) ? data.data.length : "-";
    } else {
      if (apiStatus) apiStatus.textContent = "異常";
      if (countEl) countEl.textContent = "-";
    }
  } catch {
    if (apiStatus) apiStatus.textContent = "連不到";
    if (countEl) countEl.textContent = "-";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMsg(msg);

    const body = {
      title: document.getElementById("title").value.trim(),
      date: document.getElementById("date").value,
      location: document.getElementById("location").value.trim(),
      capacity: Number(document.getElementById("capacity").value),
      description: document.getElementById("description").value.trim(),
      status: document.getElementById("status").value,
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        showMsg(msg, `新增失敗：HTTP ${res.status} ${data.message || ""}`, "bad");
        return;
      }
      if (!data.success) {
        showMsg(msg, `新增失敗：${data.message || "success=false"}`, "bad");
        return;
      }

      showMsg(msg, "新增成功 ✅", "ok");
      alert("新增成功！");
      form.reset();
    } catch (err) {
      showMsg(msg, "新增失敗：Failed to fetch（後端沒開 / CORS）", "bad");
    }
  });
}

/* =========================
   list.html：活動列表渲染
========================= */
async function loadList() {
  const tbody = document.getElementById("eventsTbody");
  const msg = document.getElementById("listMsg");
  const count = document.getElementById("listCount");
  if (!tbody) return;

  hideMsg(msg);
  tbody.innerHTML = `<tr><td colspan="6" style="color:#9fb0d0">載入中...</td></tr>`;

  try {
    const res = await fetch(API);
    const data = await safeJson(res);

    if (!res.ok) {
      tbody.innerHTML = "";
      showMsg(msg, `載入失敗：HTTP ${res.status}`, "bad");
      return;
    }
    if (!data.success || !Array.isArray(data.data)) {
      tbody.innerHTML = "";
      showMsg(msg, `載入失敗：${data.message || "資料格式錯誤"}`, "bad");
      return;
    }

    if (count) count.textContent = data.data.length;

    if (data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="color:#9fb0d0">目前沒有活動</td></tr>`;
      return;
    }

    tbody.innerHTML = data.data.map(ev => {
      const dateStr = (ev.date || "").slice(0, 10);
      return `
        <tr>
          <td><strong>${escapeHtml(ev.title || "")}</strong><div style="color:#9fb0d0;font-size:12px;">${escapeHtml(ev.description || "")}</div></td>
          <td>${escapeHtml(dateStr)}</td>
          <td>${escapeHtml(ev.location || "")}</td>
          <td>${Number(ev.capacity ?? 0)}</td>
          <td>${badge(ev.status || "open")}</td>
          <td>
            <button class="btn small danger" data-del="${ev._id}">刪除</button>
          </td>
        </tr>
      `;
    }).join("");

    // 刪除按鈕（如果你的後端有做 DELETE 才會成功）
    tbody.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del");
        if (!confirm("確定要刪除這筆活動？")) return;

        try {
          const res = await fetch(`${API}/${id}`, { method: "DELETE" });
          const data = await safeJson(res);

          if (!res.ok) {
            alert(`刪除失敗：HTTP ${res.status}\n${data.message || ""}`);
            return;
          }
          if (!data.success) {
            alert(`刪除失敗：${data.message || "success=false"}`);
            return;
          }

          alert("刪除成功 ✅");
          loadList();
        } catch {
          alert("刪除失敗：Failed to fetch");
        }
      });
    });

  } catch {
    tbody.innerHTML = "";
    showMsg(msg, "載入失敗：Failed to fetch（後端沒開 / CORS）", "bad");
  }
}

function initListPage() {
  const tbody = document.getElementById("eventsTbody");
  if (!tbody) return;

  const btnReload = document.getElementById("btnReload");
  if (btnReload) btnReload.addEventListener("click", loadList);

  loadList();
}

// 安全字串
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 啟動
initCreatePage();
initListPage();