# Week12 — Authentication & Authorization Demo

本專案為課程 **Week12：登入、驗證與權限控管** 作業示範，  
使用 **Express + MongoDB + JWT** 實作後端驗證流程，並搭配前端頁面實際展示：

- 使用者登入 / 註冊
- JWT 驗證機制
- 受保護 API（Authorization: Bearer Token）
- 錯誤狀態顯示（401 / 404）

---

## 專案目的

本作業的目標是：

1. 理解 **Authentication（身分驗證）** 與 **Authorization（授權）** 的差異  
2. 實際使用 **JWT** 保護 API  
3. 在前端清楚呈現：
   - 成功請求
   - 失敗請求（未登入、路由不存在）
4. 驗證系統在「錯誤情境」下的行為（老師特別要求顯示 404）

---

## 使用技術

### Frontend
- HTML / CSS / JavaScript
- Fetch API
- localStorage 儲存 JWT
- 顯示 HTTP 狀態碼與回應內容

### Backend（課堂範例）
- Node.js
- Express
- MongoDB
- bcrypt（密碼雜湊）
- JSON Web Token (JWT)
- Middleware 驗證機制

---

## 專案結構

```text
web/
├─ index.html        # 登入 / 註冊頁
├─ protected.html    # 受保護頁（需 JWT）
├─ errors.html       # 錯誤測試頁（401 / 404）
├─ styles.css        # 共用樣式（antigravity 風格）
├─ app.js            # 共用 JS（fetch、token、狀態顯示）
└─ config.js         # API 路由設定（可依後端修改）