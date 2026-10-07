import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  UserPlus, 
  LogIn, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Globe, 
  User,
  ShieldCheck,
  Heart,
  Target,
  ArrowRight,
  Users
} from 'lucide-react';
import { CurrentUser, Gender, RelationshipGoal } from '../types';
import { playPopSound, playMatchFanfare } from '../utils/audio';
import { ALL_INTERESTS, ALL_GOALS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (newUser: CurrentUser) => void;
  currentUser: CurrentUser;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
];

const ACCOUNTS_STORAGE_KEY = 'mizizi_accounts_list';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentUser,
}) => {
  const [activeMode, setActiveMode] = useState<'create' | 'switch'>('create');
  
  // Registration Form State
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState<Gender>('female');
  const [country, setCountry] = useState('Tanzania');
  const [city, setCity] = useState('Dar es Salaam');
  const [bio, setBio] = useState('Excited to make genuine connections on Mizizi!');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Music', 'Travel']);
  const [selectedGoal, setSelectedGoal] = useState<RelationshipGoal>('Make friends');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  // Saved accounts list
  const [savedAccounts, setSavedAccounts] = useState<CurrentUser[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        setSavedAccounts(JSON.parse(stored));
      } else {
        // initialize with current user if not present
        const initList = [currentUser];
        setSavedAccounts(initList);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initList));
      }
    } catch {
      setSavedAccounts([currentUser]);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    playPopSound();
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 6
        ? [...prev, interest]
        : prev
    );
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('Please enter your nickname or display name');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email or phone number');
      return;
    }

    playPopSound();
    playMatchFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#ef4444', '#f59e0b', '#ffffff'],
      });
    } catch {
      // ignore
    }

    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    const newAccount: CurrentUser = {
      ...currentUser,
      id: `usr-${Date.now()}`,
      nickname: nickname.trim(),
      email: email.trim(),
      age: Number(age),
      gender: gender as any,
      country: country.trim() || 'Tanzania',
      approxLocation: `${city.trim() || 'Dar es Salaam'}, ${country.trim() || 'Tanzania'}`,
      avatarUrl: finalAvatar,
      photos: [finalAvatar],
      bio: bio.trim(),
      interests: selectedInterests.length > 0 ? selectedInterests : ['Technology', 'Music'],
      goals: [selectedGoal],
      verified: true,
      onlineStatus: 'online',
      // New users start as Free Previewers so they can test the paywall!
      isSubscribed: false,
      subscriptionPlan: 'free',
      likedUserIds: [],
      skippedUserIds: [],
      blockedUserIds: [],
    };

    // Save to list of accounts
    const updatedList = [newAccount, ...savedAccounts.filter((a) => a.id !== newAccount.id)];
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedList));
      setSavedAccounts(updatedList);
    } catch {
      // ignore
    }

    onAuthSuccess(newAccount);
    onClose();
  };

  const handleSelectExistingAccount = (account: CurrentUser) => {
    playPopSound();
    playMatchFanfare();
    onAuthSuccess(account);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0c0c12] border-2 border-red-950/90 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header - compact & clean */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-900 border border-red-500/50 flex items-center justify-center mx-auto shadow-lg shadow-red-950/60">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
            mizizi<span className="text-red-500 font-sans text-sm">·2.0</span>
          </h2>
          <p className="text-xs text-zinc-400">
            {activeMode === 'create'
              ? 'Create your personal Mizizi account in seconds'
              : 'Switch between accounts or sign in'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#14141c] p-1 rounded-2xl border border-red-950/80 mb-5">
          <button
            type="button"
            onClick={() => setActiveMode('create')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'create'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Account</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('switch')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'switch'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch / Log In ({savedAccounts.length})</span>
          </button>
        </div>

        {/* 1. CREATE ACCOUNT FORM */}
        {activeMode === 'create' && (
          <form onSubmit={handleCreateAccount} className="space-y-4 text-xs text-left">
            {/* Avatar Picker */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-2">
                Choose Profile Photo:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {AVATAR_PRESETS.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="avatar option"
                    onClick={() => {
                      setSelectedAvatar(av);
                      setCustomAvatarUrl('');
                    }}
                    className={`w-11 h-11 rounded-full object-cover cursor-pointer transition-all flex-shrink-0 ${
                      selectedAvatar === av && !customAvatarUrl
                        ? 'ring-2 ring-red-500 scale-105 border-2 border-black'
                        : 'opacity-60 hover:opacity-100 border border-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                className="w-full mt-2 bg-[#14141c] text-white px-3 py-2 rounded-xl border border-red-950/80 text-[11px] focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Nickname & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Nickname / Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neema, Kelvin, Amina"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-[#14141c] text-white pl-9 pr-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Email or Phone *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+255 712... or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#14141c] text-white pl-9 pr-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Create your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#14141c] text-white pl-9 pr-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Age (18+) *</label>
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dar es Salaam"
                  className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Tanzania"
                  className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Relationship Goal */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                What are you looking for?
              </label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value as RelationshipGoal)}
                className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
              >
                {ALL_GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Interests Selector */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Select Interests (Pick up to 6):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-[#12121a] rounded-xl border border-red-950/60">
                {ALL_INTERESTS.map((item) => {
                  const isSelected = selectedInterests.includes(item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleInterest(item.name)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short note about yourself..."
                className="w-full bg-[#14141c] text-white px-3 py-2.5 rounded-xl border border-red-950 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 rounded-xl shadow-xl shadow-red-950 cursor-pointer text-sm transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Start Exploring</span>
            </button>
          </form>
        )}

        {/* 2. SWITCH / LOG IN ACCOUNTS */}
        {activeMode === 'switch' && (
          <div className="space-y-4 text-xs text-left">
            <div>
              <h4 className="text-zinc-300 font-bold mb-2">Saved Accounts on this Device:</h4>
              <div className="space-y-2">
                {savedAccounts.map((acc) => {
                  const isCurrent = acc.id === currentUser.id;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-red-950/40 border-red-600 ring-1 ring-red-500'
                          : 'bg-[#14141c] border-red-950/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatarUrl}
                          alt={acc.nickname}
                          className="w-10 h-10 rounded-xl object-cover border border-red-500/50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{acc.nickname}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400">{acc.approxLocation} · {acc.email}</span>
                        </div>
                      </div>

                      {!isCurrent ? (
                        <button
                          type="button"
                          onClick={() => handleSelectExistingAccount(acc)}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-red-950"
                        >
                          Switch
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-xs">Logged In</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Pre-set Profiles for instant review */}
            <div className="pt-3 border-t border-red-950/60">
              <h4 className="text-zinc-400 font-semibold mb-2">Quick Demo Profiles (1-Click Login):</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const demoUser: CurrentUser = {
                      ...currentUser,
                      id: 'user-baraka',
                      nickname: 'Baraka',
                      age: 25,
                      gender: 'male',
                      country: 'Tanzania',
                      approxLocation: 'Dar es Salaam, Tanzania',
                      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      email: 'baraka@miziziconnect.io',
                      bio: 'Full-stack builder passionate about tech, music and startups.',
                      isSubscribed: false,
                    };
                    handleSelectExistingAccount(demoUser);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Baraka"
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold text-white text-[11px]">Baraka, 25</div>
                    <div className="text-[9px] text-zinc-400">Dar es Salaam</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const demoUser: CurrentUser = {
                      ...currentUser,
                      id: 'user-neema',
                      nickname: 'Neema',
                      age: 23,
                      gender: 'female',
                      country: 'Tanzania',
                      approxLocation: 'Arusha, Tanzania',
                      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      email: 'neema@miziziconnect.io',
                      bio: 'Fashion designer & coffee lover in Arusha.',
                      isSubscribed: false,
                    };
                    handleSelectExistingAccount(demoUser);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Neema"
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold text-white text-[11px]">Neema, 23</div>
                    <div className="text-[9px] text-zinc-400">Arusha</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveMode('create')}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-red-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-red-400" />
                <span>+ Register Another New Account</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-red-950/60 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Accounts saved securely in your browser · No external trackers</span>
        </div>
      </div>
    </div>
  );
};
