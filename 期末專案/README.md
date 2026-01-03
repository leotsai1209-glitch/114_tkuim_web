# 活動報名系統（Event Registration System）

本專題為一個簡易的活動報名管理系統，提供活動的新增、查詢、刪除等功能。  
前端以 HTML / CSS / JavaScript 撰寫，後端使用 Node.js（Express）與 MongoDB，採用 RESTful API 架構進行資料存取。

---

## 一、系統功能說明

### 主要功能
- 新增活動（Create）
- 查詢活動列表（Read）
- 刪除活動（Delete）
- 前後端分離設計，透過 API 溝通
- 使用 MongoDB 儲存活動資料

### 活動欄位包含
- 活動名稱（title）
- 活動日期（date）
- 活動地點（location）
- 名額（capacity）
- 活動簡介（description）
- 活動狀態（status：open / closed）

---

## 二、系統架構
前端（index.html / list.html）
│
│ fetch API
▼
後端（Node.js + Express）
│
▼
MongoDB（Docker 容器）
- 前端：負責畫面呈現與使用者操作
- 後端：負責 API、資料驗證與資料庫存取
- 資料庫：MongoDB（以 Docker 啟動）

---

## 三、使用技術

### 前端
- HTML5
- CSS3
- JavaScript（Fetch API）

### 後端
- Node.js
- Express
- MongoDB（Mongoose）
- Docker（MongoDB 容器）

### 開發工具
- Visual Studio Code
- Git / GitHub
- MongoDB Compass

---

## 四、專案目錄結構
期末專案/
│
├─ index.html        # 新增活動頁面
├─ list.html         # 活動列表頁面
├─ script.js         # 前端 JavaScript
├─ README.md
│
└─ server/
├─ src/
│  ├─ app.js
│  ├─ routes/
│  │  └─ eventRoutes.js
│  ├─ models/
│  │  └─ Event.js
│  └─ config/
│     └─ db.js
├─ package.json
└─ .env
---

## 五、安裝與執行方式

### 1 安裝必要工具
- Node.js（建議 v18 以上）
- Docker
- MongoDB Compass（選用）

---

### 2 啟動 MongoDB（Docker）

```bash
docker run -d --name week11-mongo -p 27017:27017 mongo:7