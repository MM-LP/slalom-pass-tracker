// components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const res = await fetch(`/api/stats/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, [user]);

  return stats ? (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Weekly Sets</h2>
      <ul>{stats.weeklySets.map((w, i) => <li key={i}>{w.week.slice(0,10)}: {w.sets} sets</li>)}</ul>
      <h2 className="text-xl font-semibold mt-6">Average Balls by Rope</h2>
      <ul>{stats.avgBallsByRope.map((r, i) => <li key={i}>{r.rope_length}m: {parseFloat(r.avg_balls).toFixed(2)}</li>)}</ul>
    </div>
  ) : <p>Loading stats...</p>;
}
