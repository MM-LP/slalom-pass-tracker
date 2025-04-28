import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './index.css';
import Dashboard from './components/Dashboard.jsx';
import UserPreferences from './components/UserPreferences.jsx';
import NewSet from './components/NewSet.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import logo from './assets/Metamarine Wave Sm 96.png';
import ConfirmEmail from './components/ConfirmEmail.jsx'; 
import Settings from './components/Settings.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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

  return (
    <Router>
      <div className="min-h-screen font-urbanist bg-sky-50 dark:bg-sky-950 text-sky-900 dark:text-sky-100 transition-colors ease-out">
        <div className="max-w-4xl mx-auto p-6">
          {session ? (
            <>
              <nav className="flex justify-between items-center mb-6">
                <img src={logo} alt="Metamarine Sport Logo" className="h-16" />
                <div className="space-x-4">
                  <Link to="/dashboard" className="underline">Dashboard</Link>
                  <Link to="/settings" className="underline">Settings</Link>
                  <Link to="/new-set" className="underline">New Set</Link>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-sky-400 hover:text-sky-200 ml-4"
                  >
                    Logout
                  </button>
                </div>
              </nav>
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
                <Route path="/settings" element={<UserPreferences user={user} />} />
                <Route path="/new-set" element={<NewSet user={user} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </>
          ) : (
            <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
              <Route path="/signup" element={<Signup onSignup={setSession} />} />
              <Route path="*" element={<Login onLogin={setSession} />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/settings" element={<Settings user={user} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}
