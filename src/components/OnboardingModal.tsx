import React, { useState } from 'react';
import { 
  Flame, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User, 
  MapPin, 
  Globe, 
  ShieldCheck,
  X
} from 'lucide-react';
import { CurrentUser, Gender, RelationshipGoal } from '../types';
import { ALL_INTERESTS, ALL_GOALS, ALL_LANGUAGES } from '../data/mockData';
import { playPopSound } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onSaveProfile: (updated: CurrentUser) => void;
  isInitialOnboarding?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  isInitialOnboarding = false,
}) => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<CurrentUser>(currentUser);

  if (!isOpen) return null;

  const handleToggleInterest = (interest: string) => {
    playPopSound();
    setForm((prev) => {
      const exists = prev.interests.includes(interest);
      const nextInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: nextInterests };
    });
  };

  const handleToggleGoal = (goal: RelationshipGoal) => {
    playPopSound();
    setForm((prev) => {
      const exists = prev.goals.includes(goal);
      const nextGoals = exists
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: nextGoals };
    });
  };

  const handleSave = () => {
    playPopSound();
    onSaveProfile(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-[#0c0c11] border border-red-950/90 rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button if not initial */}
        {!isInitialOnboarding && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-red-950 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {isInitialOnboarding ? 'Welcome to Mizizi Connect' : 'Edit Your Profile'}
            </span>
          </div>
          <div className="text-xs font-mono text-red-400 font-bold">
            Step {step} of 4
          </div>
        </div>

        {/* STEP 1: IDENTITY & BASIC PROFILE */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Your Basic Identity</h3>
              <p className="text-zinc-400 text-[11px]">
                PRD §6 Step 2: Set up your nickname, approximate country and bio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Nickname *</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Age (18+) *</label>
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 18 })}
                  className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                  className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      country: e.target.value,
                      approxLocation: `${e.target.value}`,
                    })
                  }
                  className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Personal Bio</label>
              <textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SELECT INTERESTS */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Select Your Interests</h3>
              <p className="text-zinc-400 text-[11px]">
                Selected interests form 40% of the matching engine compatibility score.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
              {ALL_INTERESTS.map((int) => {
                const isSelected = form.interests.includes(int.name);
                return (
                  <button
                    key={int.name}
                    type="button"
                    onClick={() => handleToggleInterest(int.name)}
                    className={`p-2.5 rounded-xl border text-left font-medium cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                        : 'bg-[#14141c] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span>{int.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-red-400">
              Selected: {form.interests.length} interests
            </div>
          </div>
        )}

        {/* STEP 3: RELATIONSHIP GOALS */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">What Are You Looking For?</h3>
              <p className="text-zinc-400 text-[11px]">
                PRD §6 Step 4: Choose one or more goals to calibrate compatibility.
              </p>
            </div>

            <div className="space-y-2">
              {ALL_GOALS.map((goal) => {
                const isSelected = form.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleToggleGoal(goal)}
                    className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                        : 'bg-[#14141c] text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: DISCOVERY PREFERENCES */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Discovery Preferences</h3>
              <p className="text-zinc-400 text-[11px]">
                Define who you want to discover in the matching feed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141c] border border-red-950 space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Interested In:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'female', label: 'Women' },
                    { id: 'male', label: 'Men' },
                    { id: 'non-binary', label: 'Non-binary' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          preferences: { ...form.preferences, interestedIn: g.id as any },
                        })
                      }
                      className={`py-2 rounded-lg font-semibold border text-center ${
                        form.preferences.interestedIn === g.id
                          ? 'bg-red-950 text-red-200 border-red-600'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Min Age ({form.preferences.minAge})</label>
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={form.preferences.minAge}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preferences: {
                          ...form.preferences,
                          minAge: parseInt(e.target.value) || 18,
                        },
                      })
                    }
                    className="w-full accent-red-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Max Age ({form.preferences.maxAge})</label>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    value={form.preferences.maxAge}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preferences: {
                          ...form.preferences,
                          maxAge: parseInt(e.target.value) || 50,
                        },
                      })
                    }
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-red-950 mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                playPopSound();
                setStep((prev) => prev + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-lg shadow-red-950"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black cursor-pointer text-xs flex items-center gap-1.5 shadow-xl shadow-red-950"
            >
              <Check className="w-4 h-4" />
              <span>Complete Setup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
