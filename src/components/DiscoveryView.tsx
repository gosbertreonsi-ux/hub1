import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Zap, 
  Info, 
  MapPin, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  Globe,
  Radio,
  Target
} from 'lucide-react';
import { UserProfile, CurrentUser } from '../types';
import { calculateCompatibilityScore, ALL_INTERESTS } from '../data/mockData';
import { playPopSound, playVoiceNoteBeep } from '../utils/audio';

interface DiscoveryViewProps {
  currentUser: CurrentUser;
  profiles: UserProfile[];
  onLike: (profile: UserProfile, score: number) => void;
  onSkip: (profile: UserProfile) => void;
  onSuperConnect: (profile: UserProfile, score: number) => void;
  onViewProfile: (profile: UserProfile, score: number) => void;
  onResetDeck: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  currentUser,
  profiles,
  onLike,
  onSkip,
  onSuperConnect,
  onViewProfile,
  onResetDeck,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter criteria states
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    if (selectedGender !== 'all' && p.gender !== selectedGender) return false;
    if (selectedInterest !== 'all' && !p.interests.includes(selectedInterest)) return false;
    return true;
  });

  const currentProfile = filteredProfiles[currentIndex];
  const compatibilityScore = currentProfile
    ? calculateCompatibilityScore(currentUser, currentProfile)
    : 85;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    const totalPhotos = (currentProfile.photos || [currentProfile.avatarUrl]).length;
    setCurrentPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    const totalPhotos = (currentProfile.photos || [currentProfile.avatarUrl]).length;
    setCurrentPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  const handleVoicePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      playVoiceNoteBeep();
      setTimeout(() => setIsPlayingVoice(false), 4000);
    }
  };

  const handleLikeClick = () => {
    if (!currentProfile) return;
    playPopSound();
    onLike(currentProfile, compatibilityScore);
    advanceCard();
  };

  const handleSkipClick = () => {
    if (!currentProfile) return;
    playPopSound();
    onSkip(currentProfile);
    advanceCard();
  };

  const handleSuperConnectClick = () => {
    if (!currentProfile) return;
    playPopSound();
    onSuperConnect(currentProfile, compatibilityScore);
    advanceCard();
  };

  const advanceCard = () => {
    setCurrentPhotoIndex(0);
    setIsPlayingVoice(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Top Filter and Deck Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Discover Compatible Souls</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-400">
            Rule-based matching on interests, values & communication
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
            showFilters
              ? 'bg-red-950 text-red-200 border-red-600'
              : 'bg-zinc-900 text-zinc-300 border-red-950 hover:border-red-800'
          }`}
          title="Filter Preferences"
        >
          <SlidersHorizontal className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="w-full max-w-md bg-[#111116] border border-red-900/40 rounded-2xl p-4 mb-5 shadow-2xl text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-red-950 pb-2">
            <span className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
              Discovery Preferences
            </span>
            <button
              onClick={() => {
                setSelectedGender('all');
                setSelectedInterest('all');
              }}
              className="text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Interested In:</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">Everyone</option>
                <option value="female">Women</option>
                <option value="male">Men</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Core Interest:</label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Interests</option>
                {ALL_INTERESTS.map((int) => (
                  <option key={int.name} value={int.name}>
                    {int.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Card Stack */}
      {currentProfile && currentIndex < filteredProfiles.length ? (
        <div className="w-full max-w-md bg-[#101015] border border-red-950/80 rounded-3xl overflow-hidden shadow-2xl shadow-red-950/40 relative flex flex-col group">
          {/* Main Photo Container */}
          <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-black overflow-hidden select-none">
            {/* Display Current Photo */}
            <img
              src={
                currentProfile.photos && currentProfile.photos[currentPhotoIndex]
                  ? currentProfile.photos[currentPhotoIndex]
                  : currentProfile.avatarUrl
              }
              alt={currentProfile.nickname}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Red & Black Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-[#0e0e13]/30 to-black/30 pointer-events-none" />

            {/* Top Info Bar inside Photo */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
              {/* Compatibility Badge with Red Glow */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-red-500/60 shadow-lg shadow-red-950/60">
                <Sparkles className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span className="text-xs font-black text-white tracking-wide">
                  {compatibilityScore}% Compatible
                </span>
              </div>

              {/* Voice Intro preview button */}
              {currentProfile.voiceIntroSeconds && (
                <button
                  type="button"
                  onClick={handleVoicePreview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold cursor-pointer transition-all ${
                    isPlayingVoice
                      ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/50'
                      : 'bg-black/75 border border-zinc-700 text-zinc-200 hover:border-red-500'
                  }`}
                  title="Listen to voice introduction"
                >
                  {isPlayingVoice ? (
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Radio className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span>
                    {isPlayingVoice
                      ? 'Playing voice...'
                      : `Voice Intro (${currentProfile.voiceIntroSeconds}s)`}
                  </span>
                </button>
              )}
            </div>

            {/* Left & Right Photo Click Navigation Areas */}
            <div className="absolute inset-0 flex z-0">
              <div 
                onClick={handlePrevPhoto} 
                className="w-1/2 h-full cursor-w-resize" 
                title="Previous photo"
              />
              <div 
                onClick={handleNextPhoto} 
                className="w-1/2 h-full cursor-e-resize" 
                title="Next photo"
              />
            </div>

            {/* Photo Dots indicator */}
            {currentProfile.photos && currentProfile.photos.length > 1 && (
              <div className="absolute top-12 inset-x-4 flex items-center justify-center gap-1 z-10 pointer-events-none">
                {currentProfile.photos.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      idx === currentPhotoIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* User Bio & Identity details pinned over lower gradient */}
            <div className="absolute bottom-3 inset-x-4 z-10 text-left pointer-events-none">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {currentProfile.nickname}, {currentProfile.age}
                </h3>
                {currentProfile.verified && (
                  <CheckCircle2 className="w-5 h-5 text-red-500 fill-red-950" />
                )}
                <span
                  className={`w-2.5 h-2.5 rounded-full border border-black ${
                    currentProfile.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`}
                  title={`Status: ${currentProfile.onlineStatus}`}
                />
              </div>

              {/* Approximate Location without exposing precise street */}
              <div className="flex items-center gap-1 text-xs text-red-300/90 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{currentProfile.approxLocation || currentProfile.country}</span>
                {currentProfile.occupation && (
                  <>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-300">{currentProfile.occupation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card Meta Content & Interests */}
          <div className="p-4 sm:p-5 bg-[#0e0e13] border-t border-red-950/80 space-y-3.5 text-left">
            {/* Bio */}
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
              "{currentProfile.bio}"
            </p>

            {/* Shared Interests as clean typographic tags (Zero-pill discipline) */}
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider block mb-1.5">
                Top Interests & Hobbies
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {currentProfile.interests.map((interest) => {
                  const isShared = currentUser.interests.includes(interest);
                  return (
                    <span
                      key={interest}
                      className={`px-2.5 py-1 rounded-lg font-medium text-xs border ${
                        isShared
                          ? 'bg-red-950/80 text-red-200 border-red-700/60 font-semibold'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {interest} {isShared && '✓'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Goals & Languages Line */}
            <div className="pt-2 border-t border-red-950/60 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1 text-[11px] truncate max-w-[240px]">
                <Target className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate">
                  {currentProfile.goals ? currentProfile.goals.slice(0, 2).join(' · ') : 'Meaningful Chats'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewProfile(currentProfile, compatibilityScore)}
                className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>View Full Profile</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons Bar: Skip (✕), Super Connect (⚡), Like (♥) */}
          <div className="p-4 bg-[#09090c] border-t border-red-950 flex items-center justify-around">
            {/* SKIP BUTTON */}
            <button
              onClick={handleSkipClick}
              className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg transition-all active:scale-90"
              title="Skip"
            >
              <X className="w-6 h-6" />
            </button>

            {/* SUPER CONNECT BUTTON */}
            <button
              onClick={handleSuperConnectClick}
              className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white flex items-center justify-center cursor-pointer shadow-lg transition-all active:scale-90"
              title="Super Connect (Boost match)"
            >
              <Zap className="w-5 h-5 fill-red-400" />
            </button>

            {/* LIKE BUTTON */}
            <button
              onClick={handleLikeClick}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white flex items-center justify-center cursor-pointer shadow-xl shadow-red-950/80 transition-all active:scale-90 border border-red-400/40"
              title="Like & Match"
            >
              <Heart className="w-6 h-6 fill-white" />
            </button>
          </div>
        </div>
      ) : (
        /* End of Deck state */
        <div className="w-full max-w-md bg-[#101015] border border-red-950 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center mx-auto text-red-400">
            <Globe className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white">
            You've explored all current recommendations!
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Expand your age or location filters to discover more compatible people, or re-shuffle the deck.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              onResetDeck();
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-lg shadow-red-950/60 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shuffle Profiles Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
