import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      nav('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <input className="w-full mb-3 rounded-xl p-3 bg-white" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full mb-4 rounded-xl p-3 bg-white" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn-peach w-full" type="submit">Login</button>
        <p className="text-sm mt-4 text-center">No account? <Link className="underline" to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
}
