// server/routes/signup.js
import express from 'express';
import {
  createParticipant,
  listParticipants
} from '../repositories/participants.js';

const router = express.Router();

function validateBody(body) {
  const { name, email, phone } = body;
  if (!name || !email || !phone) {
    return 'name、email、phone 都必填';
  }
  if (!/^09\d{8}$/.test(phone)) {
    return '手機需為 09 開頭 10 碼';
  }
  return null;
}

// GET /api/signup 取得清單
router.get('/', async (req, res, next) => {
  try {
    const items = await listParticipants();
    res.json({ total: items.length, items });
  } catch (err) {
    next(err);
  }
});

// POST /api/signup 新增一筆
router.post('/', async (req, res, next) => {
  try {
    const error = validateBody(req.body || {});
    if (error) {
      return res.status(400).json({ error });
    }

    const { name, email, phone } = req.body;
    const id = await createParticipant({ name, email, phone });
    res.status(201).json({ message: '報名成功', id });
  } catch (err) {
    next(err);
  }
});

export default router;