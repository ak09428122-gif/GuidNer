import React, { useState } from 'react';
import { User, Shield, Award, Sparkles, Edit2, Check, X, Flame, Target, BookOpen, Clock } from 'lucide-react';
import { UserProfile } from '../../core/database/schema';
import { db } from '../../core/database/db';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  stats?: {
    notesCount: number;
    vaultCount: number;
    downloadsCount: number;
    completedTasksCount: number;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  stats = { notesCount: 3, vaultCount: 3, downloadsCount: 3, completedTasksCount: 12 },
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || 'arun.olympiad@guidener.app');
  const [bio, setBio] = useState('National Physics Olympiad Candidate 2026 • GuideNer Life OS Master User');

  if (!isOpen) return null;

  const handleSave = async () => {
    const updated: UserProfile = {
      ...user,
      name,
      email,
    };
    await db.saveUserProfile(updated);
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const level = Math.floor(user.life_score / 100) + 1;
  const xp = user.life_score % 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 relative overflow-hidden">
        {/* Top header banner */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Profile & Credentials</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white relative shadow-lg">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 flex items-center justify-center shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-black text-indigo-300">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 border-2 border-slate-900 text-[10px] font-bold">
              Level {level}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300"
                />
              </div>
            ) : (
              <>
                <h3 className="font-black text-lg text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold border border-indigo-400/30">
                    Pro Member
                  </span>
                </h3>
                <p className="text-xs text-indigo-200 font-mono">{email}</p>
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{bio}</p>
              </>
            )}
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white shrink-0"
          >
            {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Gamified Level & XP Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Level {level} Master Explorer</span>
            </span>
            <span className="text-slate-500">{xp} / 100 XP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${xp}%` }}
            />
          </div>
        </div>

        {/* Saved Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <BookOpen className="w-4 h-4 text-purple-500 mx-auto mb-1" />
            <div className="font-black text-sm text-slate-900 dark:text-white">{stats.notesCount}</div>
            <div className="text-[10px] text-slate-500">Study Notes</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <Shield className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <div className="font-black text-sm text-slate-900 dark:text-white">{stats.vaultCount}</div>
            <div className="text-[10px] text-slate-500">Vault Items</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="font-black text-sm text-slate-900 dark:text-white">{stats.completedTasksCount}</div>
            <div className="text-[10px] text-slate-500">Completed Tasks</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="font-black text-sm text-slate-900 dark:text-white">7 Days</div>
            <div className="text-[10px] text-slate-500">Active Streak</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};
