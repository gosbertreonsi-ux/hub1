import React, { useState } from 'react';
import { 
  Flame, 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  User, 
  Users,
  Bell, 
  Settings, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Video, 
  Menu, 
  X, 
  Crown, 
  UserPlus, 
  Building2, 
  Compass, 
  Zap,
  Globe
} from 'lucide-react';
import { CurrentUser, OnlineStatus } from '../types';

export type NavTab = 
  | 'feed' 
  | 'reels' 
  | 'discover' 
  | 'chat' 
  | 'communities' 
  | 'business' 
  | 'search' 
  | 'admin' 
  | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: CurrentUser;
  unreadMessagesCount: number;
  matchesCount: number;
  onOpenPrivacy: () => void;
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
  onUpdateStatus: (status: OnlineStatus) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  matchesCount,
  onOpenPrivacy,
  onOpenSubscription,
  onOpenAuth,
  onUpdateStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-red-950/60 text-white shadow-xl">
        {/* Top red glow accent line */}
        <div className="h-0.5 bg-gradient-to-r from-red-800 via-rose-500 to-red-900 w-full" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
          
          {/* LEFT SIDE: Beautiful Sans-Serif Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button 
              onClick={() => handleTabSelect('feed')} 
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
              title="Mizizi"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-rose-950 flex items-center justify-center shadow-md shadow-red-950/60 border border-red-500/40 group-hover:scale-105 transition-transform flex-shrink-0">
                <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white fill-white" />
              </div>
              <div className="leading-none">
                <span className="font-black tracking-tight text-base sm:text-lg text-white font-sans">
                  mizizi<span className="text-red-500 text-xs font-bold font-sans">·2.0</span>
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: Navigation Tabs (Desktop only, hidden on mobile so no squishing!) */}
          <nav className="hidden md:flex items-center bg-[#121218] p-1 rounded-xl border border-red-950/80">
            <button
              onClick={() => handleTabSelect('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'feed'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Feed</span>
            </button>

            <button
              onClick={() => handleTabSelect('reels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reels'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Reels</span>
            </button>

            <button
              onClick={() => handleTabSelect('discover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'discover'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => handleTabSelect('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabSelect('communities')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'communities'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Groups</span>
            </button>

            <button
              onClick={() => handleTabSelect('business')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'business'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pages</span>
            </button>

            <button
              onClick={() => handleTabSelect('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </button>

            <button
              onClick={() => handleTabSelect('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-red-900/70 text-red-200 border border-red-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
              title="Admin & Safety"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </button>
          </nav>

          {/* RIGHT SIDE: VIP Pass, Settings, and User Profile (Cleanly Placed & Intact!) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* VIP Pass Button */}
            <button
              onClick={onOpenSubscription}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 border ${
                currentUser.isSubscribed
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-md shadow-amber-950'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-400/50 shadow-md shadow-red-950'
              }`}
              title="MIZIZI VIP & Pass"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">
                {currentUser.isSubscribed ? 'VIP Active' : 'Subscribe VIP'}
              </span>
            </button>

            {/* User Profile Avatar on Right */}
            <button
              onClick={() => handleTabSelect('profile')}
              className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-red-950/80 cursor-pointer transition-colors"
              title="My Profile"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.nickname}
                  className="w-8 h-8 rounded-lg object-cover border border-red-500/50"
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

              {/* Nickname visible on desktop */}
              <div className="text-left hidden lg:block">
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

      {/* MOBILE LEFT-SIDE SLIDE-OUT DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in">
          <div 
            className="w-72 max-w-[80vw] h-full bg-[#0c0c12] border-r border-red-950/90 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-red-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-900 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-white font-sans tracking-tight">mizizi<span className="text-red-500 font-bold text-xs">·2.0</span></span>
                    <span className="text-[10px] text-zinc-400 block -mt-0.5">Social · Discovery · Messaging</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Card in Drawer */}
              <div className="p-4 border-b border-red-950/60 bg-[#12121a]">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.nickname}
                    className="w-12 h-12 rounded-xl object-cover border border-red-500/50"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-white">{currentUser.nickname}</h4>
                    <p className="text-[11px] text-red-400">{currentUser.approxLocation}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                        {currentUser.isSubscribed ? 'VIP Pass Active' : 'Free Preview'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links in Drawer */}
              <div className="p-3 space-y-1 text-left text-xs">
                <button
                  onClick={() => handleTabSelect('feed')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'feed' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>Home Feed & Stories</span>
                </button>

                <button
                  onClick={() => handleTabSelect('reels')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'reels' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Video className="w-4 h-4 text-red-400" />
                  <span>Short Video Reels</span>
                </button>

                <button
                  onClick={() => handleTabSelect('discover')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'discover' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>People Discovery & Matching</span>
                </button>

                <button
                  onClick={() => handleTabSelect('chat')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'chat' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-red-400" />
                    <span>Chat & Calls</span>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabSelect('communities')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'communities' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-red-400" />
                  <span>Communities & Events</span>
                </button>

                <button
                  onClick={() => handleTabSelect('business')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'business' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-red-400" />
                  <span>Business Pages & Shops</span>
                </button>

                <button
                  onClick={() => handleTabSelect('search')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'search' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <Search className="w-4 h-4 text-red-400" />
                  <span>Global Search</span>
                </button>

                <button
                  onClick={() => handleTabSelect('admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold cursor-pointer ${
                    activeTab === 'admin' ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Trust, Safety & Admin</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPrivacy();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-zinc-300 hover:bg-zinc-900 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-red-400" />
                  <span>Privacy & Safety Settings</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions: Subscription & Account Creation */}
            <div className="p-4 border-t border-red-950/80 space-y-2 bg-[#09090d]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubscription();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>{currentUser.isSubscribed ? 'Manage VIP Pass' : 'Subscribe to VIP Pass'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-red-400" />
                <span>Create / Switch Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb navigation with left menu access) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#09090e]/95 backdrop-blur-md border-t border-red-950/80 px-2 py-1.5 flex items-center justify-around text-[10px]">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 cursor-pointer py-1 text-zinc-400 hover:text-red-400 active:scale-95"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-zinc-300">Menu</span>
        </button>

        <button
          onClick={() => handleTabSelect('feed')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 ${
            activeTab === 'feed' ? 'text-red-500 font-bold' : 'text-zinc-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => handleTabSelect('discover')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 ${
            activeTab === 'discover' ? 'text-red-500 font-bold' : 'text-zinc-400'
          }`}
        >
          <Flame className="w-5 h-5 text-red-500 fill-red-500" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => handleTabSelect('chat')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 relative ${
            activeTab === 'chat' ? 'text-red-500 font-bold' : 'text-zinc-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => handleTabSelect('profile')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 ${
            activeTab === 'profile' ? 'text-red-500 font-bold' : 'text-zinc-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};
