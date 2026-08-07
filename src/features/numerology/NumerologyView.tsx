import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Heart,
  Calendar,
  Sun,
  Shield,
  Award,
  Zap,
  Info,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { M3Button, M3Card } from '../../shared/components/ui/MaterialComponents';

export interface NumerologyProfile {
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  luckyNumber: number;
  luckyColor: string;
  luckyDay: string;
  luckyDirection: string;
}

export const NumerologyView: React.FC = () => {
  const [dob, setDob] = useState('2004-05-18');
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('guidener_user_name') || 'GuideNer User';
  });

  // Compatibility State
  const [partnerDob, setPartnerDob] = useState('2005-09-24');
  const [partnerName, setPartnerName] = useState('Priya Sharma');

  // Helper to reduce number down to single digit (or master numbers 11, 22, 33)
  const reduceNumber = (num: number, allowMaster = true): number => {
    while (num > 9) {
      if (allowMaster && (num === 11 || num === 22 || num === 33)) return num;
      num = num
        .toString()
        .split('')
        .reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return num;
  };

  // Calculate Life Path Number
  const calculateLifePath = (dateStr: string): number => {
    if (!dateStr) return 7;
    const digits = dateStr.replace(/-/g, '').split('').map(Number);
    const sum = digits.reduce((acc, curr) => acc + curr, 0);
    return reduceNumber(sum);
  };

  const lifePath = calculateLifePath(dob);

  // Life Path Descriptions Database
  const lifePathMeanings: Record<number, { title: string; trait: string; career: string; element: string }> = {
    1: { title: 'The Leader & Pioneer', trait: 'Independent, ambitious, self-driven, innovative', career: 'Entrepreneur, Executive, Research Scientist', element: 'Fire' },
    2: { title: 'The Peacemaker & Diplomat', trait: 'Harmonious, intuitive, empathetic, cooperative', career: 'Counselor, Diplomat, Educator, Artist', element: 'Water' },
    3: { title: 'The Creative Communicator', trait: 'Expressive, joyful, artistic, charismatic', career: 'Author, Media Specialist, Designer, Actor', element: 'Air' },
    4: { title: 'The Master Builder & Planner', trait: 'Disciplined, reliable, structured, grounded', career: 'Civil Engineer, Architect, Financial Planner', element: 'Earth' },
    5: { title: 'The Freedom Seeker & Explorer', trait: 'Versatile, adventurous, dynamic, quick-witted', career: 'Journalist, Travel Explorer, Software Architect', element: 'Air' },
    6: { title: 'The Nurturer & Visionary', trait: 'Compassionate, responsible, protective, loving', career: 'Doctor, Psychologist, Community Organizer', element: 'Earth' },
    7: { title: 'The Seeker of Wisdom & Truth', trait: 'Analytical, introspective, spiritual, intellectual', career: 'Data Scientist, Astrophysicist, Philosopher', element: 'Water' },
    8: { title: 'The Powerhouse & Leader of Abundance', trait: 'Authoritative, strategic, goal-oriented, decisive', career: 'Venture Capitalist, CEO, Legal Expert', element: 'Fire' },
    9: { title: 'The Humanitarian & Universal Healer', trait: 'Generous, altruistic, wise, idealistic', career: 'Philanthropist, Doctor, Environmental Champion', element: 'Universal' },
    11: { title: 'Master Number 11 — The Intuitive Illuminator', trait: 'Spiritual awakening, high vision, inspiration', career: 'Visionary Leader, Master Coach, Scholar', element: 'Ether' },
    22: { title: 'Master Number 22 — The Master Architect', trait: 'Turns grand visions into concrete reality', career: 'Global Builder, Innovator, Pioneer', element: 'Ether' },
  };

  const meaning = lifePathMeanings[lifePath] || lifePathMeanings[7];

  // Derived Lucky Assets
  const luckyColor = ['Ruby Red', 'Emerald Green', 'Royal Violet', 'Topaz Gold', 'Sapphire Blue', 'Cyan White'][lifePath % 6];
  const luckyDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][lifePath % 7];
  const luckyDirection = ['North-East (Ishan)', 'North', 'East', 'South-East', 'South', 'West'][lifePath % 6];

  // Compatibility score calculation
  const partnerLifePath = calculateLifePath(partnerDob);
  const diff = Math.abs(lifePath - partnerLifePath);
  const compatibilityScore = 100 - diff * 8;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">Offline Numerology Engine</h1>
        </div>
        <p className="text-xs text-purple-200">
          Instant offline calculation of Life Path, Destiny Numbers, Vastu Directions & Compatibility
        </p>
      </div>

      {/* DOB Input Panel */}
      <M3Card variant="elevated" className="p-6 space-y-4 max-w-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date of Birth (DOB)</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </M3Card>

      {/* Main Life Path Number Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <M3Card variant="elevated" className="p-8 text-center space-y-4 bg-gradient-to-b from-purple-900 to-indigo-950 text-white">
          <span className="text-xs font-black uppercase tracking-widest text-purple-300">Your Core Life Path</span>
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-4xl text-purple-300">
              {lifePath}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-base text-purple-100">{meaning.title}</div>
            <p className="text-xs text-purple-200/80">{meaning.trait}</p>
          </div>
        </M3Card>

        {/* Lucky Assets Card */}
        <M3Card variant="outlined" className="md:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Auspicious Elements & Lucky Alignments</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Lucky Number</span>
              <div className="font-black text-lg text-indigo-600 dark:text-indigo-400">{lifePath}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Lucky Color</span>
              <div className="font-bold text-sm text-purple-600 dark:text-purple-400">{luckyColor}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Auspicious Day</span>
              <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{luckyDay}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Vastu Direction</span>
              <div className="font-bold text-sm text-amber-600 dark:text-amber-400">{luckyDirection}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
            <span className="font-bold">Recommended Career Fields:</span> {meaning.career}
          </div>
        </M3Card>
      </div>

      {/* Numerology Compatibility Calculator */}
      <M3Card variant="elevated" className="p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-sm">
          <Heart className="w-5 h-5 fill-current" />
          <span>Numerology Relationship & Partner Compatibility Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Partner / Colleague Name</label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Partner Date of Birth</label>
            <input
              type="date"
              value={partnerDob}
              onChange={(e) => setPartnerDob(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-rose-900 dark:text-rose-200">
              {fullName} (Path {lifePath}) & {partnerName} (Path {partnerLifePath})
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400">
              High vibrational synergy & shared intellectual focus.
            </div>
          </div>
          <div className="font-mono font-black text-2xl text-rose-600 dark:text-rose-400">
            {compatibilityScore}%
          </div>
        </div>
      </M3Card>
    </div>
  );
};
