import express from 'express';
import jwt from 'jsonwebtoken';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

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

// GET /api/me - current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('-password').populate('teacherId', 'name email');
    res.json(me);
  } catch (e) { res.status(500).json({ message: 'Failed to fetch profile', error: e.message }); }
});

// PUT /api/me - update bio, course, progress.completion, milestones
router.put('/me', auth, async (req, res) => {
  try {
    const allowed = ['bio','course','language','progress'];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    const me = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true }).select('-password');
    res.json(me);
  } catch (e) { res.status(400).json({ message: 'Failed to update profile', error: e.message }); }
});

// GET /api/users/:id/progress
router.get('/users/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'teacher' && req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });
    const agg = await Activity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: '$skill', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
      { $project: { skill: '$_id', avgScore: 1, count: 1, _id: 0 } }
    ]);
    res.json(agg);
  } catch (e) {
    res.status(500).json({ message: 'Progress fetch failed', error: e.message });
  }
});

// GET /api/teacher/students
router.get('/teacher/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const query = { role: 'learner' };
    if (req.user.role === 'teacher') query.teacherId = req.user.id;
    const students = await User.find(query).select('name email language course teacherId progress');
    res.json(students);
  } catch (e) {
    res.status(500).json({ message: 'Fetch students failed', error: e.message });
  }
});

// GET /api/teachers - list all teachers
router.get('/teachers', auth, async (_req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('_id name email');
    res.json(teachers);
  } catch (e) { res.status(500).json({ message: 'Fetch teachers failed', error: e.message }); }
});

// Public: GET /api/public/teachers
router.get('/public/teachers', async (_req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('_id name email');
    res.json(teachers);
  } catch (e) { res.status(500).json({ message: 'Fetch teachers failed', error: e.message }); }
});

// POST /api/assign-teacher { learnerId, teacherId }
router.post('/assign-teacher', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
    const { learnerId, teacherId } = req.body;
    const updated = await User.findByIdAndUpdate(learnerId, { $set: { teacherId } }, { new: true }).select('name email teacherId');
    res.json(updated);
  } catch (e) { res.status(400).json({ message: 'Assign teacher failed', error: e.message }); }
});

// PUT /api/learners/:id/progress
router.put('/learners/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role === 'learner' && req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });
    if (req.user.role === 'teacher') {
      const learner = await User.findById(id).select('teacherId');
      if (!learner || String(learner.teacherId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    }
    const { completion, milestones } = req.body;
    const update = {};
    if (completion !== undefined) update['progress.completion'] = completion;
    if (milestones !== undefined) update['progress.milestones'] = milestones;
    const result = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('name progress');
    // Log activity
    try {
      const Activity = (await import('../models/Activity.js')).default;
      await Activity.create({ userId: id, type: 'progress_update', notes: 'Progress updated', });
    } catch {}
    res.json(result);
  } catch (e) { res.status(400).json({ message: 'Update progress failed', error: e.message }); }
});

// GET /api/admin/overview - counts and recent activities
router.get('/admin/overview', auth, async (_req, res) => {
  try {
    if (_req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const [learnerCount, teacherCount, activities] = await Promise.all([
      User.countDocuments({ role: 'learner' }),
      User.countDocuments({ role: 'teacher' }),
      Activity.find().sort({ createdAt: -1 }).limit(10)
    ]);
    res.json({ learnerCount, teacherCount, recentActivities: activities });
  } catch (e) { res.status(500).json({ message: 'Fetch overview failed', error: e.message }); }
});

export default router;
