import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['learner', 'teacher', 'admin'], default: 'learner' },
  language: { type: String, default: 'English' },
  bio: { type: String, default: '' },
  course: { type: String, default: '' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: {
    completion: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
