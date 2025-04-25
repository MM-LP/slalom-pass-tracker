// components/NewSet.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function NewSet({ user }) {
  const [pass, setPass] = useState({
    ropeLength: '',
    speed: '',
    zeroOff: '',
    balls: '',
    timestamp: new Date().toISOString()
  });

  const updateField = (e) => setPass(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const body = {
        course_id: null,
        created_at: new Date().toISOString(),
        notes: '',
        passes: [pass]
      };
      await fetch('/api/sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      alert('Set saved!');
    } catch (err) {
      console.error('Failed to save set:', err);
      alert('Error saving set');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">Log New Set</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="ropeLength" value={pass.ropeLength} onChange={updateField} placeholder="Rope Length (m)" className="p-2 border rounded" />
        <input name="speed" value={pass.speed} onChange={updateField} placeholder="Speed (kph)" className="p-2 border rounded" />
        <input name="zeroOff" value={pass.zeroOff} onChange={updateField} placeholder="ZeroOff" className="p-2 border rounded" />
        <input name="balls" value={pass.balls} onChange={updateField} placeholder="# of Balls" type="number" className="p-2 border rounded" />
      </div>
      <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition ease-out">Save Pass</button>
    </form>
  );
}
