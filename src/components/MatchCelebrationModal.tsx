import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  MessageSquare, 
  Phone, 
  Video, 
  Sparkles, 
  Heart, 
  X,
  Target
} from 'lucide-react';
import { UserProfile, CurrentUser } from '../types';
import { playMatchFanfare } from '../utils/audio';

interface MatchCelebrationModalProps {
  currentUser: CurrentUser;
  matchedProfile: UserProfile;
  compatibilityScore: number;
  onOpenChat: (userId: string) => void;
  onStartVideoCall: (participant: UserProfile) => void;
  onClose: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  currentUser,
  matchedProfile,
  compatibilityScore,
  onOpenChat,
  onStartVideoCall,
  onClose,
}) => {
  useEffect(() => {
    playMatchFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#ef4444', '#b91c1c', '#ffffff'],
      });
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#0e0e13] border-2 border-red-600/80 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-red-950/80 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Flame Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-xs font-black uppercase tracking-wider mb-4 animate-bounce">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          <span>MUTUAL CONNECTION!</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
          IT'S A <span className="text-red-500">MATCH!</span>
        </h2>
        <p className="text-xs text-zinc-300 mt-1">
          You and <b className="text-white">{matchedProfile.nickname}</b> both liked each other.
        </p>

        {/* Dual Avatars Meeting */}
        <div className="flex items-center justify-center -space-x-4 my-6">
          <div className="w-24 h-24 rounded-full border-4 border-black p-0.5 bg-gradient-to-tr from-red-600 to-rose-700 shadow-2xl z-10">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.nickname}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center z-20 shadow-lg animate-pulse">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>

          <div className="w-24 h-24 rounded-full border-4 border-black p-0.5 bg-gradient-to-tr from-red-600 to-rose-700 shadow-2xl z-10">
            <img
              src={matchedProfile.avatarUrl}
              alt={matchedProfile.nickname}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Compatibility Breakdown Card */}
        <div className="bg-[#14141b] rounded-2xl p-3.5 border border-red-950 mb-6 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="text-red-400">Compatibility Index</span>
            <span className="text-white text-sm font-extrabold">{compatibilityScore}% Match</span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${compatibilityScore}%` }}
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
            />
          </div>

          <p className="text-[11px] text-zinc-400">
            Shared interests: {matchedProfile.interests.slice(0, 3).join(', ')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onOpenChat(matchedProfile.id);
              onClose();
            }}
            className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black py-3 rounded-xl shadow-lg shadow-red-950/80 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Say Hello to {matchedProfile.nickname}</span>
          </button>

          <button
            onClick={() => {
              onStartVideoCall(matchedProfile);
              onClose();
            }}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold py-2.5 rounded-xl border border-red-950/80 cursor-pointer flex items-center justify-center gap-2 transition-colors text-xs"
          >
            <Video className="w-4 h-4 text-red-400" />
            <span>Start Quick Video Call</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-medium py-1 cursor-pointer block mx-auto underline"
          >
            Keep Swiping & Discovering
          </button>
        </div>
      </div>
    </div>
  );
};
