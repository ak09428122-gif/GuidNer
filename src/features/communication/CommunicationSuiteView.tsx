import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Radio,
  Wifi,
  WifiOff,
  Search,
  Plus,
  Send,
  Image as ImageIcon,
  Mic,
  FileText,
  User,
  Users,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  Sparkles,
  Paperclip,
  Smile,
  Circle,
  Download,
  Share2,
  Settings,
  X,
  Volume2,
  Clock,
  ArrowLeft,
  Pin,
  Archive,
  PhoneOff,
  MicOff,
  Camera,
  Heart,
  ThumbsUp,
  Flame,
  Laugh,
} from 'lucide-react';
import { M3Button, M3Card } from '../../shared/components/ui/MaterialComponents';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'file';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: 'sending' | 'delivered' | 'read';
  isOfflineP2P?: boolean;
  reactions?: string[];
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  isGroup?: boolean;
  isChannel?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOfflinePeer?: boolean;
  ipAddress?: string;
  rssiSignal?: number; // dBm
}

export const CommunicationSuiteView: React.FC = () => {
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'nearby_p2p' | 'channels'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('chat-1');

  // Input State
  const [messageText, setMessageText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Call Overlays
  const [activeCallType, setActiveCallType] = useState<'voice' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Mock User Account State
  const [userName] = useState(() => localStorage.getItem('guidener_user_name') || 'GuideNer User');

  // Initial Threads Data (Online & Offline Peers)
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'chat-1',
      name: 'GuideNer AI Assistant',
      avatar: '🤖',
      status: 'online',
      isPinned: true,
      unreadCount: 0,
      lastMessage: 'I have backed up your offline notes & calendar events.',
      lastMessageTime: '10:42 AM',
    },
    {
      id: 'chat-2',
      name: 'Study Circle Group',
      avatar: '🎓',
      status: 'online',
      isGroup: true,
      unreadCount: 2,
      lastMessage: 'Alex shared Quantum Mechanics Chapter 4 PDF',
      lastMessageTime: '09:15 AM',
    },
    {
      id: 'channel-1',
      name: 'GuideNer Tech Broadcast',
      avatar: '📢',
      status: 'online',
      isChannel: true,
      unreadCount: 1,
      lastMessage: 'Official Release v2.4 Live with Full Camera LOG & Vault Security!',
      lastMessageTime: '08:00 AM',
    },
    {
      id: 'p2p-1',
      name: 'Pixel 8 Pro (Nearby Peer)',
      avatar: '📱',
      status: 'online',
      unreadCount: 1,
      lastMessage: 'Direct P2P Bluetooth connected (RSSI -42 dBm)',
      lastMessageTime: 'Just now',
      isOfflinePeer: true,
      rssiSignal: -42,
      ipAddress: '192.168.49.12',
    },
  ]);

  // Messages State indexed by Thread ID
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'chat-1': [
      {
        id: 'm1',
        senderId: 'ai',
        senderName: 'GuideNer AI Assistant',
        text: 'Hello! I am your AI Companion. All our conversations are encrypted locally.',
        timestamp: '10:40 AM',
        type: 'text',
        status: 'read',
        reactions: ['👍'],
      },
      {
        id: 'm2',
        senderId: 'ai',
        senderName: 'GuideNer AI Assistant',
        text: 'I have backed up your offline notes & calendar events.',
        timestamp: '10:42 AM',
        type: 'text',
        status: 'read',
      },
    ],
    'chat-2': [
      {
        id: 'm3',
        senderId: 'alex',
        senderName: 'Alex River',
        text: 'Hey team, here is the syllabus notes for physics test.',
        timestamp: '09:10 AM',
        type: 'text',
        status: 'read',
      },
    ],
  });

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];
  const activeMessages = messages[selectedThreadId] || [];

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => setVoiceTimer((prev) => prev + 1), 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Active call timer
  useEffect(() => {
    let interval: any;
    if (activeCallType) {
      interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCallType]);

  const handleSendMessage = (textToSend?: string, type: 'text' | 'image' | 'file' | 'voice' = 'text', mediaUrl?: string, fileName?: string) => {
    const finalContent = textToSend || messageText;
    if (!finalContent.trim() && type === 'text') return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: userName,
      text: finalContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      mediaUrl,
      fileName,
      status: 'delivered',
      isOfflineP2P: !isOnlineMode || selectedThread.isOfflinePeer,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedThreadId]: [...(prev[selectedThreadId] || []), newMessage],
    }));

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, lastMessage: type === 'image' ? '📷 Image' : type === 'voice' ? '🎙️ Voice Note' : finalContent, lastMessageTime: 'Just now' }
          : t
      )
    );

    setMessageText('');
    setShowAttachMenu(false);
    setShowEmojiPicker(false);
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [selectedThreadId]: (prev[selectedThreadId] || []).map((m) => {
        if (m.id === msgId) {
          const current = m.reactions || [];
          return { ...m, reactions: current.includes(emoji) ? current : [...current, emoji] };
        }
        return m;
      }),
    }));
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'nearby_p2p') return t.isOfflinePeer && matchesSearch;
    if (activeTab === 'groups') return t.isGroup && matchesSearch;
    if (activeTab === 'channels') return t.isChannel && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl text-slate-900 dark:text-white font-sans relative">
      {/* Sidebar Threads List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight">Communication Pro</h2>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> End-to-End Encrypted
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOnlineMode(!isOnlineMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isOnlineMode
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}
            >
              {isOnlineMode ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnlineMode ? 'Online' : 'Offline Mesh'}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, channels & peers..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold focus:outline-none border border-transparent"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 text-xs font-bold border-t border-slate-100 dark:border-slate-800 pt-1 overflow-x-auto no-scrollbar">
            {['chats', 'groups', 'channels', 'nearby_p2p'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-indigo-600 text-white font-black' : 'text-slate-500'
                }`}
              >
                {tab === 'nearby_p2p' ? 'P2P Mesh' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Threads List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 no-scrollbar">
          {filteredThreads.map((thread) => {
            const isSelected = thread.id === selectedThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                  isSelected ? 'bg-indigo-50 dark:bg-slate-800/90 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl">
                    {thread.avatar}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs truncate">{thread.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{thread.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                    {thread.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col h-full bg-slate-100/50 dark:bg-slate-950 relative">
        <div className="px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl">
              {selectedThread.avatar}
            </div>
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <span>{selectedThread.name}</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Active Now • 256-Bit Encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCallType('voice')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveCallType('video')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium space-y-1 relative group ${
                    isMe ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex gap-1 pt-1">
                      {msg.reactions.map((r, idx) => (
                        <span key={idx} className="bg-black/20 px-1.5 py-0.5 rounded-md text-[10px]">{r}</span>
                      ))}
                    </div>
                  )}

                  {/* Reaction Toolbar on Hover */}
                  <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-md">
                    {['👍', '❤️', '🔥', '😂'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-all text-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type encrypted message..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice/Video Call Overlay Modal */}
      {activeCallType && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-200">
          <div className="text-center space-y-2 mt-8">
            <div className="w-24 h-24 rounded-full bg-indigo-600 text-4xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              {selectedThread.avatar}
            </div>
            <h3 className="font-black text-xl">{selectedThread.name}</h3>
            <p className="text-xs text-indigo-400 font-mono">
              {activeCallType === 'voice' ? 'Encrypted HD Voice Call' : '4K LOG Video Stream'} • {callDuration}s
            </p>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full text-white shadow-lg ${isMuted ? 'bg-rose-600' : 'bg-slate-800'}`}
            >
              <MicOff className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveCallType(null)}
              className="p-5 rounded-full bg-rose-600 text-white shadow-2xl hover:scale-110 transition-all"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
