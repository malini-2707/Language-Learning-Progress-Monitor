import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const cta = (() => {
    if (!user) return { href: '/signup', label: 'Start Learning' };
    if (user.role === 'teacher') return { href: '/teacher-dashboard', label: 'Go to Dashboard' };
    if (user.role === 'admin') return { href: '/admin-dashboard', label: 'Go to Dashboard' };
    return { href: '/dashboard', label: 'Go to Dashboard' };
  })();
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-bold text-textsoft">
          Track Your Language Journey
        </motion.h1>
        {user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg text-gray-800 font-medium"
          >
            Welcome, {user.name || 'User'} — {user.role === 'teacher' ? 'Teacher' : user.role === 'admin' ? 'Admin' : 'Learner'}
          </motion.p>
        )}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-gray-700">
          Friendly, calm, and motivational dashboard for learners, teachers, and admins.
        </motion.p>
        <div className="mt-10 flex justify-center gap-4">
          <Link className="btn-peach" to={cta.href}>{cta.label}</Link>
        </div>
      </div>
    </section>
  );
}
