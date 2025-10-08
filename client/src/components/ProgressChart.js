import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ProgressChart({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Mastery</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <RadarChart outerRadius={90} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <Radar name="Score" dataKey="score" stroke="#F6BFA0" fill="#F6BFA0" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Scores</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <Tooltip />
              <Bar dataKey="score" fill="#FAD6C4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
