import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Disc, 
  Send, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { Reel, UserProfile, CurrentUser } from '../types';
import { playPopSound } from '../utils/audio';

interface ReelsViewProps {
  reels: Reel[];
  currentUser: CurrentUser;
  onOpenChat: (userId: string) => void;
  onLikeReel: (reelId: string) => void;
  onViewProfile: (profile: UserProfile) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onOpenChat,
  onLikeReel,
  onViewProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'reel-1': [
      { author: 'Baraka', text: 'Stonetown aesthetics are unmatched! Love this workspace.', time: '1h ago' },
      { author: 'Chidi', text: 'Need those chill drums in my studio.', time: '45m ago' },
    ],
    'reel-2': [
      { author: 'Elena', text: 'The rhythmic timing is incredible!', time: '2h ago' },
    ],
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentReel) return;
    playPopSound();
    setCommentsMap((prev) => ({
      ...prev,
      [currentReel.id]: [
        ...(prev[currentReel.id] || []),
        { author: currentUser.nickname, text: commentInput.trim(), time: 'Just now' },
      ],
    }));
    setCommentInput('');
  };

  const handleShare = () => {
    playPopSound();
    if (navigator.share) {
      navigator.share({
        title: currentReel.caption,
        text: `Watch ${currentReel.creator.nickname}'s Reel on MIZIZI!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Reel link copied to clipboard!');
    }
  };

  if (!currentReel) return null;

  const currentComments = commentsMap[currentReel.id] || [];

  return (
    <div className="max-w-md mx-auto px-2 py-4 h-[calc(100vh-5rem)] flex items-center justify-center select-none">
      {/* Reel Card Container */}
      <div className="w-full h-full max-h-[820px] bg-black border border-red-950/80 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between group">
        
        {/* Video Element */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            poster={currentReel.thumbnailUrl}
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center shadow-xl">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          )}
        </div>

        {/* Top Controls: Mute & Up/Down navigation */}
        <div className="relative z-20 p-4 flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-red-950 text-xs font-bold text-red-400">
            <span>MIZIZI REELS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 cursor-pointer border border-zinc-800"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 disabled:opacity-30 cursor-pointer"
              title="Previous Reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === reels.length - 1}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 disabled:opacity-30 cursor-pointer"
              title="Next Reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons Rail on Right (Like, Comment, Share, Message) */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
          {/* Creator Avatar with follow badge */}
          <div 
            onClick={() => onViewProfile(currentReel.creator)}
            className="relative cursor-pointer group"
          >
            <img
              src={currentReel.creator.avatarUrl}
              alt={currentReel.creator.nickname}
              className="w-11 h-11 rounded-full object-cover border-2 border-red-500 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5 border border-black shadow">
              <UserPlus className="w-3 h-3" />
            </div>
          </div>

          {/* Like Reel */}
          <button
            onClick={() => {
              playPopSound();
              onLikeReel(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              currentReel.isLiked ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' : 'bg-black/60 text-white hover:bg-red-950'
            }`}>
              <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white shadow-black drop-shadow">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-zinc-800">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white shadow-black drop-shadow">
              {(currentReel.commentsCount + currentComments.length).toLocaleString()}
            </span>
          </button>

          {/* Share Reel */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-zinc-800">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white shadow-black drop-shadow">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Message Creator directly */}
          <button
            onClick={() => onOpenChat(currentReel.creator.id)}
            className="p-2.5 rounded-full bg-red-950/80 border border-red-700 text-red-300 hover:bg-red-600 hover:text-white transition-colors cursor-pointer shadow-lg"
            title="Message Creator"
          >
            <Send className="w-5 h-5" />
          </button>

          {/* Rotating Audio Disc */}
          <div className="w-9 h-9 rounded-full bg-black/80 border border-red-500/60 p-1 flex items-center justify-center animate-spin [animation-duration:6s]">
            <Disc className="w-5 h-5 text-red-400" />
          </div>
        </div>

        {/* Bottom Metadata & Caption Area */}
        <div className="relative z-20 p-4 text-left space-y-2 pointer-events-auto max-w-[85%]">
          {/* Creator Tag */}
          <div 
            onClick={() => onViewProfile(currentReel.creator)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="font-extrabold text-sm text-white drop-shadow flex items-center gap-1">
              @{currentReel.creator.nickname}
              {currentReel.creator.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-950 inline" />
              )}
            </span>
            <span className="text-[11px] text-zinc-300">· {currentReel.creator.approxLocation}</span>
          </div>

          {/* Caption */}
          <p className="text-xs text-zinc-100 leading-snug drop-shadow line-clamp-2">
            {currentReel.caption}
          </p>

          {/* Audio Title Track */}
          <div className="flex items-center gap-1.5 text-[11px] text-red-300 font-mono">
            <Disc className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">{currentReel.musicTitle}</span>
          </div>
        </div>

        {/* COMMENTS BOTTOM SHEET DRAWER */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-[#0e0e14]/95 backdrop-blur-md border-t border-red-950 p-4 z-30 flex flex-col rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-red-950 pb-2 mb-2">
              <span className="text-xs font-bold text-white">Comments ({currentComments.length})</span>
              <button
                onClick={() => setShowComments(false)}
                className="text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 text-xs text-left py-1">
              {currentComments.map((c, idx) => (
                <div key={idx} className="bg-black/40 p-2.5 rounded-xl border border-red-950/40">
                  <span className="font-bold text-red-400">{c.author}: </span>
                  <span className="text-zinc-200">{c.text}</span>
                  <span className="block text-[10px] text-zinc-500 mt-0.5">{c.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-black/60 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
