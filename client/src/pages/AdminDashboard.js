import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [learners, setLearners] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: tchs }, { data: studs }] = await Promise.all([
          api.get('/teachers'),
          api.get('/teacher/students') // as admin returns all learners
        ]);
        setTeachers(tchs);
        setLearners(studs);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Teachers</h3>
          <ul className="space-y-2">
            {teachers.map(t => (
              <li key={t._id} className="bg-white rounded-xl p-3">{t.name} — {t.email}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Learners & Progress</h3>
          <ul className="space-y-2">
            {learners.map(s => (
              <li key={s._id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                <span>{s.name} — {s.email}</span>
                <span className="text-sm text-gray-500">{s.course || '-'} • Progress: {s.progress?.completion ?? 0}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
