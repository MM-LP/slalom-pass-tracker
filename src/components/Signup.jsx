import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });

    if (error) {
      alert(error.message);
    } else {
      if (data.user && !data.session) {
        navigate('/confirm-email'); // 🔥 Redirect after signup
      } else if (data.session) {
        onSignup(data.session);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto text-center">
      <input name="email" type="email" placeholder="Email" required className="w-full p-2 border border-sky-300 rounded" />
      <input name="password" type="password" placeholder="Password" required className="w-full p-2 border border-sky-300 rounded" />
      <input name="username" type="text" placeholder="Username" required className="w-full p-2 border border-sky-300 rounded" />
      <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded transition ease-out">
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
