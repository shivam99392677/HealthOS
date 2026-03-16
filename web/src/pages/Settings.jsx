import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Users, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      setProfile({
        name: data.name || user?.displayName || '',
        age: data.age || '',
        gender: data.gender || '',
        email: data.email || user?.email || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.updateProfile({
        name: profile.name,
        age: parseInt(profile.age),
        gender: profile.gender,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex" data-testid="settings-page">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              Settings
            </h1>
            <p className="text-slate-400">Manage your account settings and preferences</p>
          </motion.div>

          {/* Profile Form */}
          <GlassCard data-testid="settings-form">
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center glow-cyan">
                <span className="text-slate-950 font-heading font-bold text-3xl">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-semibold text-white">{profile.name || 'User'}</h2>
                <p className="text-slate-400">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 transition-colors"
                    placeholder="Dr. John Smith"
                    required
                    data-testid="settings-name-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                    disabled
                    data-testid="settings-email-input"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="number"
                      name="age"
                      value={profile.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 transition-colors"
                      placeholder="30"
                      min="18"
                      max="120"
                      required
                      data-testid="settings-age-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 transition-colors appearance-none"
                      required
                      data-testid="settings-gender-input"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-8 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="settings-save-button"
                >
                  <Save size={20} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Additional Info */}
          <GlassCard className="mt-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">About HealthOS</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Version: 1.0.0</p>
              <p>Mode: {import.meta.env.VITE_FIREBASE_API_KEY ? 'Firebase' : 'Development (Mock)'}</p>
              <p className="text-xs text-slate-500 mt-4">
                Note: Audio transcription and SOAP generation will be available once ML pipeline is integrated.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;