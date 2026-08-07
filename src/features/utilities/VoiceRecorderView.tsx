import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  FolderPlus,
  Tag,
  Volume2,
  Scissors,
  Share2,
  Trash2,
  Sparkles,
  Download,
  Check,
  RotateCcw,
} from 'lucide-react';

export interface VoiceRecording {
  id: string;
  title: string;
  durationSecs: number;
  date: string;
  folder: string;
  tags: string[];
  audioUrl?: string;
}

export const VoiceRecorderView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  const [noiseReduction, setNoiseReduction] = useState(true);

  const [recordings, setRecordings] = useState<VoiceRecording[]>([
    {
      id: 'rec-1',
      title: 'Lecture Note - Quantum Computing',
      durationSecs: 245,
      date: 'Today 10:15 AM',
      folder: 'Lectures',
      tags: ['Physics', 'Exam'],
    },
    {
      id: 'rec-2',
      title: 'Voice Memo - Project Planning',
      durationSecs: 78,
      date: 'Yesterday 04:30 PM',
      folder: 'Ideas',
      tags: ['Work', 'Brainstorm'],
    },
  ]);

  // Record timer effect
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const newRec: VoiceRecording = {
      id: `rec-${Date.now()}`,
      title: `Recording ${recordings.length + 1}`,
      durationSecs: recordingSeconds || 12,
      date: 'Just now',
      folder: 'General',
      tags: ['Voice Note'],
    };
    setRecordings([newRec, ...recordings]);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">Studio Voice Recorder</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              HD Lossless Audio • AI Noise Cancellation • Folder Tagging • Waveform Trimmer
            </p>
          </div>
        </div>

        {/* AI Noise Reduction Toggle */}
        <button
          onClick={() => setNoiseReduction(!noiseReduction)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all ${
            noiseReduction
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Noise Reduction: {noiseReduction ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Studio Recorder Widget */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-sm">
        {/* Animated Sound Waveforms */}
        <div className="flex items-center justify-center gap-1.5 h-16">
          {[40, 70, 30, 90, 50, 100, 60, 80, 40, 90, 30, 60].map((h, i) => (
            <div
              key={i}
              style={{
                height: isRecording ? `${Math.max(12, (h * Math.sin(recordingSeconds + i)) % 100)}%` : '20%',
              }}
              className={`w-1.5 rounded-full transition-all duration-200 ${
                isRecording ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Recording Timer */}
        <div className="text-5xl font-mono font-black tracking-wider text-slate-900 dark:text-white">
          {formatTime(recordingSeconds)}
        </div>

        {/* Record Control Button */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={() => setIsRecording(true)}
              className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
            >
              <Mic className="w-7 h-7" />
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-16 h-16 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Recordings Library List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-sm">Saved Studio Recordings ({recordings.length})</h3>

        <div className="space-y-3">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingId(isPlayingId === rec.id ? null : rec.id)}
                  className="p-3 rounded-xl bg-amber-600 text-white shadow-md hover:bg-amber-700 transition-all"
                >
                  {isPlayingId === rec.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{rec.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span>{formatTime(rec.durationSecs)}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                      {rec.folder}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Trimmer tool opened for ' + rec.title)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 text-xs font-bold"
                  title="Trim Audio"
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert('Share Voice Note')}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 text-xs font-bold"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRecordings(recordings.filter((r) => r.id !== rec.id))}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
