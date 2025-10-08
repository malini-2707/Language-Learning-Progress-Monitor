import express from 'express';
import jwt from 'jsonwebtoken';
import Activity from '../models/Activity.js';

const router = express.Router();

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/activities
router.post('/', auth, async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const created = await Activity.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Create activity failed', error: e.message });
  }
});

// GET /api/activities/:userId
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'teacher' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const list = await Activity.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Fetch activities failed', error: e.message });
  }
});

// PUT /api/activities/:id/feedback
router.put('/:id/feedback', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const updated = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: { feedback: req.body.feedback } },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: 'Update feedback failed', error: e.message });
  }
});

export default router;

// FEEDBACK ROUTES
// POST /api/feedback  { userId, feedback, rating }
router.post('/feedback', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { userId, feedback, rating } = req.body;
    const created = await Activity.create({ userId, type: 'feedback', feedback, rating });
    res.status(201).json(created);
  } catch (e) { res.status(400).json({ message: 'Create feedback failed', error: e.message }); }
});

// GET /api/feedback/:userId  -> all feedback items for learner
router.get('/feedback/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role === 'learner' && req.user.id !== userId) return res.status(403).json({ message: 'Forbidden' });
    const list = await Activity.find({ userId, type: 'feedback' }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { res.status(500).json({ message: 'Fetch feedback failed', error: e.message }); }
});
