import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Recorder from '../components/RecorderB';
import GlassCard from '../components/GlassCard';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRecordClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleRecordingComplete = (report) => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced ML pipeline converts voice to structured SOAP notes',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant data storage with end-to-end encryption',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate comprehensive clinical notes in seconds',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium border border-cyan-500/30">
                AI Clinical Documentation Assistant
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600">
                HealthOS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
              Transform Voice into
              <span className="text-cyan-400 font-semibold"> Perfect Clinical Notes</span>
            </p>

            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Speak naturally. Our AI converts your patient consultations into structured SOAP notes instantly.
            </p>

            {/* Voice Recorder */}
            <div className="mb-8" onClick={!isAuthenticated ? handleRecordClick : undefined}>
              {isAuthenticated ? (
                <Recorder onRecordingComplete={handleRecordingComplete} />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer inline-block"
                  data-testid="hero-record-button"
                >
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white glow-red mx-auto">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                      <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-30" />
                  </div>
                  <p className="mt-4 text-slate-400">Sign in to start recording</p>
                </motion.div>
              )}
            </div>

            {!isAuthenticated && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all"
                data-testid="hero-get-started"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </motion.button>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                className="text-center"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4 glow-cyan">
                  <feature.icon size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </GlassCard>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-32 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Record', description: 'Click the microphone and speak naturally during patient consultation' },
                { step: '02', title: 'Process', description: 'AI transcribes and structures your notes into SOAP format' },
                { step: '03', title: 'Review', description: 'Access, edit, and export your clinical notes from the dashboard' },
              ].map((item, index) => (
                <div key={index} className="relative" data-testid={`how-it-works-${index}`}>
                  <div className="text-7xl font-heading font-bold text-cyan-500/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>&copy; 2026 HealthOS. Transforming clinical documentation with AI.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;