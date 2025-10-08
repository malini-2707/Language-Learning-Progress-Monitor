import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const TEACHERS = [
  { name: 'Pallavi', email: 'pallavi@gmail.com' },
  { name: 'Vijay', email: 'vijay@gmail.com' },
  { name: 'Priya', email: 'priya@gmail.com' },
  { name: 'Vidhya', email: 'vidhya@gmail.com' },
  { name: 'Vishwa', email: 'vishwa@gmail.com' },
  { name: 'Raja', email: 'raja@gmail.com' },
  { name: 'Ram', email: 'ram@gmail.com' },
  { name: 'Sandhiya', email: 'sandhiya@gmail.com' },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const pwTeacher = await bcrypt.hash('1234567', 10);
  const pwAdmin = await bcrypt.hash('admin123', 10);

  // Upsert teachers
  for (const t of TEACHERS) {
    await User.updateOne(
      { email: t.email.toLowerCase() },
      { $setOnInsert: { name: t.name, email: t.email.toLowerCase(), password: pwTeacher, role: 'teacher' } },
      { upsert: true }
    );
  }

  // Upsert admin
  await User.updateOne(
    { email: 'admin@gmail.com' },
    { $setOnInsert: { name: 'Admin', email: 'admin@gmail.com', password: pwAdmin, role: 'admin' } },
    { upsert: true }
  );

  console.log('Seeded teachers and admin');
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
