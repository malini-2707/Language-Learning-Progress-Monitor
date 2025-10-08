import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const SKILLS = ['Reading','Writing','Listening','Speaking','Vocabulary','Grammar'];
const COLORS = ['#F8DCCB','#FFD5C2','#FFF4ED','#F9C6AF','#F7AF99','#FCE8DF'];

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [form, setForm] = useState({ feedback: '', rating: 5 });
  const [selected, setSelected] = useState(null); // learner for charts
  const [prog, setProg] = useState([]); // [{skill, avgScore, count}]

  const loadStudents = async () => {
    try {
      const { data } = await api.get('/teacher/students');
      setStudents(data);
      if (data.length && !selected) {
        setSelected(data[0]);
      }
    } catch {}
  };

  const loadProgress = async (learnerId) => {
    try {
      const { data } = await api.get(`/users/${learnerId}/progress`);
      setProg(data);
    } catch {}
  };

  useEffect(() => { loadStudents(); }, []);
  useEffect(() => { if (selected?._id) loadProgress(selected._id); }, [selected?._id]);

  const radarData = useMemo(() => {
    const map = Object.fromEntries(prog.map(p => [p.skill, Math.round(p.avgScore || 0)]));
    return SKILLS.map(s => ({ skill: s, score: map[s] || 0 }));
  }, [prog]);

  const pieData = useMemo(() => radarData.map(d => ({ name: d.skill, value: d.score })), [radarData]);

  const openModal = (learner) => { setTarget(learner); setForm({ feedback: '', rating: 5 }); setOpen(true); };
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities/feedback', { userId: target._id, feedback: form.feedback, rating: Number(form.rating) });
      toast.success('Feedback sent');
      setOpen(false);
    } catch { toast.error('Failed to send'); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Learners</h2>
        <select
          className="rounded-xl p-2 bg-white"
          value={selected?._id || ''}
          onChange={(e)=>{
            const st = students.find(s => s._id === e.target.value);
            setSelected(st || null);
          }}
        >
          {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.email}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-3">Skill Report (Radar)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={90}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <Radar dataKey="score" stroke="#F7AF99" fill="#F7AF99" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Skill Distribution (Pie)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={95}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {students.map(s => (
          <div key={s._id} className={`card ${selected?._id===s._id ? 'ring-2 ring-aqua-300' : ''}`}>
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-600">{s.email}</div>
            <div className="text-sm text-gray-600">Course: {s.course || '-'}</div>
            <div className="text-sm text-gray-600">Progress: {s.progress?.completion ?? 0}%</div>
            <div className="flex gap-2 mt-3">
              <button className="btn-peach" onClick={()=>setSelected(s)}>View Progress</button>
              <button className="btn-peach" onClick={() => openModal(s)}>Give Feedback</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Feedback for {target?.name}</h3>
            <textarea className="w-full rounded-xl p-3 bg-white mb-3" placeholder="Write feedback" value={form.feedback} onChange={(e)=>setForm({...form, feedback: e.target.value})} required />
            <input className="w-full rounded-xl p-3 bg-white mb-4" type="number" min="1" max="5" value={form.rating} onChange={(e)=>setForm({...form, rating: e.target.value})} />
            <div className="flex gap-3 justify-end">
              <button type="button" className="btn-peach" onClick={()=>setOpen(false)}>Cancel</button>
              <button type="submit" className="btn-peach">Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
