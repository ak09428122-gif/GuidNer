import React, { useState } from 'react';
import {
  FileText,
  Image,
  Camera,
  Mic,
  UserCheck,
  Key,
  HeartPulse,
  Calendar,
  Calculator,
  MapPin,
  X,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { AttachmentType } from '../../core/database/schema';

interface AttachmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAttachment: (type: AttachmentType, data: any) => void;
}

export const AttachmentDrawer: React.FC<AttachmentDrawerProps> = ({
  isOpen,
  onClose,
  onSendAttachment,
}) => {
  const [activeModal, setActiveModal] = useState<AttachmentType | null>(null);

  // Form states for rich attachment types
  const [docName, setDocName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passTitle, setPassTitle] = useState('');
  const [passVal, setPassVal] = useState('');
  const [bloodType, setBloodType] = useState('A+');
  const [emgContact, setEmgContact] = useState('');
  const [ttDay, setTtDay] = useState('Monday');
  const [ttClass, setTtClass] = useState('');
  const [billTitle, setBillTitle] = useState('');
  const [billTotal, setBillTotal] = useState('');
  const [billPeople, setBillPeople] = useState('3');
  const [locLabel, setLocLabel] = useState('Current GPS Location');

  if (!isOpen) return null;

  const attachmentOptions: {
    type: AttachmentType;
    label: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    description: string;
  }[] = [
    {
      type: 'document',
      label: 'Document / PDF',
      icon: FileText,
      color: 'bg-purple-500 text-white',
      description: 'PDFs, Docs, Office & Study files',
    },
    {
      type: 'gallery',
      label: 'Gallery',
      icon: Image,
      color: 'bg-pink-500 text-white',
      description: 'Photos, Screenshots & Media',
    },
    {
      type: 'camera',
      label: 'Camera',
      icon: Camera,
      color: 'bg-red-500 text-white',
      description: 'Take instant picture or scan',
    },
    {
      type: 'audio',
      label: 'Audio Note',
      icon: Mic,
      color: 'bg-amber-500 text-white',
      description: 'Voice note & sound file',
    },
    {
      type: 'contact',
      label: 'Contact (vCard)',
      icon: UserCheck,
      color: 'bg-blue-500 text-white',
      description: 'Share contact information',
    },
    {
      type: 'password',
      label: 'Secure Note',
      icon: Key,
      color: 'bg-emerald-500 text-white',
      description: 'AES Encrypted password snippet',
    },
    {
      type: 'emergency_card',
      label: 'Emergency Card',
      icon: HeartPulse,
      color: 'bg-rose-600 text-white',
      description: 'Medical ICE info & Blood Group',
    },
    {
      type: 'timetable',
      label: 'Timetable',
      icon: Calendar,
      color: 'bg-indigo-500 text-white',
      description: 'Class & work schedule card',
    },
    {
      type: 'bill_split',
      label: 'Bill Split',
      icon: Calculator,
      color: 'bg-teal-500 text-white',
      description: 'Calculate and share group expense',
    },
    {
      type: 'location',
      label: 'Location Card',
      icon: MapPin,
      color: 'bg-cyan-500 text-white',
      description: 'GPS location & map link',
    },
  ];

  const handleSelect = (type: AttachmentType) => {
    if (type === 'gallery' || type === 'camera' || type === 'audio') {
      // Trigger instant simulation or file input
      if (type === 'gallery') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*,.pdf';
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            onSendAttachment('gallery', {
              fileName: file.name,
              fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              fileType: file.type,
              url: URL.createObjectURL(file),
            });
            onClose();
          }
        };
        input.click();
      } else if (type === 'camera') {
        onSendAttachment('camera', {
          capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Photo snapshot via OmniAir Camera',
        });
        onClose();
      } else {
        onSendAttachment('audio', {
          duration: '0:42',
          audioUrl: '',
          note: 'Recorded Voice Note',
        });
        onClose();
      }
    } else {
      setActiveModal(type);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    let payload: any = {};
    if (activeModal === 'document') {
      payload = { fileName: docName || 'Class_Notes_2026.pdf', fileSize: '1.2 MB' };
    } else if (activeModal === 'contact') {
      payload = { name: contactName || 'Prof. Alex Smith', phone: contactPhone || '+1 (555) 019-2834' };
    } else if (activeModal === 'password') {
      payload = { title: passTitle || 'Wi-Fi Password', secret: passVal || 'GuideNer@2026!' };
    } else if (activeModal === 'emergency_card') {
      payload = { bloodGroup: bloodType, emergencyContact: emgContact || '+1 (555) 911-0000', allergies: 'Penicillin' };
    } else if (activeModal === 'timetable') {
      payload = { day: ttDay, subject: ttClass || 'Advanced Quantum AI (Lab 3)', time: '10:00 AM - 12:00 PM' };
    } else if (activeModal === 'bill_split') {
      const tot = parseFloat(billTotal) || 60;
      const p = parseInt(billPeople) || 3;
      payload = { title: billTitle || 'Group Lunch & Prints', total: tot, count: p, perPerson: (tot / p).toFixed(2) };
    } else if (activeModal === 'location') {
      payload = { name: locLabel, lat: 37.7749, lng: -122.4194, link: 'https://maps.google.com' };
    }

    onSendAttachment(activeModal, payload);
    setActiveModal(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Share Attachment</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                10 Transfer Types
              </span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10 Grid Options */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {attachmentOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                onClick={() => handleSelect(opt.type)}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all text-center group"
              >
                <div className={`p-3 rounded-2xl ${opt.color} shadow-md group-hover:scale-110 transition-transform mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate w-full">{opt.label}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-form Modal for Rich Payload Attachments */}
      {activeModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={submitForm}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white capitalize">
                {activeModal.replace('_', ' ')} Details
              </h4>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === 'document' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Title / File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics_Lab_Report.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Name & Phone</label>
                <input
                  type="text"
                  required
                  placeholder="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {activeModal === 'password' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Encrypted Secret Title & Value</label>
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. Lab Portal Key)"
                  value={passTitle}
                  onChange={(e) => setPassTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <input
                  type="password"
                  required
                  placeholder="Secret Value / Password"
                  value={passVal}
                  onChange={(e) => setPassVal(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {activeModal === 'emergency_card' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Emergency Medical Card</label>
                <div className="flex gap-2">
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="Emergency Contact Phone"
                    value={emgContact}
                    onChange={(e) => setEmgContact(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeModal === 'timetable' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Class / Work Schedule</label>
                <select
                  value={ttDay}
                  onChange={(e) => setTtDay(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Class / Meeting Title"
                  value={ttClass}
                  onChange={(e) => setTtClass(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {activeModal === 'bill_split' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expense & Split Count</label>
                <input
                  type="text"
                  required
                  placeholder="Expense Description (e.g. Pizza & Books)"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Total Amount ($)"
                    value={billTotal}
                    onChange={(e) => setBillTotal(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="People"
                    value={billPeople}
                    onChange={(e) => setBillPeople(e.target.value)}
                    className="w-24 p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeModal === 'location' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location Name / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Library Room 3B"
                  value={locLabel}
                  onChange={(e) => setLocLabel(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Attach & Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
