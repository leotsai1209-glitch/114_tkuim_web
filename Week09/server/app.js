// server/app.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { router as signupRouter } from './routes/signup.js';

config(); // 讀取 .env

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 設定，允許前端從特定 origin 存取
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',')
  : '*';

app.use(
  cors({
    origin: allowedOrigins
  })
);

// 讓 Express 會幫我們把 JSON body 解析成 JS 物件
app.use(express.json());

// 掛載報名路由
app.use('/api/signup', signupRouter);

// 健康檢查：確認後端活著
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 404 處理：找不到路由
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 通用錯誤處理
app.use((error, req, res, next) => {
  console.error('[Server Error]', error);
  res.status(500).json({ error: 'Server Error' });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});