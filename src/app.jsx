// App.jsx – Main Router and Layout

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import logo from './assets/Metamarine Wave Sm 96.png';
import './index.css';
import Dashboard from './components/Dashboard.jsx';
import UserPreferences from './components/UserPreferences.jsx';
import NewSet from './components/NewSet.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
<q></q>

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      console.error("VITE_BACKEND_URL is not set in environment variables.");
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
      setToken(data.session?.access_token || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setToken(session?.access_token || null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && token) {
      console.log('API_URL', API_URL);
      console.log('User ID', user.id);
      console.log('JWT Token', token);

      fetch(`${API_URL}/api/stats/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          console.log('Fetch Status:', res.status);
          return res.json();
        })
        .then(data => console.log('Fetched stats:', data))
        .catch(err => console.error('Fetch error:', err));
    }
  }, [user, token]);

  return (
    <Router>
      <div className="min-h-screen font-urbanist bg-sky-50 dark:bg-sky-950 text-sky-900 dark:text-sky-100 transition-colors ease-out">
        <div className="max-w-4xl mx-auto p-6">
          {session ? (
            <>
              <nav className="mb-4 space-x-4">
                <Link className="underline" to="/dashboard">Dashboard</Link>
                <Link className="underline" to="/settings">Settings</Link>
                <Link className="underline" to="/new-set">New Set</Link>
                <button onClick={() => supabase.auth.signOut()} className="text-sky-400 hover:text-sky-200 ml-4">Logout</button>
              </nav>
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={session.user} />} />
                <Route path="/settings" element={<UserPreferences user={session.user} />} />
                <Route path="/new-set" element={<NewSet user={session.user} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/signup" element={<Signup onSignup={setSession} />} />
              <Route path="*" element={<Login onLogin={setSession} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

function Login({ onLogin }) {
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

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
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