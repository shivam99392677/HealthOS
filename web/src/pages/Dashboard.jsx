import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Plus, Play, Pause } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSelect = async (reportId) => {
    try {
      const report = await api.getReport(reportId);
      setSelectedReport(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await api.deleteReport(reportId);
      toast.success('Report deleted successfully');
      const updatedReports = reports.filter((r) => r.id !== reportId);
      setReports(updatedReports);
      if (selectedReport?.id === reportId) {
        setSelectedReport(updatedReports.length > 0 ? updatedReports[0] : null);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      const report = await api.createReport(newReport);
      toast.success('Report created successfully');
      setReports([report, ...reports]);
      setSelectedReport(report);
      setShowAddModal(false);
      setNewReport({
        title: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      });
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex" data-testid="dashboard">
      <Sidebar
        reports={reports}
        onReportSelect={handleReportSelect}
        selectedReportId={selectedReport?.id}
      />

      {/* Main Content */}
      <div className="flex-1 ml-[280px] p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Clinical Reports
              </h1>
              <p className="text-slate-400 mt-1">
                {reports.length} {reports.length === 1 ? 'report' : 'reports'} total
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all"
              data-testid="add-report-button"
            >
              <Plus size={20} />
              <span>New Report</span>
            </button>
          </div>

          {/* Report Viewer */}
          {selectedReport ? (
            <GlassCard className="min-h-[600px]" data-testid="report-viewer">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-white mb-2">
                    {selectedReport.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteReport(selectedReport.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  data-testid="delete-report-button"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Audio Player */}
                {selectedReport.audio_url && (
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-cyan-400 mb-3 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 text-sm">
                        ▶
                      </span>
                      Consultation Audio
                    </h3>

                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 w-full">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            if (audioRef.current.paused) {
                              audioRef.current.play();
                              setIsPlaying(true);
                            } else {
                              audioRef.current.pause();
                              setIsPlaying(false);
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 hover:scale-105 transition"
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>

                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={(e) => {
                              audioRef.current.currentTime = e.target.value;
                              setCurrentTime(e.target.value);
                            }}
                            className="w-full accent-cyan-500"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                      <audio
                        ref={audioRef}
                        src={selectedReport.audio_url}
                        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                        onEnded={() => setIsPlaying(false)}
                      />
                    </div>
                  </div>
                )}

                {/* SOAP Sections */}
                <div data-testid="soap-subjective">
                  <h3 className="text-xl font-heading font-semibold text-cyan-400 mb-3 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 text-sm">S</span>
                    Subjective
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-300 leading-relaxed">{selectedReport.subjective}</p>
                  </div>
                </div>

                <div data-testid="soap-objective">
                  <h3 className="text-xl font-heading font-semibold text-purple-400 mb-3 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-sm">O</span>
                    Objective
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-300 leading-relaxed">{selectedReport.objective}</p>
                  </div>
                </div>

                <div data-testid="soap-assessment">
                  <h3 className="text-xl font-heading font-semibold text-pink-400 mb-3 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-3 text-sm">A</span>
                    Assessment
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-300 leading-relaxed">{selectedReport.assessment}</p>
                  </div>
                </div>

                <div data-testid="soap-plan">
                  <h3 className="text-xl font-heading font-semibold text-cyan-400 mb-3 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 text-sm">P</span>
                    Plan
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-slate-300 leading-relaxed">{selectedReport.plan}</p>
                  </div>
                </div>

                {selectedReport.transcript && (
                  <div className="border-t border-white/5 pt-6 mt-6">
                    <h3 className="text-sm font-semibold text-slate-500 mb-2">Transcript</h3>
                    <p className="text-slate-400 text-sm">{selectedReport.transcript}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              Select a report from the sidebar to view details
            </div>
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
            data-testid="add-report-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800"
            >
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Create New Report</h2>
              <form onSubmit={handleAddReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600"
                    placeholder="Clinical Note - 2026-03-11"
                    required
                    data-testid="new-report-title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subjective</label>
                  <textarea
                    value={newReport.subjective}
                    onChange={(e) => setNewReport({ ...newReport, subjective: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 min-h-[100px]"
                    placeholder="Patient reports..."
                    required
                    data-testid="new-report-subjective"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Objective</label>
                  <textarea
                    value={newReport.objective}
                    onChange={(e) => setNewReport({ ...newReport, objective: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 min-h-[100px]"
                    placeholder="Clinical observations..."
                    required
                    data-testid="new-report-objective"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assessment</label>
                  <textarea
                    value={newReport.assessment}
                    onChange={(e) => setNewReport({ ...newReport, assessment: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 min-h-[100px]"
                    placeholder="Medical assessment..."
                    required
                    data-testid="new-report-assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Plan</label>
                  <textarea
                    value={newReport.plan}
                    onChange={(e) => setNewReport({ ...newReport, plan: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg text-slate-200 placeholder:text-slate-600 min-h-[100px]"
                    placeholder="Treatment plan..."
                    required
                    data-testid="new-report-plan"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-full bg-slate-800/50 text-white border border-white/10 hover:bg-slate-700/50 hover:border-white/20 transition-all"
                    data-testid="cancel-report-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all"
                    data-testid="create-report-button"
                  >
                    Create Report
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;