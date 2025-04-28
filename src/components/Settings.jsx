import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Settings({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(true);

  const [ropeLengths, setRopeLengths] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [zeroOffOptions, setZeroOffOptions] = useState([]);

  const [defaults, setDefaults] = useState({
    rope_unit: 'M',
    default_rope_length: '',
    speed_unit: 'Mph',
    default_speed: '',
    default_zerooff: '',
    ski_brand: '',
    ski_model: '',
    ski_length: '65' // Default Ski Length
  });

  useEffect(() => {
    async function fetchLookups() {
      const { data: ropeData } = await supabase.from('slalom_rope').select('*');
      const { data: speedData } = await supabase.from('slalom_speed').select('*');
      const { data: zeroOffData } = await supabase.from('slalom_speed_ctrl').select('*');

      if (ropeData) setRopeLengths(ropeData);
      if (speedData) setSpeeds(speedData);
      if (zeroOffData) setZeroOffOptions(zeroOffData);

      setLookupLoading(false);
    }

    fetchLookups();
  }, []);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('users')
        .select('rope_unit, default_rope_length, speed_unit, default_speed, default_zerooff, ski_brand, ski_model, ski_length')
        .eq('id', user.id)
        .single();

      if (data) {
        setDefaults(prev => ({
          ...prev,
          ...data,
          ski_length: data.ski_length || '65'
        }));
      }
    }

    if (user) {
      loadSettings();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDefaults(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update(defaults)
      .eq('id', user.id);

    if (!error) {
      navigate('/dashboard');
    } else {
      alert('Error saving settings.');
    }
    setLoading(false);
  };

  if (lookupLoading) return <div className="text-center p-6">Loading settings...</div>;

  const skiLengths = [
    '60', '60.5', '61', '61.5', '62', '62.5', '63', '63.5',
    '64', '64.5', '65', '65.5', '66', '66.5', '67', '67.5',
    '68', '68.5', '69', '69.5', '70'
  ];

  // Dynamic filtering/sorting
  const filteredRopeLengths = defaults.rope_unit === 'M'
    ? [...ropeLengths].sort((a, b) => b.length_m - a.length_m)
    : [...ropeLengths].sort((a, b) => a.length_ft - b.length_ft);

  const filteredSpeeds = defaults.speed_unit === 'Kph'
    ? [...speeds].sort((a, b) => a.speed_kph - b.speed_kph)
    : [...speeds].sort((a, b) => a.speed_mph - b.speed_mph);

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-sky-300">🎯 Set Your Preferences</h1>

      {/* Grouped Box for First Pass Settings */}
      <div className="border-2 border-sky-300 rounded-2xl p-6 mb-8">
        <label className="block text-left text-gray-700 dark:text-sky-300 text-lg font-semibold mb-6">
          1st Pass Default Settings
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {/* Rope Unit */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-sky-300">Rope Unit</label>
            <select
              name="rope_unit"
              value={defaults.rope_unit}
              onChange={handleChange}
              className="w-24 p-2 border border-sky-300 rounded"
              required
            >
              <option value="M">M</option>
              <option value="Ft">Ft</option>
            </select>
          </div>

          {/* Rope Length */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-sky-300">
              Rope Length {defaults.rope_unit === 'Ft' && <span>off</span>}
            </label>
            <select
              name="default_rope_length"
              value={defaults.default_rope_length}
              onChange={handleChange}
              className="w-24 p-2 border border-sky-300 rounded"
              required
            >
              {filteredRopeLengths.map(rope => (
                <option key={rope.id} value={defaults.rope_unit === 'M' ? rope.length_m : rope.length_ft}>
                  {defaults.rope_unit === 'M' ? `${rope.length_m} m` : `${rope.length_ft} off`}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Unit */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-sky-300">Speed Unit</label>
            <select
              name="speed_unit"
              value={defaults.speed_unit}
              onChange={handleChange}
              className="w-24 p-2 border border-sky-300 rounded"
              required
            >
              <option value="Mph">Mph</option>
              <option value="Kph">Kph</option>
            </select>
          </div>

          {/* Speed */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-sky-300">Speed</label>
            <select
              name="default_speed"
              value={defaults.default_speed}
              onChange={handleChange}
              className="w-24 p-2 border border-sky-300 rounded"
              required
            >
              {filteredSpeeds.map(speed => (
                <option key={speed.id} value={defaults.speed_unit === 'Kph' ? speed.speed_kph : speed.speed_mph}>
                  {defaults.speed_unit === 'Kph' ? `${speed.speed_kph} kph` : `${speed.speed_mph} mph`}
                </option>
              ))}
            </select>
          </div>

          {/* ZeroOff */}
          <div className="col-span-2 md:col-span-1">
            <label className="block mb-1 text-gray-700 dark:text-sky-300">ZeroOff</label>
            <select
              name="default_zerooff"
              value={defaults.default_zerooff}
              onChange={handleChange}
              className="w-24 p-2 border border-sky-300 rounded"
              required
            >
              {zeroOffOptions.map(opt => (
                <option key={opt.id} value={opt.setting}>{opt.setting}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ski Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Ski Brand */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-gray-700 dark:text-sky-300">Ski Brand</label>
          <input
            name="ski_brand"
            value={defaults.ski_brand}
            onChange={handleChange}
            placeholder="Connelly, Radar..."
            className="w-full p-2 border border-sky-300 rounded"
          />
        </div>

        {/* Ski Model */}
        <div>
          <label className="block mb-1 text-gray-700 dark:text-sky-300">Ski Model</label>
          <input
            name="ski_model"
            value={defaults.ski_model}
            onChange={handleChange}
            placeholder="Carbon V, Senate Pro..."
            className="w-full p-2 border border-sky-300 rounded"
          />
        </div>

        {/* Ski Length */}
        <div>
          <label className="block mb-1 text-gray-700 dark:text-sky-300">Ski Length</label>
          <select
            name="ski_length"
            value={defaults.ski_length || '65'}
            onChange={handleChange}
            className="w-24 p-2 border border-sky-300 rounded"
            required
          >
            {skiLengths.map(length => (
              <option key={length} value={length}>{length}"</option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded transition ease-out mt-8"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
