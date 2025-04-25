// components/Signup.jsx
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Signup({ onSignup }) {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) alert(error.message);
    else onSignup(data.session);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto">
      <input name="username" type="text" placeholder="Username" className="w-full p-2 border border-sky-300 rounded" />
      <input name="email" type="email" placeholder="Email" className="w-full p-2 border border-sky-300 rounded" />
      <input name="password" type="password" placeholder="Password" className="w-full p-2 border border-sky-300 rounded" />
      <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition ease-out">Create Account</button>
      <p className="text-sm text-sky-400">Already have an account? <span onClick={() => navigate('/')} className="underline cursor-pointer">Login</span></p>
    </form>
  );
}
