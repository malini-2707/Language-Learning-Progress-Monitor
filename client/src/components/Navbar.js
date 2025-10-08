import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    nav('/');
  };

  return (
    <header className="bg-white sticky top-0 z-10 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-textsoft flex items-center gap-2">
          <BarChart3 className="text-aqua-300" /> AuraTrack
        </Link>
        <div className="flex items-center gap-4">
          {!user || user.role !== 'admin' ? (
            <>
              <Link className="btn-peach" to="/about">About</Link>
              {user?.role !== 'teacher' && (
                <Link className="btn-peach" to="/features">Features</Link>
              )}
            </>
          ) : null}
          {!user ? (
            <>
              <Link className="btn-peach" to="/login">Login</Link>
              <Link className="btn-peach" to="/signup">Start Learning</Link>
            </>
          ) : (
            <>
              {user.role === 'teacher' && <Link className="btn-peach" to="/teacher-dashboard">Dashboard</Link>}
              {user.role === 'learner' && <Link className="btn-peach" to="/dashboard">Dashboard</Link>}
              {user.role === 'learner' && <Link className="btn-peach" to="/profile">Profile</Link>}
              {user.role === 'admin' && <Link className="btn-peach" to="/admin-dashboard">Admin Dashboard</Link>}
              <button className="btn-peach flex items-center gap-2" onClick={logout}><LogOut size={18}/> Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
