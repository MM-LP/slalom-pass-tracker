import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Assuming you have this ready
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

  return (
    <Router>
      <div className="min-h-screen font-urbanist bg-sky-50 dark:bg-sky-950 text-sky-900 dark:text-sky-100 transition-colors ease-out">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">🚀 Slalom Pass Tracker is Live!</h1>
          <p className="mb-4">Welcome! Your frontend is working. 🎉</p>
          <nav className="mb-4 space-x-4">
            <Link className="underline" to="/">Home</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2 className="text-2xl">Home Page</h2>
      <p>This is your temporary landing page. Build your Dashboard, Settings, New Set next! 🚀</p>
    </div>
  );
}
