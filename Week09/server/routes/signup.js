// server/routes/signup.js
import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

// 用陣列當作暫時「資料庫」
const participants = [];

// 必填欄位
const requiredFields = ['name', 'email', 'phone', 'password', 'interests'];

function validatePayload(body) {
  // 檢查必填欄位
  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} 為必填`;
    }
  }

  // 手機：09 開頭 + 10 碼
  if (!/^09\d{8}$/.test(body.phone)) {
    return '手機需為 09 開頭 10 碼';
  }

  // interests 要是陣列而且至少一個
  if (!Array.isArray(body.interests) || body.interests.length === 0) {
    return '至少選擇一個興趣';
  }

  // 密碼長度
  if (body.password.length < 8) {
    return '密碼需至少 8 碼';
  }

  // 確認密碼（如果有帶 confirmPassword 就檢查）
  if (body.confirmPassword !== undefined && body.password !== body.confirmPassword) {
    return '密碼與確認密碼不一致';
  }

  // 條款勾選（如果需要）
  if (body.terms !== true) {
    return '請同意服務條款';
  }

  return null; // 通過驗證
}

// 取得目前所有報名資料
router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

// 新增一筆報名
router.post('/', (req, res) => {
  const body = req.body || {};
  const errorMessage = validatePayload(body);

  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }

  const newParticipant = {
    id: nanoid(8),
    name: body.name,
    email: body.email,
    phone: body.phone,
    interests: body.interests,
    createdAt: new Date().toISOString()
  };

  participants.push(newParticipant);

  res.status(201).json({
    message: '報名成功',
    participant: newParticipant
  });
});

// （選做）刪除一筆報名
router.delete('/:id', (req, res) => {
  const index = participants.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '找不到這位參與者' });
  }

  const [removed] = participants.splice(index, 1);

  res.json({ message: '已取消報名', participant: removed });
});

export { router };