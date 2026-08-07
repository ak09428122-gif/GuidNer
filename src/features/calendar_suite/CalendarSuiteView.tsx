import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Bookmark,
  CheckCircle2,
  Flag,
  Globe,
} from 'lucide-react';
import { M3Button, M3Card } from '../../shared/components/ui/MaterialComponents';

export type CalendarSystem = 'gregorian' | 'vikram_samvat' | 'nepali_bs';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  category: 'academic' | 'festival' | 'panchang' | 'personal';
  description?: string;
}

export const CalendarSuiteView: React.FC = () => {
  const [system, setSystem] = useState<CalendarSystem>('gregorian');
  const [selectedDate, setSelectedDate] = useState<number>(7);

  // Sample Events Database
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'e-1',
      title: 'National Physics Olympiad Mock Test 1',
      time: '10:00 AM - 01:00 PM',
      date: '2026-08-07',
      category: 'academic',
      description: 'Covers Kinematics, Thermodynamics & Electromagnetism',
    },
    {
      id: 'e-2',
      title: 'Janmashtami Shubh Muhurat & Puja',
      time: 'All Day Event',
      date: '2026-08-07',
      category: 'festival',
      description: 'Rohini Nakshatra & Ashtami Tithi Fasting',
    },
    {
      id: 'e-3',
      title: 'Nepali Gai Jatra / Sa Paru Cultural Festival',
      time: 'All Day Public Holiday',
      date: '2026-08-07',
      category: 'festival',
      description: 'Traditional procession across Kathmandu Valley',
    },
  ]);

  // Panchang Data for Indian Vikram Samvat (2083 VS)
  const panchangData = {
    samvat: '2083 Vikram Samvat',
    tithi: 'Krishna Paksha Ashtami (8th Tithi)',
    nakshatra: 'Rohini Nakshatra (till 04:12 PM)',
    yog: 'Vriddhi Yoga',
    karana: 'Kaulava Karana',
    rahukaal: '10:45 AM - 12:20 PM',
    gulikkala: '07:30 AM - 09:05 AM',
    yamaganda: '03:30 PM - 05:05 PM',
    sunrise: '05:46 AM',
    sunset: '07:04 PM',
  };

  // Nepali BS Months Data (2083 BS)
  const nepaliMonths = [
    'Baishakh',
    'Jestha',
    'Ashadh',
    'Shrawan',
    'Bhadra',
    'Ashwin',
    'Kartik',
    'Mangsir',
    'Poush',
    'Magh',
    'Falgun',
    'Chaitra',
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top System Switcher Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-amber-400" />
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">Triple Calendar Suite</h1>
            </div>
            <p className="text-xs text-amber-200">
              Gregorian, Indian Vikram Samvat (2083 VS) & Nepali Bikram Sambat (2083 BS)
            </p>
          </div>

          {/* Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'gregorian', label: 'Gregorian Calendar' },
              { id: 'vikram_samvat', label: 'Vikram Samvat (VS)' },
              { id: 'nepali_bs', label: 'Nepali Sambat (BS)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSystem(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all shrink-0 ${
                  system === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SYSTEM 1: GREGORIAN CALENDAR */}
      {system === 'gregorian' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Month Calendar Grid */}
          <M3Card variant="elevated" className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">August 2026</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`p-3 rounded-2xl font-black text-xs transition-all text-center relative ${
                    selectedDate === day
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {day}
                  {day === 7 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </M3Card>

          {/* Agenda & Events Sheet */}
          <M3Card variant="outlined" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Events & Deadlines</h3>
              <M3Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                Add Event
              </M3Button>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{ev.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                      {ev.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ev.time}
                  </div>
                  {ev.description && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      {ev.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </M3Card>
        </div>
      )}

      {/* SYSTEM 2: INDIAN VIKRAM SAMVAT & PANCHANG */}
      {system === 'vikram_samvat' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <M3Card variant="elevated" className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-base">
              <Sun className="w-5 h-5" />
              <span>Daily Hindu Panchang & Shubh Muhurat</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-slate-500 text-[10px] block">SAMVAT YEAR</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">{panchangData.samvat}</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-slate-500 text-[10px] block">TODAY'S TITHI</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">{panchangData.tithi}</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-slate-500 text-[10px] block">NAKSHATRA</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">{panchangData.nakshatra}</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                <span className="text-slate-500 text-[10px] block">RAHU KAAL (INFORBIDDEN)</span>
                <span className="font-extrabold text-rose-600 text-sm">{panchangData.rahukaal}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-amber-200 text-xs space-y-1">
              <div className="font-bold">Shubh Abhijit Muhurat Today:</div>
              <p>11:58 AM to 12:52 PM — Highly auspicious for starting study drills & exams.</p>
            </div>
          </M3Card>

          <M3Card variant="outlined" className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Upcoming Festivals & Vrat Dates</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Krishna Janmashtami', date: '23 Shrawan / 07 August', type: 'Vrat & Festival' },
                { name: 'Ganesh Chaturthi', date: '11 Bhadra / 27 August', type: 'Grand Festival' },
                { name: 'Anant Chaturdashi', date: '21 Bhadra / 06 September', type: 'Auspicious Vrat' },
                { name: 'Navratri Start', date: '08 Ashwin / 22 September', type: '9 Days Fasting' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between font-bold"
                >
                  <span className="text-slate-900 dark:text-white">{f.name}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">{f.date}</span>
                </div>
              ))}
            </div>
          </M3Card>
        </div>
      )}

      {/* SYSTEM 3: NEPALI BIKRAM SAMBAT */}
      {system === 'nepali_bs' && (
        <div className="space-y-6">
          <M3Card variant="elevated" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-base">
                <Flag className="w-5 h-5" />
                <span>Nepali Bikram Sambat 2083 BS Calendar</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-xs">
                Active Month: Shrawan 2083 BS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              {nepaliMonths.map((m, idx) => (
                <div
                  key={m}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    m === 'Shrawan'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div>Month {idx + 1}</div>
                  <div className="font-extrabold text-sm">{m}</div>
                </div>
              ))}
            </div>
          </M3Card>
        </div>
      )}
    </div>
  );
};
