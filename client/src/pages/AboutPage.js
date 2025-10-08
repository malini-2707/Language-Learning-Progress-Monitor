import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center">
          <motion.h2 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl font-bold text-textsoft">About Language Progress</motion.h2>
          <p className="mt-4 text-gray-700 leading-7">
            A gentle, focused workspace to build language skills over time. Track your practice, visualize progress,
            and collaborate with teachers—all in a pastel, stress‑free UI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="card">
            <h3 className="font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700 text-sm leading-6">
              Help learners stay consistent and motivated with clear goals, supportive feedback, and simple visual reports.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Who It’s For</h3>
            <ul className="text-gray-700 text-sm leading-6 list-disc pl-5">
              <li>Learners building Reading/Writing/Listening/Speaking/Vocabulary/Grammar</li>
              <li>Teachers guiding classes or one‑on‑one</li>
              <li>Admins overseeing cohorts and outcomes</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">How It Works</h3>
            <ul className="text-gray-700 text-sm leading-6 list-disc pl-5">
              <li>Log activities and auto‑save skill scores</li>
              <li>View charts of progress over time</li>
              <li>Receive teacher feedback and next steps</li>
              <li>Export progress (CSV/PDF)</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Roles</h3>
            <ul className="text-gray-700 text-sm leading-6 list-disc pl-5">
              <li><strong>Learner:</strong> Update skills, see charts, download progress</li>
              <li><strong>Teacher:</strong> Monitor assigned learners, give feedback, review reports</li>
              <li><strong>Admin:</strong> See teachers and learners with overall progress</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Privacy & Data</h3>
            <p className="text-gray-700 text-sm leading-6">
              Your data stays in your project database. Authentication uses JWT and server‑side authorization.
              You can export or delete your data at any time via admin tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
