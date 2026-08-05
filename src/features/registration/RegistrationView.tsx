import React, { useState, useEffect } from 'react';
import { FileCheck2, User, School, Award, CheckCircle2, QrCode, Download, ArrowRight, ArrowLeft, Printer } from 'lucide-react';
import { RegistrationForm } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface RegistrationViewProps {
  registrationForms: RegistrationForm[];
  onSaveRegistration: (form: RegistrationForm) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  registrationForms,
  onSaveRegistration,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedForm, setSubmittedForm] = useState<RegistrationForm | null>(
    registrationForms[0] || null
  );
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('registration');
  }, [checkAndTriggerScreenGuide]);

  // Form State
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [grade, setGrade] = useState('Grade 11');
  const [dob, setDob] = useState('2008-05-15');
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [schoolName, setSchoolName] = useState('Delhi Public School, R.K. Puram');
  const [city, setCity] = useState('New Delhi');
  const [selectedExam, setSelectedExam] = useState('International Mathematics Olympiad (IMO)');

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const form: RegistrationForm = {
      id: `reg-${Date.now()}`,
      student_name: studentName,
      grade,
      date_of_birth: dob,
      email,
      phone,
      school_name: schoolName,
      city,
      selected_olympiads: [selectedExam],
      status: 'approved',
      registration_number: `GNER-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      submitted_at: new Date().toISOString(),
    };

    onSaveRegistration(form);
    setSubmittedForm(form);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Olympiad Registration Portal</h1>
            <HelpMeUseButton screenId="registration" label="Walkthrough" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-step Registration • Hall Ticket Generation • Instant QR Verification
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {['1. Student Info', '2. Olympiad Choice', '3. Documents', '4. Hall Ticket'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          return (
            <div
              key={label}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-md'
                  : isDone
                  ? 'bg-teal-500/10 text-teal-600 border-teal-500/20 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="text-xs truncate">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Student Information */}
      {currentStep === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            <span>Student Personal Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Grade / Class</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Next: Select Olympiad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Olympiad Choice */}
      {currentStep === 2 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <span>Select Target Olympiad Examination</span>
          </h2>

          <div className="space-y-3">
            {[
              'International Mathematics Olympiad (IMO)',
              'National Science Olympiad (NSO)',
              'International Cyber Olympiad (NCO)',
              'International English Olympiad (IEO)',
            ].map((exam) => (
              <div
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedExam === exam
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{exam}</span>
                {selectedExam === exam && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Next: School Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: School & Verification */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmitRegistration} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-5 h-5 text-teal-600" />
            <span>School Name & Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">School Name</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">City / District</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Submit & Generate Hall Ticket</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Generated Hall Ticket */}
      {currentStep === 4 && submittedForm && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-teal-500 shadow-2xl space-y-6 max-w-2xl mx-auto text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h2 className="font-extrabold text-xl text-teal-600 dark:text-teal-400">Official Olympiad Hall Ticket</h2>
              <p className="text-xs text-slate-500">Registration ID: {submittedForm.registration_number}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified & Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase">Candidate Name</span>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{submittedForm.student_name}</div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase">Class / Grade</span>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{submittedForm.grade}</div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase">Olympiad Exam</span>
              <div className="font-bold text-sm text-teal-600 dark:text-teal-400">{submittedForm.selected_olympiads[0]}</div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase">School</span>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{submittedForm.school_name}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-xs">Exam Center Code: DEL-1049</div>
              <div className="text-[11px] text-slate-500">Exam Date: November 24, 2026 • 10:00 AM</div>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300">
              <QrCode className="w-12 h-12 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => alert('Downloading Hall Ticket PDF...')}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Ticket</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
