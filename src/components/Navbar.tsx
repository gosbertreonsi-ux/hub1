import React from 'react';
import { 
  Flame, 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  User, 
  Bell, 
  Settings, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Video
} from 'lucide-react';
import { CurrentUser, OnlineStatus } from '../types';

interface NavbarProps {
  activeTab: 'discover' | 'chat' | 'search' | 'admin' | 'profile';
  setActiveTab: (tab: 'discover' | 'chat' | 'search' | 'admin' | 'profile') => void;
  currentUser: CurrentUser;
  unreadMessagesCount: number;
  matchesCount: number;
  onOpenPrivacy: () => void;
  onUpdateStatus: (status: OnlineStatus) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  matchesCount,
  onOpenPrivacy,
  onUpdateStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-red-950/60 text-white shadow-xl">
      {/* Top red glow accent line */}
      <div className="h-0.5 bg-gradient-to-r from-red-800 via-rose-500 to-red-900 w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo with red flame / connection emblem */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('discover')} 
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center shadow-lg shadow-red-950/60 border border-red-500/40 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-wider text-lg text-white font-serif">
                  MIZIZI<span className="text-red-500">CONNECT</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
                  1-to-1
                </span>
              </div>
              <p className="text-[10px] text-red-300/70 font-medium tracking-wide">
                Meaningful Connections · Social Discovery
              </p>
            </div>
          </button>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center bg-[#121218] p-1 rounded-xl border border-red-950/80">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Discover</span>
            <span className="sm:hidden">Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
              activeTab === 'chat'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat & Calls</span>
            {unreadMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
            {matchesCount > 0 && unreadMessagesCount === 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-red-900/70 text-red-200 border border-red-700/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
            }`}
            title="Admin & Safety Moderation"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="hidden lg:inline">Safety & Admin</span>
          </button>
        </nav>

        {/* Right Controls: User Profile, Privacy & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy & Settings button */}
          <button
            onClick={onOpenPrivacy}
            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-red-950/60 cursor-pointer transition-colors"
            title="Privacy & Safety Settings"
          >
            <Settings className="w-4 h-4 text-red-400" />
          </button>

          {/* User Profile avatar & Online state */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-red-950/80 cursor-pointer transition-colors"
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.nickname}
                className="w-8 h-8 rounded-lg object-cover border border-red-500/40"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                  currentUser.onlineStatus === 'online'
                    ? 'bg-emerald-500'
                    : currentUser.onlineStatus === 'busy'
                    ? 'bg-red-500'
                    : currentUser.onlineStatus === 'away'
                    ? 'bg-amber-500'
                    : 'bg-zinc-500'
                }`}
                title={`Status: ${currentUser.onlineStatus}`}
              />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{currentUser.nickname}</span>
                {currentUser.verified && (
                  <CheckCircle2 className="w-3 h-3 text-red-400 fill-red-950" />
                )}
              </div>
              <div className="text-[10px] text-zinc-400 capitalize">
                {currentUser.onlineStatus}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
