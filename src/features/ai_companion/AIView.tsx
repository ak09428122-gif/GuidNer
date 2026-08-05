import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Brain,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { AIPersona, AIMemory } from '../../core/database/schema';
import { aiEngine, ChatMessage } from '../../core/ai/AIEngineService';
import { AI_PERSONA_CONFIGS } from '../../core/theme/tokens';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface AIViewProps {
  persona: AIPersona;
  setPersona: (p: AIPersona) => void;
  aiMemories: AIMemory[];
  onAddMemory: (key: string, value: string) => void;
}

export const AIView: React.FC<AIViewProps> = ({ persona, setPersona, aiMemories, onAddMemory }) => {
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('ai');
  }, [checkAndTriggerScreenGuide]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Greetings! I am GuideNer AI, running in ${AI_PERSONA_CONFIGS[persona].label} mode. How can I assist you with your life OS goals, study subjects, or daily schedule today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    const history = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text,
    }));

    const result = await aiEngine.sendMessage(promptText, persona, history);

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: result.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfflineFallback: result.isOffline,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsGenerating(false);

    if (isVoiceActive) {
      notificationEngine.playTone('gentle_chime');
    }
  };

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryKey && newMemoryValue) {
      onAddMemory(newMemoryKey, newMemoryValue);
      setNewMemoryKey('');
      setNewMemoryValue('');
      setIsMemoryModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-8 flex flex-col min-h-[calc(100vh-120px)]">
      {/* Header & Persona Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">GuideNer AI Companion</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Gemini 3.6
              </span>
              <HelpMeUseButton screenId="ai" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proactive intelligence • Context-aware life guide
            </p>
          </div>
        </div>

        {/* Persona Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['friendly', 'professional', 'strict', 'minimal'] as AIPersona[]).map((pKey) => {
            const cfg = AI_PERSONA_CONFIGS[pKey];
            const isSelected = persona === pKey;
            return (
              <button
                key={pKey}
                onClick={() => setPersona(pKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`p-2 rounded-2xl shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl space-y-1.5 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>

              <div className="flex items-center justify-between pt-1 text-[10px] opacity-75">
                <span>{msg.timestamp}</span>
                {msg.isOfflineFallback && (
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Offline Smart Mode</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-purple-600 text-white animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
              <span>GuideNer AI is processing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {[
          'Summarize today\'s progress',
          'Help me understand Quadratic Equations',
          'Generate 3-step study strategy',
          'Give me a strict motivational speech',
        ].map((promptText) => (
          <button
            key={promptText}
            onClick={() => handleSend(promptText)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all shrink-0"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`p-2.5 rounded-xl transition-all ${
            isVoiceActive
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
          title="Toggle Simulated Voice Input"
        >
          {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask GuideNer AI (${AI_PERSONA_CONFIGS[persona].label} Mode)...`}
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
        />

        <button
          onClick={() => setIsMemoryModalOpen(true)}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
          title="Manage AI Memory Context"
        >
          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isGenerating}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* AI Memory Context Modal */}
      {isMemoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Memory Explorer</h3>
              </div>
              <button
                onClick={() => setIsMemoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              GuideNer remembers key goals, preferences, and facts to personalize your Life OS guidance.
            </p>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {aiMemories.map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs space-y-0.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{m.key}</div>
                  <div className="text-slate-600 dark:text-slate-400">{m.value}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMemorySubmit} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Context Fact</div>
              <input
                type="text"
                placeholder="Fact Title (e.g., Preferred Study Hours)"
                value={newMemoryKey}
                onChange={(e) => setNewMemoryKey(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Fact Detail (e.g., Morning 6:00 AM to 9:00 AM)"
                value={newMemoryValue}
                onChange={(e) => setNewMemoryValue(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Save Memory Fact</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
