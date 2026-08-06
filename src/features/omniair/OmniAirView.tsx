import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Camera,
  Paperclip,
  Mic,
  Send,
  QrCode,
  Wifi,
  Bluetooth,
  Shield,
  CheckCheck,
  Check,
  Phone,
  Video,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  UserCheck,
  Key,
  HeartPulse,
  Calendar,
  Calculator,
  MapPin,
  Lock,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Star,
  Pin,
  Smile,
  Share2,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  OmniAirChatSession,
  OmniAirMessage,
  OmniAirEngine,
  AttachmentType,
} from '../../core/database/schema';
import { offlineDB } from '../../core/database/indexedDB';
import { routeTransferEngine } from './smartRouter';
import { AttachmentDrawer } from './AttachmentDrawer';
import { OmniBeamScannerModal } from './OmniBeamScannerModal';
import { OmniDirectModal } from './OmniDirectModal';
import { OmniBluetoothModal } from './OmniBluetoothModal';
import { BiometricAuthModal } from './BiometricAuthModal';
import { RadarQueueModal } from './RadarQueueModal';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { Radio, Fingerprint, ScanFace, BatteryCharging, Zap } from 'lucide-react';

interface OmniAirViewProps {
  onSaveVaultItem?: (item: any) => void;
  onAddDownloadTask?: (task: any) => void;
}

export const OmniAirView: React.FC<OmniAirViewProps> = ({ onSaveVaultItem, onAddDownloadTask }) => {
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Chat sessions & active chat
  const [sessions, setSessions] = useState<OmniAirChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [messages, setMessages] = useState<OmniAirMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Engine selection override (null = auto routing)
  const [manualEngine, setManualEngine] = useState<OmniAirEngine | null>(null);

  // Mobile navigation view state ('list' | 'chat')
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'chat'>('list');

  // Media viewer modal state
  const [mediaViewerItem, setMediaViewerItem] = useState<{
    type: string;
    title: string;
    content?: string;
    url?: string;
  } | null>(null);

  // Reaction picker open state
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);

  // Input states
  const [inputText, setInputText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Modals
  const [isAttachmentDrawerOpen, setIsAttachmentDrawerOpen] = useState(false);
  const [isOmniBeamOpen, setIsOmniBeamOpen] = useState(false);
  const [isOmniDirectOpen, setIsOmniDirectOpen] = useState(false);
  const [isOmniBluetoothOpen, setIsOmniBluetoothOpen] = useState(false);
  const [isRadarQueueOpen, setIsRadarQueueOpen] = useState(false);
  const [isBiometricAuthOpen, setIsBiometricAuthOpen] = useState(false);
  const [pendingSecretMsgId, setPendingSecretMsgId] = useState<string | null>(null);

  // Battery Saver Mode
  const [isBatterySaver, setIsBatterySaver] = useState(false);

  // Reveal password state for secret cards
  const [revealedSecretIds, setRevealedSecretIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    checkAndTriggerScreenGuide('transfer');
  }, [checkAndTriggerScreenGuide]);

  // Initial demo sessions & load from IndexedDB
  useEffect(() => {
    const initData = async () => {
      const storedSessions = await offlineDB.getAll<OmniAirChatSession>('omniair_chats');
      if (storedSessions && storedSessions.length > 0) {
        setSessions(storedSessions);
      } else {
        const defaultSessions: OmniAirChatSession[] = [
          {
            id: 'session-1',
            name: 'Personal Workspace (Offline Beam)',
            avatar: '⚡',
            lastMessage: 'Classroom Timetable & PDF report attached',
            unreadCount: 0,
            onlineStatus: 'online',
            defaultEngine: 'omni_beam',
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'session-2',
            name: 'Dr. Sarah (Physics Teacher)',
            avatar: '👩‍🏫',
            lastMessage: 'Quantum Physics Lecture Notes 35MB',
            unreadCount: 2,
            onlineStatus: 'transferring',
            defaultEngine: 'omni_direct',
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'session-3',
            name: 'Study Group (Library BLE Mesh)',
            avatar: '📚',
            lastMessage: 'Silent ping: Group meeting in Room 4',
            unreadCount: 0,
            onlineStatus: 'online',
            defaultEngine: 'omni_bluetooth',
            isGroup: true,
            updatedAt: new Date().toISOString(),
          },
        ];
        for (const s of defaultSessions) {
          await offlineDB.put('omniair_chats', s);
        }
        setSessions(defaultSessions);
      }
    };
    initData();
  }, []);

  // Load messages for active session
  useEffect(() => {
    const loadMsgs = async () => {
      if (!activeSessionId) return;
      const storedMsgs = await offlineDB.getMessagesForSession<OmniAirMessage>(activeSessionId);
      if (storedMsgs && storedMsgs.length > 0) {
        setMessages(storedMsgs);
      } else {
        // Sample starter messages for active session
        const starterMsgs: OmniAirMessage[] = [
          {
            id: `msg-starter-1-${activeSessionId}`,
            sessionId: activeSessionId,
            senderId: 'peer',
            senderName: 'OmniAir Assistant',
            isMe: false,
            content: 'Welcome to OmniAir Transfer! Send files, text, contacts, or passwords securely.',
            engineUsed: 'omni_beam',
            status: 'read',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: `msg-starter-2-${activeSessionId}`,
            sessionId: activeSessionId,
            senderId: 'peer',
            senderName: 'OmniAir Assistant',
            isMe: false,
            content: 'Emergency Medical ICE Card attached.',
            attachmentType: 'emergency_card',
            attachmentData: { bloodGroup: 'O+', emergencyContact: '+1 (555) 911-0000', allergies: 'Penicillin' },
            engineUsed: 'omni_beam',
            status: 'read',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
          },
        ];
        for (const m of starterMsgs) {
          await offlineDB.put('omniair_messages', m);
        }
        setMessages(starterMsgs);
      }
    };
    loadMsgs();
  }, [activeSessionId]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Send message handler
  const handleSendMessage = async (
    overrideText?: string,
    attachmentType?: AttachmentType,
    attachmentData?: any,
    fileSizeNum?: number
  ) => {
    const contentToSend = overrideText !== undefined ? overrideText : inputText;
    if (!contentToSend && !attachmentType) return;

    // Determine engine via Smart Engine Router or manual override
    const decision = manualEngine
      ? {
          engine: manualEngine,
          engineName: manualEngine === 'omni_beam' ? 'OmniBeam' : manualEngine === 'omni_direct' ? 'OmniDirect' : 'OmniBluetooth',
        }
      : routeTransferEngine(contentToSend, attachmentType, fileSizeNum);

    const newMsg: OmniAirMessage = {
      id: `msg-${Date.now()}`,
      sessionId: activeSessionId,
      senderId: 'me',
      senderName: 'You',
      isMe: true,
      content: contentToSend,
      attachmentType,
      attachmentData,
      engineUsed: decision.engine,
      status: 'read',
      timestamp: new Date().toISOString(),
    };

    // Update state and IndexedDB
    const nextMsgs = [...messages, newMsg];
    setMessages(nextMsgs);
    await offlineDB.put('omniair_messages', newMsg);

    // Update session last message
    if (activeSession) {
      const updatedS: OmniAirChatSession = {
        ...activeSession,
        lastMessage: contentToSend || `Attached ${attachmentType}`,
        updatedAt: new Date().toISOString(),
      };
      await offlineDB.put('omniair_chats', updatedS);
      setSessions((prev) => prev.map((s) => (s.id === updatedS.id ? updatedS : s)));
    }

    if (overrideText === undefined) setInputText('');
  };

  const toggleStarMessage = async (msgId: string) => {
    const updated = messages.map((m) => (m.id === msgId ? { ...m, isStarred: !m.isStarred } : m));
    setMessages(updated);
    const target = updated.find((m) => m.id === msgId);
    if (target) await offlineDB.put('omniair_messages', target);
  };

  const togglePinMessage = async (msgId: string) => {
    const updated = messages.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
    setMessages(updated);
    const target = updated.find((m) => m.id === msgId);
    if (target) await offlineDB.put('omniair_messages', target);
  };

  const addReaction = async (msgId: string, emoji: string) => {
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        const reactions = m.reactions || [];
        const next = reactions.includes(emoji)
          ? reactions.filter((r) => r !== emoji)
          : [...reactions, emoji];
        return { ...m, reactions: next };
      }
      return m;
    });
    setMessages(updated);
    const target = updated.find((m) => m.id === msgId);
    if (target) await offlineDB.put('omniair_messages', target);
    setActiveReactionMsgId(null);
  };

  const currentDecision = routeTransferEngine(inputText, undefined, undefined);
  const activeEngineType = manualEngine || currentDecision.engine;

  // Filter sessions by search
  const filteredSessions = sessions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Top Banner & Status bar */}
      <div className="px-4 py-2 bg-slate-900 text-white flex items-center justify-between text-xs shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold tracking-wide text-[11px]">OmniAir Transfer Engine v2.0</span>
          <button
            onClick={() => setIsRadarQueueOpen(true)}
            className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
            title="Open Live Radar & Transfer Queue"
          >
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span className="hidden sm:inline">Radar & Queue</span>
          </button>
        </div>

        {/* Engine Switcher / Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBatterySaver(!isBatterySaver)}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all ${
              isBatterySaver ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Battery Saver Mode"
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isBatterySaver ? 'Eco ON' : 'Eco Mode'}</span>
          </button>

          <HelpMeUseButton screenId="transfer" label="Guide" />
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setManualEngine(null)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                manualEngine === null ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Auto Engine
            </button>
            <button
              onClick={() => {
                setManualEngine('omni_beam');
                setIsOmniBeamOpen(true);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                activeEngineType === 'omni_beam' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3 h-3" />
              <span>OmniBeam</span>
            </button>
            <button
              onClick={() => {
                setManualEngine('omni_direct');
                setIsOmniDirectOpen(true);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                activeEngineType === 'omni_direct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>OmniDirect</span>
            </button>
            <button
              onClick={() => {
                setManualEngine('omni_bluetooth');
                setIsOmniBluetoothOpen(true);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                activeEngineType === 'omni_bluetooth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bluetooth className="w-3 h-3" />
              <span>BLE</span>
            </button>
          </div>
        </div>
      </div>


      {/* Main WhatsApp Split Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Chat List Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 ${mobileActiveView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat List Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>OmniAir Chats</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/10 text-blue-600 font-bold">
                  {sessions.length}
                </span>
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOmniBeamOpen(true)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                  title="Scan OmniBeam QR"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    const newS: OmniAirChatSession = {
                      id: `session-${Date.now()}`,
                      name: `New Peer (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
                      avatar: '📱',
                      lastMessage: 'Chat started via OmniAir',
                      unreadCount: 0,
                      onlineStatus: 'online',
                      defaultEngine: 'omni_beam',
                      updatedAt: new Date().toISOString(),
                    };
                    await offlineDB.put('omniair_chats', newS);
                    setSessions((prev) => [newS, ...prev]);
                    setActiveSessionId(newS.id);
                    setMobileActiveView('chat');
                  }}
                  className="p-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  title="Start New Chat"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setMobileActiveView('chat');
                  }}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-slate-800/90 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl shadow-xs">
                      {session.avatar}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        session.onlineStatus === 'online'
                          ? 'bg-emerald-500'
                          : session.onlineStatus === 'transferring'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {session.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{session.lastMessage}</p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                        {session.defaultEngine.replace('_', ' ')}
                      </span>
                      {session.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-blue-600 text-white">
                          {session.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right WhatsApp Chat Screen */}
        <div className={`${mobileActiveView === 'chat' ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-50 dark:bg-slate-900/60 overflow-hidden`}>
          {activeSession ? (
            <>
              {/* WhatsApp Active Chat Header */}
              <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileActiveView('list')}
                    className="md:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                    title="Back to Chats"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg shadow-xs">
                    {activeSession.avatar}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{activeSession.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {activeSession.onlineStatus === 'online' ? 'Online' : 'P2P Active'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>AES-256 Encrypted • Engine: {activeEngineType.toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                {/* Top Action Icons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOmniBeamOpen(true)}
                    className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-bold text-xs flex items-center gap-1.5"
                    title="Transmit QR Stream"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="hidden xl:inline">Beam QR</span>
                  </button>
                  <button
                    onClick={() => setIsOmniDirectOpen(true)}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1.5"
                    title="Wi-Fi P2P File Direct"
                  >
                    <Wifi className="w-4 h-4" />
                    <span className="hidden xl:inline">Wi-Fi Direct</span>
                  </button>
                  <button
                    onClick={() => setIsOmniBluetoothOpen(true)}
                    className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-bold text-xs flex items-center gap-1.5"
                    title="Bluetooth Nearby Mesh"
                  >
                    <Bluetooth className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pinned Messages Banner */}
              {messages.some((m) => m.isPinned) && (
                <div className="px-4 py-2 bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
                  <div className="flex items-center gap-2 truncate">
                    <Pin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 fill-amber-500" />
                    <span className="font-extrabold text-[11px] shrink-0">Pinned:</span>
                    <span className="truncate text-[11px]">
                      {messages.find((m) => m.isPinned)?.content || 'Pinned Attachment'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    {messages.filter((m) => m.isPinned).length} pinned
                  </span>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/50 dark:border-slate-700">
                    TODAY
                  </span>
                </div>

                {messages.map((msg) => {
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs space-y-2 text-xs relative group/bubble ${
                          msg.isMe
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none'
                        }`}
                      >
                        {/* Star & Pin indicators */}
                        <div className="absolute -top-2 right-2 flex items-center gap-1 z-10">
                          {msg.isStarred && (
                            <span className="p-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                              <Star className="w-3 h-3 fill-amber-950" />
                            </span>
                          )}
                          {msg.isPinned && (
                            <span className="p-0.5 rounded-full bg-blue-500 text-white shadow-xs">
                              <Pin className="w-3 h-3 fill-white" />
                            </span>
                          )}
                        </div>

                        {/* Quick Message Actions Hover Menu */}
                        <div
                          className={`absolute bottom-full mb-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 text-white text-[10px] shadow-lg backdrop-blur-xs z-20 ${
                            msg.isMe ? 'right-0' : 'left-0'
                          }`}
                        >
                          <button
                            onClick={() => toggleStarMessage(msg.id)}
                            className={`p-1 rounded-lg hover:bg-white/20 ${msg.isStarred ? 'text-amber-400' : 'text-slate-300'}`}
                            title="Star message"
                          >
                            <Star className={`w-3.5 h-3.5 ${msg.isStarred ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => togglePinMessage(msg.id)}
                            className={`p-1 rounded-lg hover:bg-white/20 ${msg.isPinned ? 'text-blue-400' : 'text-slate-300'}`}
                            title="Pin message"
                          >
                            <Pin className={`w-3.5 h-3.5 ${msg.isPinned ? 'fill-blue-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                            className="p-1 rounded-lg hover:bg-white/20 text-amber-300"
                            title="React with emoji"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Reaction Picker Popup */}
                        {activeReactionMsgId === msg.id && (
                          <div className="absolute bottom-full mb-8 left-0 z-30 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
                            {['👍', '❤️', '🔥', '😂', '💡', '🎉'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(msg.id, emoji)}
                                className="p-1.5 hover:scale-125 transition-transform text-base"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message text */}
                        {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                        {/* Reactions row */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 pt-1">
                            {msg.reactions.map((emoji, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[11px] font-bold"
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Rich Attachment Card Rendering */}
                        {msg.attachmentType && (
                          <div className="mt-2 pt-2 border-t border-white/20 dark:border-slate-700 space-y-2">
                            {msg.attachmentType === 'document' && (
                              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/10 dark:bg-slate-900/50 border border-white/20">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-purple-300" />
                                  <div className="flex flex-col">
                                    <span className="font-bold truncate max-w-[140px]">
                                      {msg.attachmentData?.fileName || 'Document.pdf'}
                                    </span>
                                    <span className="text-[10px] opacity-80">
                                      {msg.attachmentData?.fileSize || '1.2 MB'} • PDF
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      setMediaViewerItem({
                                        type: 'document',
                                        title: msg.attachmentData?.fileName || 'Document.pdf',
                                        content: `Previewing file payload: ${
                                          msg.attachmentData?.fileName || 'Document.pdf'
                                        } (${msg.attachmentData?.fileSize || '1.2 MB'})`,
                                      })
                                    }
                                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                                    title="Preview File"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (onAddDownloadTask) {
                                        onAddDownloadTask({
                                          id: `dl-${Date.now()}`,
                                          source_url: 'file://' + msg.attachmentData?.fileName,
                                          file_name: msg.attachmentData?.fileName || 'Document.pdf',
                                          file_category: 'document',
                                          file_size: 1.2 * 1024 * 1024,
                                          downloaded_size: 1.2 * 1024 * 1024,
                                          status: 'completed',
                                          created_at: new Date().toISOString(),
                                        });
                                        alert('File saved to OmniAir Downloads & Vault!');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                                    title="Save File"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {msg.attachmentType === 'emergency_card' && (
                              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-black text-xs">
                                  <HeartPulse className="w-4 h-4 text-rose-400" />
                                  <span>Emergency Medical ICE Card</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
                                  <div>Blood Group: <strong className="font-bold text-white">{msg.attachmentData?.bloodGroup}</strong></div>
                                  <div>ICE Phone: <strong className="font-bold text-white">{msg.attachmentData?.emergencyContact}</strong></div>
                                </div>
                              </div>
                            )}

                            {msg.attachmentType === 'password' && (
                              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 space-y-2">
                                <div className="flex items-center justify-between font-bold text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <Key className="w-4 h-4 text-emerald-400" />
                                    <span>{msg.attachmentData?.title || 'Encrypted Key'}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      if (revealedSecretIds[msg.id]) {
                                        setRevealedSecretIds((prev) => ({ ...prev, [msg.id]: false }));
                                      } else {
                                        setPendingSecretMsgId(msg.id);
                                        setIsBiometricAuthOpen(true);
                                      }
                                    }}
                                    className="p-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] flex items-center gap-1"
                                  >
                                    {revealedSecretIds[msg.id] ? (
                                      <>
                                        <EyeOff className="w-3 h-3" />
                                        <span>Hide</span>
                                      </>
                                    ) : (
                                      <>
                                        <Fingerprint className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                                        <span>Unlock Secret</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="p-2 rounded-lg bg-black/40 font-mono text-xs select-all text-white font-bold">
                                  {revealedSecretIds[msg.id] ? msg.attachmentData?.secret : '••••••••••••••••'}
                                </div>
                              </div>
                            )}


                            {msg.attachmentType === 'timetable' && (
                              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <Calendar className="w-4 h-4 text-indigo-300" />
                                  <span>Timetable: {msg.attachmentData?.day}</span>
                                </div>
                                <p className="text-[11px] font-medium">{msg.attachmentData?.subject}</p>
                                <p className="text-[10px] opacity-80">{msg.attachmentData?.time}</p>
                              </div>
                            )}

                            {msg.attachmentType === 'bill_split' && (
                              <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <Calculator className="w-4 h-4 text-teal-300" />
                                  <span>Bill Split: {msg.attachmentData?.title}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
                                  <span>Total: ${msg.attachmentData?.total}</span>
                                  <span className="font-bold text-white bg-teal-600 px-2 py-0.5 rounded-md">
                                    Per person: ${msg.attachmentData?.perPerson}
                                  </span>
                                </div>
                              </div>
                            )}

                            {msg.attachmentType === 'location' && (
                              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <MapPin className="w-4 h-4 text-cyan-300" />
                                  <span>{msg.attachmentData?.name}</span>
                                </div>
                                <a
                                  href={msg.attachmentData?.link || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] underline font-bold text-cyan-200 block"
                                >
                                  Open GPS Coordinates on Map →
                                </a>
                              </div>
                            )}

                            {msg.attachmentType === 'contact' && (
                              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-blue-300" />
                                  <div className="flex flex-col">
                                    <span className="font-bold">{msg.attachmentData?.name}</span>
                                    <span className="text-[10px] opacity-80">{msg.attachmentData?.phone}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status bar inside message bubble */}
                        <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 mt-1 font-mono">
                          <span className="uppercase text-[9px] font-bold px-1 rounded bg-black/10">
                            {msg.engineUsed.replace('_', ' ')}
                          </span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.isMe && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Fixed WhatsApp Bottom Input Bar */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {/* Auto Engine Routing Notification Badge */}
                <div className="flex items-center justify-between px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>
                      Smart Router selected:{' '}
                      <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase">
                        {activeEngineType.replace('_', ' ')}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    AES-256 Enabled
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Camera Scanner Button */}
                  <button
                    onClick={() => setIsOmniBeamOpen(true)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all shrink-0"
                    title="Camera / QR Optical Beam"
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  {/* Attachment (+) Button */}
                  <button
                    onClick={() => setIsAttachmentDrawerOpen(true)}
                    className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shrink-0 font-bold"
                    title="Share Attachments"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    placeholder="Type a message or paste payload..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />

                  {/* Voice Note / Send Button */}
                  {inputText ? (
                    <button
                      onClick={() => handleSendMessage()}
                      className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleSendMessage('🎤 [Voice Note Recorded 0:34]', 'audio', {
                          duration: '0:34',
                          note: 'OmniAir Voice Note',
                        });
                      }}
                      className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition-all shrink-0"
                      title="Hold to record voice note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3">
              <QrCode className="w-12 h-12 text-blue-500 animate-pulse" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Select a conversation to begin transfer
              </h3>
              <p className="text-xs max-w-sm">
                OmniAir automatically selects between OmniBeam optical QR streams, OmniDirect Wi-Fi P2P, and Bluetooth BLE.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AttachmentDrawer
        isOpen={isAttachmentDrawerOpen}
        onClose={() => setIsAttachmentDrawerOpen(false)}
        onSendAttachment={(type, data) => handleSendMessage('', type, data)}
      />

      <OmniBeamScannerModal
        isOpen={isOmniBeamOpen}
        onClose={() => setIsOmniBeamOpen(false)}
        onDataScanned={(scannedText) => handleSendMessage(scannedText)}
        initialTransmitText={inputText}
      />

      <OmniDirectModal
        isOpen={isOmniDirectOpen}
        onClose={() => setIsOmniDirectOpen(false)}
        onSendFile={(fileName, fileSize) =>
          handleSendMessage(`Shared file via OmniDirect: ${fileName}`, 'document', { fileName, fileSize })
        }
      />

      <OmniBluetoothModal
        isOpen={isOmniBluetoothOpen}
        onClose={() => setIsOmniBluetoothOpen(false)}
        onSendNearbyPing={(msgText) => handleSendMessage(msgText, undefined, undefined)}
      />

      <BiometricAuthModal
        isOpen={isBiometricAuthOpen}
        onClose={() => {
          setIsBiometricAuthOpen(false);
          setPendingSecretMsgId(null);
        }}
        onSuccess={() => {
          if (pendingSecretMsgId) {
            setRevealedSecretIds((prev) => ({ ...prev, [pendingSecretMsgId]: true }));
            setPendingSecretMsgId(null);
          }
        }}
      />

      <RadarQueueModal
        isOpen={isRadarQueueOpen}
        onClose={() => setIsRadarQueueOpen(false)}
        isBatterySaver={isBatterySaver}
        onToggleBatterySaver={() => setIsBatterySaver(!isBatterySaver)}
      />

      {/* Media & Attachment Preview Viewer Modal */}
      {mediaViewerItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {mediaViewerItem.title}
                  </h3>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                    {mediaViewerItem.type} Preview
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMediaViewerItem(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[160px] flex flex-col justify-center items-center text-center space-y-2">
              <FileText className="w-10 h-10 text-blue-500 animate-pulse" />
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {mediaViewerItem.content || mediaViewerItem.title}
              </p>
              <p className="text-[10px] text-slate-400">
                Encrypted via OmniAir AES-256 Engine. High-density offline transmission verified.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {onSaveVaultItem && (
                <button
                  onClick={() => {
                    onSaveVaultItem({
                      id: `v-${Date.now()}`,
                      title: mediaViewerItem.title,
                      category: 'document',
                      encrypted_payload: JSON.stringify(mediaViewerItem),
                      iv: 'iv-omniair',
                      updated_at: new Date().toISOString(),
                    });
                    alert('Saved to Vault!');
                    setMediaViewerItem(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Save to Vault
                </button>
              )}
              <button
                onClick={() => setMediaViewerItem(null)}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};
