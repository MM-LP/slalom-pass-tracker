import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import WelcomeBack from './WelcomeBack.jsx'; // 🆕

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    async function checkUserProfile() {
      const { data, error } = await supabase
        .from('users')
        .select('default_speed, default_rope_length')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        if (!data.default_speed || !data.default_rope_length) {
          navigate('/settings'); // 🔥 Redirect if missing info
        } else {
          setProfileLoaded(true); // Show welcome
        }
      }
    }

    if (user) {
      checkUserProfile();
    }
  }, [user, navigate]);

  if (!profileLoaded) return null; // prevent flashing wrong page

  return <WelcomeBack user={user} />;
}
