export default function FeaturesPage() {
  const features = [
    {
      title: 'Track Learning Progress',
      desc: 'Monitor Reading, Writing, Listening, Speaking, Vocabulary, and Grammar. Visual charts make trends clear at a glance.'
    },
    {
      title: 'Choose Teachers',
      desc: 'Select from predefined teachers during signup. Get guidance tailored to your course and goals.'
    },
    {
      title: 'Personalized Dashboard',
      desc: 'See your current status and next steps in a calm, pastel interface. Sliders let you update skill levels quickly.'
    },
    {
      title: 'Activity Logging & Reports',
      desc: 'Record sessions with notes and auto-save. Admins and teachers can review activity summaries and charts.'
    },
    {
      title: 'Teacher Feedback',
      desc: 'Receive focused comments from your teacher. Feedback history stays visible to track improvements over time.'
    },
    {
      title: 'Download Progress',
      desc: 'Export your journey as CSV or print to PDF. Share progress with mentors or keep it for your records.'
    }
  ];
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-textsoft">Features</h2>
        <ul className="grid md:grid-cols-2 gap-4">
          {features.map((f) => (
            <li key={f.title} className="card text-left">
              <div className="font-semibold">{f.title}</div>
              <p className="text-sm text-gray-700 mt-1 leading-6">{f.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
