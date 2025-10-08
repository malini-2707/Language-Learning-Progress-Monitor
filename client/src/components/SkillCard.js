export default function SkillCard({ title, value }) {
  return (
    <div className="bg-[#FFEDE3] shadow-md rounded-2xl p-6 hover:scale-105 transition">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-4xl font-bold text-[#F6BFA0] mt-2">{value}%</p>
    </div>
  );
}
