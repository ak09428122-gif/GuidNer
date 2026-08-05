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
} from 'lucide-react';
import { StudyDocument, FlashcardDeck, Flashcard } from '../../core/database/schema';
import { aiEngine } from '../../core/ai/AIEngineService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

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
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'flashcards' | 'ai_tutor'>('notes');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('study');
  }, [checkAndTriggerScreenGuide]);

  // Flashcard review state
  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(flashcardDecks[0] || null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Tutor prompt generator
  const [tutorTopic, setTutorTopic] = useState('Quadratic Equations & Complex Roots');
  const [tutorExplanation, setTutorExplanation] = useState('');

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleGenerateAIExplanation = () => {
    const text = aiEngine.generateConceptExplanation(tutorTopic);
    setTutorExplanation(text);
  };

  const currentCard: Flashcard | undefined = currentDeck?.cards[cardIndex];

  const handleCardRating = (score: number) => {
    if (!currentDeck || !currentCard) return;
    setIsFlipped(false);
    if (cardIndex < currentDeck.cards.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      setCardIndex(0);
      alert('Deck review complete! Excellent work retaining concepts.');
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Workspace Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Study Hub & Olympiad Prep</h1>
              <HelpMeUseButton screenId="study" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart Notes • Spaced Repetition Flashcards • AI Tutor
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'notes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Notes & PDF</span>
          </button>

          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ai_tutor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'ai_tutor'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>

      {/* 1. NOTES & DOCUMENTS TAB */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Directory Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">Documents ({documents.length})</h2>
              <button
                onClick={() => {
                  const newDoc: StudyDocument = {
                    id: `doc-${Date.now()}`,
                    title: 'New Physics Note',
                    content: '# Physics Mechanics\n\n- Mass and Acceleration\n- $F = ma$',
                    file_type: 'note',
                    tags: ['Physics'],
                    summary: 'New note summary',
                    is_favorite: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  onSaveDocument(newDoc);
                  setSelectedDocId(newDoc.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    activeDoc?.id === doc.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 text-purple-950 dark:text-purple-100 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{doc.title}</span>
                    {doc.is_favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
                    {doc.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Content Reader / Editor Pane */}
          {activeDoc && (
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">{activeDoc.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                    <span>Tags: {activeDoc.tags.join(', ')}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onSaveDocument({
                      ...activeDoc,
                      is_favorite: !activeDoc.is_favorite,
                    })
                  }
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                >
                  <Star
                    className={`w-4 h-4 ${
                      activeDoc.is_favorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Document Summary AI Box */}
              {activeDoc.summary && (
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-purple-900 dark:text-purple-200">
                    <strong className="font-bold">AI Summary: </strong>
                    {activeDoc.summary}
                  </div>
                </div>
              )}

              {/* Document Markdown Content Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[300px]">
                {activeDoc.content}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FLASHCARDS TAB */}
      {activeSubTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-purple-600" />
              <span>Spaced Repetition Review</span>
            </h2>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Card {cardIndex + 1} of {currentDeck?.cards.length || 0}
            </div>
          </div>

          {currentCard ? (
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Interactive Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full max-w-xl min-h-[260px] p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-lg hover:border-purple-500 ${
                  isFlipped ? 'border-purple-500 bg-purple-50/20' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase mb-4">
                  {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}
                </div>

                <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
              </div>

              {/* SRS Rating Buttons */}
              <div className="flex items-center gap-3 w-full max-w-xl">
                <button
                  onClick={() => handleCardRating(1)}
                  className="flex-1 py-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  Again (1d)
                </button>
                <button
                  onClick={() => handleCardRating(2)}
                  className="flex-1 py-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-all border border-amber-500/20"
                >
                  Hard (2d)
                </button>
                <button
                  onClick={() => handleCardRating(3)}
                  className="flex-1 py-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-500/20 transition-all border border-blue-500/20"
                >
                  Good (4d)
                </button>
                <button
                  onClick={() => handleCardRating(4)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                >
                  Easy (7d)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">No flashcards available in this deck.</div>
          )}
        </div>
      )}

      {/* 3. AI TUTOR TAB */}
      {activeSubTab === 'ai_tutor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              <span>AI Instant Concept Explainer</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={tutorTopic}
                onChange={(e) => setTutorTopic(e.target.value)}
                placeholder="Enter any topic or formula (e.g. Newton's 3rd Law)"
                className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleGenerateAIExplanation}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explain Concept</span>
              </button>
            </div>

            {tutorExplanation && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-700">
                {tutorExplanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
