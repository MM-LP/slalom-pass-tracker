// components/Login.jsx
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/Metamarine Wave Sm 96.png';

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else onLogin(data.session);
  };

  return (
    <div className="text-center space-y-6">
      <img src={logo} alt="Logo" className="mx-auto h-32" />
      <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-sky-300 text-transparent bg-clip-text drop-shadow">Metamarine Sport</h1>
      <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
        <input name="email" type="email" placeholder="Email" className="w-full p-2 border border-sky-300 rounded" />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 border border-sky-300 rounded" />
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded transition ease-out">Login</button>
        <p className="text-sm text-sky-400">Don’t have an account? <span onClick={() => navigate('/signup')} className="underline cursor-pointer">Sign up</span></p>
      </form>
    </div>
  );
}
