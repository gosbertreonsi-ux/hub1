import React from 'react';
import { 
  Film, 
  MessageCircle, 
  Crown, 
  Search, 
  Send, 
  Sparkles, 
  Globe,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Language, VIPAccess } from '../types';

interface NavbarProps {
  activeTab: 'chat' | 'cinema';
  setActiveTab: (tab: 'chat' | 'cinema') => void;
  vipAccess: VIPAccess;
  onOpenPayment: () => void;
  onOpenRequest: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vipAccess,
  onOpenPayment,
  onOpenRequest,
  lang,
  setLang,
  searchQuery,
  setSearchQuery,
}) => {
  const isSw = lang === 'sw';

  // Format remaining time if VIP is active
  const getRemainingTimeText = () => {
    if (!vipAccess.isActive || !vipAccess.expiresAt) return null;
    const diff = vipAccess.expiresAt - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const remainingText = getRemainingTimeText();

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top micro ticker */}
      <div className="bg-[#00a884] text-white text-[11px] font-medium py-1 px-3 text-center flex items-center justify-center gap-2">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          {isSw ? 'Movies-TZ Rasmi:' : 'Movies-TZ Official:'}
        </span>
        <span className="truncate">
          {isSw 
            ? 'Pata Bongo Movies, DJ Afro Tafsiri ya Kiswahili & Jiunge na VIP WhatsApp Group!'
            : 'Stream Swahili Dubbed Movies, Bongo Films & Join Official VIP WhatsApp Group!'}
        </span>
        <button 
          onClick={onOpenRequest}
          className="ml-2 underline font-semibold hover:text-emerald-100 cursor-pointer text-[11px] hidden sm:inline"
        >
          {isSw ? 'Omba Movie' : 'Request Movie'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('cinema')} 
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#008069] to-[#25D366] flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-extrabold text-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  MOVIES<span className="text-[#25D366]">-TZ</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#25D366] border border-emerald-500/30">
                  VIP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {isSw ? 'Cinema & WhatsApp Hub' : 'Cinema & WhatsApp Hub'}
              </p>
            </div>
          </button>
        </div>

        {/* View Switcher Tabs (WhatsApp Feed vs Cinema Vault) */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#00a884] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp Group</span>
            <span className="sm:hidden">Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5 hidden sm:inline-block" />
          </button>

          <button
            onClick={() => setActiveTab('cinema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cinema'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span className="hidden sm:inline">Cinema & Videos</span>
            <span className="sm:hidden">Cinema</span>
            <span className="text-[9px] bg-rose-500/30 px-1 rounded text-rose-200 font-bold ml-0.5">
              HD
            </span>
          </button>
        </nav>

        {/* Action Controls: VIP Status, Request, Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search bar on Cinema tab */}
          {activeTab === 'cinema' && (
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isSw ? 'Tafuta movie, DJ Afro...' : 'Search movies, DJ Afro...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#25D366]"
              />
            </div>
          )}

          {/* VIP Pass Trigger */}
          {vipAccess.isActive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">VIP Aktif</span>
              {remainingText && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-mono">
                  <Clock className="w-3 h-3 inline" />
                  {remainingText}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isSw ? 'Jiunge VIP (2,000/=)' : 'VIP Pass (TZS 2,000)'}</span>
            </button>
          )}

          {/* Request Movie button */}
          <button
            onClick={onOpenRequest}
            title={isSw ? 'Omba Movie Kupitia WhatsApp' : 'Request Movie via WhatsApp'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#25D366]" />
            <span>{isSw ? 'Omba Movie' : 'Request'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(isSw ? 'en' : 'sw')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
            title="Badili Lugha / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase font-mono font-bold text-[11px]">{lang}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
