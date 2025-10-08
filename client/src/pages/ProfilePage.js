import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [edit, setEdit] = useState({ bio: '', language: '', milestones: '' });

  const load = async () => {
    try {
      const { data } = await api.get('/me');
      setMe(data);
      setEdit({
        bio: data?.bio || '',
        language: data?.language || '',
        milestones: (data?.progress?.milestones || []).join(', ')
      });
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bio: edit.bio,
        language: edit.language,
        progress: { milestones: edit.milestones.split(',').map(s=>s.trim()).filter(Boolean) }
      };
      await api.put('/me', payload);
      toast.success('Profile updated');
      load();
    } catch (e) { toast.error('Update failed'); }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        {me && (
          <div className="mt-2 text-gray-700">
            <p><strong>Name:</strong> {me.name}</p>
            <p><strong>Email:</strong> {me.email}</p>
            <p><strong>Teacher:</strong> {me.teacherId ? me.teacherId.name : 'Not assigned'}</p>
          </div>
        )}
      </div>

      <form onSubmit={save} className="card">
        <h3 className="font-semibold mb-3">Edit Details</h3>
        <textarea className="rounded-xl p-3 bg-white w-full mb-3" placeholder="About me" value={edit.bio} onChange={(e)=>setEdit({...edit, bio: e.target.value})} />
        <input className="rounded-xl p-3 bg-white w-full mb-3" placeholder="Language" value={edit.language} onChange={(e)=>setEdit({...edit, language: e.target.value})} />
        <input className="rounded-xl p-3 bg-white w-full mb-4" placeholder="Milestones (comma separated)" value={edit.milestones} onChange={(e)=>setEdit({...edit, milestones: e.target.value})} />
        <button className="btn-peach" type="submit">Save</button>
      </form>
    </div>
  );
}
