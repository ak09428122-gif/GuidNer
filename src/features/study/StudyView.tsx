import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  BrainCircuit,
  FileText,
  Plus,
  Star,
  Sparkles,
  RotateCw,
  Check,
  Zap,
  Tag,
  Search,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Target,
  BarChart3,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { StudyDocument, FlashcardDeck, Flashcard } from '../../core/database/schema';
import { aiEngine } from '../../core/ai/AIEngineService';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { M3Card } from '../../shared/components/ui/MaterialComponents';

interface StudyViewProps {
  documents: StudyDocument[];
  flashcardDecks: FlashcardDeck[];
  onSaveDocument: (doc: StudyDocument) => void;
  onSaveDeck: (deck: FlashcardDeck) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  documents,
  flashcardDecks,
  onSaveDocument,
  onSaveDeck,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'subjects' | 'pomodoro' | 'flashcards' | 'analytics'>('notes');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Subjects state for Module 8
  const [subjects] = useState([
    { id: 's1', name: 'Physics & Mechanics', progress: 82, color: 'bg-purple-600' },
    { id: 's2', name: 'Organic Chemistry', progress: 65, color: 'bg-indigo-600' },
    { id: 's3', name: 'Calculus & Algebra', progress: 91, color: 'bg-blue-600' },
    { id: 's4', name: 'Computer Science', progress: 95, color: 'bg-emerald-600' },
  ]);

  // Pomodoro Focus Timer State
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  useEffect(() => {
    checkAndTriggerScreenGuide('study');
  }, [checkAndTriggerScreenGuide]);

  // Pomodoro Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPomodoroRunning && pomodoroTime > 0) {
      timer = setInterval(() => setPomodoroTime((t) => t - 1), 1000);
    } else if (pomodoroTime === 0 && isPomodoroRunning) {
      notificationEngine.playTone('gentle_chime');
      alert('Pomodoro session complete! Take a 5-minute break.');
      setIsPomodoroRunning(false);
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(timer);
  }, [isPomodoroRunning, pomodoroTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Flashcard review state
  const [currentDeck] = useState<FlashcardDeck | null>(flashcardDecks[0] || null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const currentCard: Flashcard | undefined = currentDeck?.cards[cardIndex];

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-8 font-sans text-slate-900 dark:text-white">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pro Study Engine & Revision Hub
              </h1>
              <HelpMeUseButton screenId="study" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subjects • Notes • Pomodoro Timer • Flashcards • Goal Predictions
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'notes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'subjects' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Subjects
          </button>
          <button
            onClick={() => setActiveSubTab('pomodoro')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'pomodoro' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'flashcards' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'analytics' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* 1. NOTES TAB */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm">Notes ({documents.length})</h2>
              <button
                onClick={() => {
                  const newDoc: StudyDocument = {
                    id: `doc-${Date.now()}`,
                    title: 'New Study Note',
                    content: '# Chapter Note\n\n- Main Points\n- Key Definitions',
                    file_type: 'note',
                    tags: ['Exam'],
                    summary: 'New note summary',
                    is_favorite: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  onSaveDocument(newDoc);
                  setSelectedDocId(newDoc.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
              >
                + New Note
              </button>
            </div>

            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer ${
                    activeDoc?.id === doc.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">{doc.title}</div>
                </div>
              ))}
            </div>
          </div>

          {activeDoc && (
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="font-extrabold text-base">{activeDoc.title}</h2>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 font-mono text-xs whitespace-pre-wrap min-h-[250px]">
                {activeDoc.content}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SUBJECTS TAB */}
      {activeSubTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <M3Card key={sub.id} className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm">{sub.name}</span>
                <span className="text-xs font-bold text-purple-600">{sub.progress}% Mastery</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full ${sub.color}`} style={{ width: `${sub.progress}%` }} />
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* 3. POMODORO TIMER TAB */}
      {activeSubTab === 'pomodoro' && (
        <M3Card className="p-8 text-center space-y-6 max-w-md mx-auto">
          <Clock className="w-10 h-10 text-purple-600 mx-auto" />
          <div className="text-5xl font-mono font-black tracking-wider">
            {formatTime(pomodoroTime)}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
              className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-extrabold text-xs shadow-md"
            >
              {isPomodoroRunning ? 'Pause Session' : 'Start Focus Session'}
            </button>
            <button
              onClick={() => {
                setIsPomodoroRunning(false);
                setPomodoroTime(25 * 60);
              }}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </M3Card>
      )}

      {/* 4. FLASHCARDS TAB */}
      {activeSubTab === 'flashcards' && (
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base">Spaced Repetition Review</h3>
          {currentCard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/30 cursor-pointer font-bold text-sm min-h-[160px] flex items-center justify-center"
            >
              {isFlipped ? currentCard.back : currentCard.front}
            </div>
          ) : (
            <p className="text-xs text-slate-400">All flashcard decks reviewed!</p>
          )}
        </div>
      )}

      {/* 5. ANALYTICS TAB */}
      {activeSubTab === 'analytics' && (
        <M3Card className="p-6 space-y-4">
          <h3 className="font-extrabold text-base">Goal Prediction & Weekly Progress</h3>
          <p className="text-xs text-slate-500">
            Based on current velocity, estimated exam readiness: 94% by end of week.
          </p>
        </M3Card>
      )}
    </div>
  );
};
