import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ProgressChart from '../components/ProgressChart';
import SkillCard from '../components/SkillCard';
import { jwtDecode } from 'jwt-decode';

const skills = ['Reading','Writing','Listening','Speaking','Vocabulary','Grammar'];

export default function Dashboard() {
  const [progress, setProgress] = useState([]);
  const [form, setForm] = useState({ lesson: '', skill: 'Reading', notes: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [sliders, setSliders] = useState({
    Reading: 0, Writing: 0, Listening: 0, Speaking: 0, Vocabulary: 0, Grammar: 0
  });
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState([]);
  const printRef = useRef(null);

  // simple debounce utility
  const debounce = (fn, ms = 600) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  const downloadPdf = () => {
    // Print current page, relying on print:hidden classes for navbar/footer
    // and focusing content within printRef
    window.print();
  };

  const saveSkillScore = debounce(async ({ skill, score }) => {
    try {
      await api.post('/activities', { skill, score, duration: 0, notes: 'Slider update' });
      // reload latest per-skill
      load();
    } catch { /* ignore */ }
  }, 700);

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = jwtDecode(token);
      setUserId(payload.id);
      const { data } = await api.get(`/activities/${payload.id}`);
      setActivities(data || []);
      const latestPerSkill = skills.map(skill => {
        const last = data.find(d => d.skill === skill);
        return { skill, score: last?.score || 0 };
      });
      setProgress(latestPerSkill);
      // seed sliders from latest
      const s = {}; latestPerSkill.forEach(p => s[p.skill] = p.score); setSliders(prev => ({ ...prev, ...s }));
      // load feedback history
      const fb = await api.get(`/activities/feedback/${payload.id}`);
      setFeedbacks(fb.data || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { load(); }, []);

  const avgMap = useMemo(() => {
    const m = {}; progress.forEach(p => m[p.skill] = p.score); return m;
  }, [progress]);

  const downloadCsv = () => {
    const lines = [];
    const push = (arr) => lines.push(arr.map(v => {
      if (v === null || v === undefined) return '';
      const s = String(v).replaceAll('"', '""');
      return s.includes(',') || s.includes('\n') ? `"${s}"` : s;
    }).join(','));

    // Skills summary
    push(['Section','Skill','Score']);
    progress.forEach(p => push(['Skills', p.skill, p.score]));
    lines.push('');

    // Feedback history
    push(['Section','Feedback','Rating','Date']);
    feedbacks.forEach(f => push(['Feedback', f.feedback || '', f.rating ?? '', new Date(f.createdAt).toLocaleString()]));
    lines.push('');

    // Raw activity log
    push(['Section','Lesson','Skill','Score','Duration','Notes','Date']);
    activities.forEach(a => push(['Activities', a.lesson || '', a.skill || '', a.score ?? '', a.duration ?? '', a.notes || '', new Date(a.createdAt).toLocaleString()]));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    a.href = url;
    a.download = `progress-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Only log lesson, skill, and notes; score/duration managed by sliders elsewhere
      await api.post('/activities', { lesson: form.lesson, skill: form.skill, notes: form.notes });
      toast.success('Activity added');
      setForm({ lesson: '', skill: 'Reading', notes: '' });
      load();
    } catch (e) { toast.error('Failed to add'); }
  };

  return (
    <div ref={printRef} className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        {skills.map(s => (
          <SkillCard key={s} title={s} value={avgMap[s] || 0} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 print:justify-end">
        <div className="flex-1">
          <ProgressChart data={progress} />
        </div>
        <div className="flex gap-2">
          <button className="btn-peach h-10" onClick={downloadCsv}>Download CSV</button>
          <button className="btn-peach h-10" onClick={downloadPdf}>Download PDF</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Progress (auto-saves)</h3>
        <div className="space-y-4">
          {skills.map(sk => (
            <div key={sk} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{sk}</span>
                <span className="text-sm text-gray-600">{sliders[sk]}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={sliders[sk] || 0}
                className="w-full accent-peach-300"
                onChange={(e)=>{
                  const val = Number(e.target.value);
                  setSliders({ ...sliders, [sk]: val });
                  saveSkillScore({ skill: sk, score: val });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Feedback History</h3>
        {feedbacks.length === 0 ? (
          <p className="text-gray-600">No feedback yet.</p>
        ) : (
          <ul className="space-y-2">
            {feedbacks.map(f => (
              <li key={f._id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                <span className="text-gray-800">{f.feedback}</span>
                <span className="text-sm text-gray-500">⭐ {f.rating ?? '-'} • {new Date(f.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Add Activity</h3>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <input className="rounded-xl p-3 bg-white" placeholder="Lesson" value={form.lesson} onChange={(e)=>setForm({ ...form, lesson: e.target.value })} />
          <select className="rounded-xl p-3 bg-white" value={form.skill} onChange={(e)=>setForm({ ...form, skill: e.target.value })}>
            {skills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea className="rounded-xl p-3 bg-white md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e)=>setForm({ ...form, notes: e.target.value })} />
          <button className="btn-peach md:col-span-2" type="submit">Save Activity</button>
        </form>
      </div>

      <p className="text-center text-gray-600">“Small progress is still progress.”</p>
    </div>
  );
}
