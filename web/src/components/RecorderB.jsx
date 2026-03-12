import { useState, useRef } from 'react';
import { Mic, Square, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../services/api';

const Recorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Recording stopped. Click upload to process.');
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      const response = await api.uploadAudio(file);
      
      toast.success('Audio uploaded successfully! (Mock mode - ML pipeline not integrated)');
      
      if (onRecordingComplete) {
        onRecordingComplete(response.report);
      }
      
      setAudioBlob(null);
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Failed to upload audio');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6" data-testid="recorder-component">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full text-white font-bold transition-all ${
          isRecording
            ? 'bg-gradient-to-r from-red-600 to-pink-700 glow-red animate-pulse'
            : 'bg-gradient-to-r from-red-500 to-pink-600 glow-red'
        }`}
        data-testid="record-button"
        disabled={isUploading}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Square size={32} fill="white" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic size={36} />
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      <div className="text-center">
        <p className="text-lg font-medium text-slate-300">
          {isRecording ? 'Recording...' : audioBlob ? 'Ready to upload' : 'Click to start recording'}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {isRecording ? 'Click to stop' : audioBlob ? 'Upload to generate SOAP note' : 'Record patient consultation'}
        </p>
      </div>

      <AnimatePresence>
        {audioBlob && !isRecording && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={uploadAudio}
            disabled={isUploading}
            className="flex items-center space-x-2 px-8 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="upload-button"
          >
            <Upload size={20} />
            <span>{isUploading ? 'Uploading...' : 'Upload & Process'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recorder;