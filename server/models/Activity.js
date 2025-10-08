import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: String },
  // Optional for generic events
  type: { type: String, enum: ['study','signup','progress_update','feedback'], default: 'study' },
  skill: { type: String, enum: ['Reading','Writing','Listening','Speaking','Vocabulary','Grammar'] },
  score: { type: Number, min: 0, max: 100 },
  duration: { type: Number, default: 0 },
  notes: { type: String },
  feedback: { type: String },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

export default mongoose.model('Activity', ActivitySchema);
