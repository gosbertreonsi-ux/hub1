import React, { useState, useEffect } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Story } from '../types';
import { playPopSound } from '../utils/audio';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
  onReplyToStory: (authorId: string, replyText: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex = 0,
  onClose,
  onReplyToStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  const currentStory = stories[currentIndex];

  // Auto-advance timer (5 seconds per story)
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            clearInterval(interval);
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose, currentStory]);

  if (!currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    playPopSound();
    onReplyToStory(
      currentStory.author.id,
      `Replied to Story: "${replyInput.trim()}"`
    );
    setReplyInput('');
    onClose();
  };

  const handleQuickReaction = (emoji: string) => {
    playPopSound();
    onReplyToStory(currentStory.author.id, `Reacted ${emoji} to your story!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md h-full sm:h-[92vh] bg-black border border-red-950/80 rounded-none sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
        onClick={() => setIsPaused(!isPaused)}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5 pointer-events-none">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
                className="h-full bg-red-500 rounded-full transition-all duration-75"
              />
            </div>
          ))}
        </div>

        {/* Top Story Header */}
        <header className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.author.avatarUrl}
              alt={currentStory.author.nickname}
              className="w-9 h-9 rounded-full object-cover border-2 border-red-500 shadow-md"
            />
            <div className="text-left">
              <span className="font-bold text-xs text-white block leading-tight">
                {currentStory.author.nickname}
              </span>
              <span className="text-[10px] text-zinc-300 font-mono">
                {currentStory.createdAt} · 24h Story
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-1 text-white hover:text-red-400 cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 text-white hover:text-red-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Story Visual Screen */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt="Story Visual"
            className="w-full h-full object-cover filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

          {/* Navigation Click zones */}
          <div
            className="absolute left-0 inset-y-0 w-1/3 cursor-w-resize z-10"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div
            className="absolute right-0 inset-y-0 w-1/3 cursor-e-resize z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />

          {/* Story Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 inset-x-5 z-20 text-center pointer-events-none">
              <p className="text-sm font-semibold text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-red-950/60 inline-block max-w-xs leading-relaxed">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Story Quick Reactions & Reply Bar */}
        <footer 
          className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-30 space-y-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Emoji Reactions */}
          <div className="flex items-center justify-around py-1">
            {['🔥', '❤️', '👏', '😍', '🙌', '✨'].map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => handleQuickReaction(em)}
                className="text-xl hover:scale-125 transition-transform cursor-pointer"
              >
                {em}
              </button>
            ))}
          </div>

          {/* Direct Message Reply Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder={`Reply to ${currentStory.author.nickname}...`}
              className="flex-1 bg-zinc-900/90 text-white placeholder-zinc-500 rounded-full px-4 py-2 text-xs border border-zinc-700 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!replyInput.trim()}
              className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};
