import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminPanel() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/teacher/students');
        setStudents(data);
      } catch {}
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <div className="card">
        <h3 className="font-semibold mb-2">Learners</h3>
        <ul className="space-y-2">
          {students.map(s => (
            <li key={s._id} className="bg-white rounded-xl p-3 flex items-center justify-between">
              <span>{s.name} — {s.email}</span>
              <span className="text-sm text-gray-500">{s.language}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
