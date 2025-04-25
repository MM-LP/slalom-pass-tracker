// components/UserPreferences.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UserPreferences({ user }) {
  const [formData, setFormData] = useState({
    default_rope_length: '',
    default_speed: '',
    default_zerooff: '',
    ski: '',
    optional: { boat: '', driver: '', notes: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.optional) {
      setFormData(prev => ({ ...prev, optional: { ...prev.optional, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      await fetch(`/api/users/${user.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          default_speed_unit: 'mph',
          default_rope_unit: 'ft',
          ...formData
        })
      });
      alert('Preferences saved!');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      alert('Error saving preferences');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">User Preferences</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required name="default_rope_length" placeholder="Default Rope Length" value={formData.default_rope_length} onChange={handleChange} className="p-2 border rounded" />
        <input required name="default_speed" placeholder="Default Speed" value={formData.default_speed} onChange={handleChange} className="p-2 border rounded" />
        <input required name="default_zerooff" placeholder="ZeroOff Setting" value={formData.default_zerooff} onChange={handleChange} className="p-2 border rounded" />
        <input required name="ski" placeholder="Ski Model" value={formData.ski} onChange={handleChange} className="p-2 border rounded" />
        <input name="boat" placeholder="Boat (optional)" value={formData.optional.boat} onChange={handleChange} className="p-2 border rounded" />
        <input name="driver" placeholder="Driver (optional)" value={formData.optional.driver} onChange={handleChange} className="p-2 border rounded" />
      </div>
      <textarea name="notes" placeholder="Notes (optional)" value={formData.optional.notes} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
      <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition ease-out">Save Preferences</button>
    </form>
  );
}
