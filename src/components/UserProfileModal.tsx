import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  MessageSquare, 
  Phone, 
  Video, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  Target,
  Languages,
  UserCheck
} from 'lucide-react';
import { UserProfile, CurrentUser } from '../types';
import { playPopSound, playVoiceNoteBeep } from '../utils/audio';

interface UserProfileModalProps {
  profile: UserProfile | null;
  compatibilityScore: number;
  currentUser: CurrentUser;
  onClose: () => void;
  onLike: (profile: UserProfile, score: number) => void;
  onOpenChat: (userId: string) => void;
  onStartVoiceCall: (profile: UserProfile) => void;
  onStartVideoCall: (profile: UserProfile) => void;
  onReportUser: (profile: UserProfile) => void;
  onBlockUser: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  compatibilityScore,
  currentUser,
  onClose,
  onLike,
  onOpenChat,
  onStartVoiceCall,
  onStartVideoCall,
  onReportUser,
  onBlockUser,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  if (!profile) return null;

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.avatarUrl];
  const isLiked = currentUser.likedUserIds.includes(profile.id);

  const handleVoicePreview = () => {
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      playVoiceNoteBeep();
      setTimeout(() => setIsPlayingVoice(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[92vh] bg-[#0c0c11] border border-red-950/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Photo Gallery */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black">
            <img
              src={photos[selectedPhotoIndex] || profile.avatarUrl}
              alt={profile.nickname}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-transparent to-black/30 pointer-events-none" />

            {/* Compatibility Tag & Online Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-red-500/80 text-xs font-black text-white shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>{compatibilityScore}% Compatibility</span>
              </div>
            </div>

            {/* Thumbnail dots if multiple photos */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === selectedPhotoIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Profile Identity Details */}
          <div className="p-5 sm:p-6 space-y-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {profile.nickname}, {profile.age}
                  </h2>
                  {profile.verified && (
                    <CheckCircle2 className="w-5 h-5 text-red-500 fill-red-950 inline" />
                  )}
                  <span
                    className={`w-3 h-3 rounded-full border border-black ${
                      profile.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-red-300/90 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{profile.approxLocation || profile.country}</span>
                  {profile.occupation && (
                    <>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-300">{profile.occupation}</span>
                    </>
                  )}
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 font-medium">{profile.personality}</span>
                </div>
              </div>

              {/* Voice Intro button */}
              {profile.voiceIntroSeconds && (
                <button
                  onClick={handleVoicePreview}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isPlayingVoice
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-red-950'
                  }`}
                >
                  <Radio className="w-4 h-4 text-red-400" />
                  <span>{isPlayingVoice ? 'Listening...' : 'Voice Intro'}</span>
                </button>
              )}
            </div>

            {/* Bio */}
            <div className="bg-[#121218] p-4 rounded-2xl border border-red-950/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Personal Bio
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                "{profile.bio}"
              </p>
            </div>

            {/* Interests (Zero-pill discipline) */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2">
                Shared & Core Interests
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {profile.interests.map((interest) => {
                  const isShared = currentUser.interests.includes(interest);
                  return (
                    <span
                      key={interest}
                      className={`px-3 py-1.5 rounded-xl border text-xs ${
                        isShared
                          ? 'bg-red-950/80 text-red-200 border-red-700/60 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {interest} {isShared && '✓ Shared'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Goals & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#121218] border border-red-950/60 space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Relationship Goals:</span>
                </span>
                <p className="text-zinc-300">
                  {profile.goals && profile.goals.length > 0
                    ? profile.goals.join(', ')
                    : 'Meaningful connection'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121218] border border-red-950/60 space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Languages Spoken:</span>
                </span>
                <p className="text-zinc-300">{profile.languages.join(', ')}</p>
              </div>
            </div>

            {/* Moderation & Safety reporting */}
            <div className="pt-3 border-t border-red-950 flex items-center justify-between text-xs text-zinc-400">
              <button
                onClick={() => {
                  onReportUser(profile);
                  onClose();
                }}
                className="hover:text-amber-400 flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Inappropriate Profile</span>
              </button>
              <button
                onClick={() => {
                  onBlockUser(profile);
                  onClose();
                }}
                className="hover:text-red-400 cursor-pointer"
              >
                Block User
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="p-4 bg-[#0a0a0f] border-t border-red-950 flex items-center justify-between gap-3">
          {isLiked ? (
            <button
              onClick={() => {
                onOpenChat(profile.id);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with {profile.nickname}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onLike(profile, compatibilityScore);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Like & Connect</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onStartVoiceCall(profile);
                onClose();
              }}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-red-950 cursor-pointer"
              title="Voice Call"
            >
              <Phone className="w-4 h-4 text-red-400" />
            </button>
            <button
              onClick={() => {
                onStartVideoCall(profile);
                onClose();
              }}
              className="p-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 cursor-pointer"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
