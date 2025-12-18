const LS_TOKEN_KEY = "token";
const LS_USER_KEY  = "user";

function $(id){ return document.getElementById(id); }

function getToken(){ return localStorage.getItem(LS_TOKEN_KEY); }
function setToken(t){ localStorage.setItem(LS_TOKEN_KEY, t); }
function clearAuth(){
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
}
function setUser(u){
  if(!u) return;
  localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
}
function getUser(){
  const raw = localStorage.getItem(LS_USER_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function apiCall(path, {method="GET", body=null, auth=false} = {}){
  const headers = { "Content-Type":"application/json" };
  if(auth){
    const t = getToken();
    if(t) headers["Authorization"] = "Bearer " + t;
  }
  const res = await fetch(window.API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data };
}

function renderStorage(tokenEl, userEl){
  const t = getToken();
  const u = getUser();
  if(tokenEl) tokenEl.textContent = t ? t : "—";
  if(userEl) userEl.textContent = u ? JSON.stringify(u, null, 2) : "—";
}

function showResponse(respEl, r){
  if(!respEl) return;
  respEl.textContent = `HTTP ${r.status}\n\n` + JSON.stringify(r.data, null, 2);
}

function setStatus(statusEl, msg, type=""){
  if(!statusEl) return;
  statusEl.textContent = msg;
  statusEl.classList.remove("ok","bad");
  if(type) statusEl.classList.add(type);
}