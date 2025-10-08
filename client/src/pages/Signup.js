import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner', course: '', teacherId: '' });
  const [teachers, setTeachers] = useState([]);
  const { setUser } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/public/teachers');
        setTeachers(data);
      } catch {}
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome!');
      nav('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create account</h2>
        <input className="w-full mb-3 rounded-xl p-3 bg-white" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
        <input className="w-full mb-3 rounded-xl p-3 bg-white" type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
        <input className="w-full mb-3 rounded-xl p-3 bg-white" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} required />
        <select className="w-full mb-3 rounded-xl p-3 bg-white" value={form.role} onChange={(e)=>setForm({ ...form, role: e.target.value })}>
          <option value="learner">Learner</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input className="w-full mb-3 rounded-xl p-3 bg-white" placeholder="Course (e.g., English)" value={form.course} onChange={(e)=>setForm({ ...form, course: e.target.value })} />
        <select className="w-full mb-4 rounded-xl p-3 bg-white" value={form.teacherId} onChange={(e)=>setForm({ ...form, teacherId: e.target.value })}>
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t._id} value={t._id}>{t.name} — {t.email}</option>)}
        </select>
        <button className="btn-peach w-full" type="submit">Sign up</button>
        <p className="text-sm mt-4 text-center">Have an account? <Link className="underline" to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
