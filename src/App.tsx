import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WhatsAppFeed } from './components/WhatsAppFeed';
import { MovieCinema } from './components/MovieCinema';
import { PaymentModal } from './components/PaymentModal';
import { VideoPlayer } from './components/VideoPlayer';
import { MovieRequestModal } from './components/MovieRequestModal';
import { VIPAccess, Movie, Language, PaymentCarrier } from './types';
import { MOVIES_DATABASE } from './data/mockData';
import { MessageCircle, Film, Crown, Send, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'movies_tz_vip_session_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'cinema'>('chat');
  const [lang, setLang] = useState<Language>('sw');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // VIP Access State (persisted in localStorage with 24 hour timer)
  const [vipAccess, setVipAccess] = useState<VIPAccess>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {
      isActive: false,
      expiresAt: null,
    };
  });

  // Check VIP expiration
  useEffect(() => {
    if (vipAccess.isActive && vipAccess.expiresAt) {
      if (Date.now() >= vipAccess.expiresAt) {
        setVipAccess({ isActive: false, expiresAt: null });
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [vipAccess]);

  // Handle successful payment or VIP granting
  const handlePaymentSuccess = (carrier: PaymentCarrier, phone: string) => {
    // 24 hours from now
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const newAccess: VIPAccess = {
      isActive: true,
      expiresAt,
      carrier,
      phone,
      token: `VIP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
    setVipAccess(newAccess);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccess));
    } catch {
      // ignore
    }

    // Switch to Cinema view so user can enjoy their unlocked content immediately!
    setActiveTab('cinema');
  };

  const handleWatchMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-[#00a884] selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vipAccess={vipAccess}
        onOpenPayment={() => setIsPaymentOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
        lang={lang}
        setLang={setLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content View Switcher */}
      <div className="flex-1">
        {activeTab === 'chat' ? (
          <WhatsAppFeed
            vipAccess={vipAccess}
            onOpenPayment={() => setIsPaymentOpen(true)}
            onWatchMovie={handleWatchMovie}
            lang={lang}
            onSwitchToCinema={() => setActiveTab('cinema')}
          />
        ) : (
          <MovieCinema
            vipAccess={vipAccess}
            onOpenPayment={() => setIsPaymentOpen(true)}
            onSelectMovie={handleWatchMovie}
            onOpenRequest={() => setIsRequestOpen(true)}
            onOpenWhatsAppFeed={() => setActiveTab('chat')}
            lang={lang}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </div>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111b21] border-t border-slate-800 px-3 py-2 flex items-center justify-around text-xs shadow-lg">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'chat' ? 'text-[#25D366] font-bold' : 'text-slate-400'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('cinema')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'cinema' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Film className="w-5 h-5" />
          <span>Cinema</span>
        </button>

        {!vipAccess.isActive ? (
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="flex flex-col items-center gap-1 text-amber-400 font-bold cursor-pointer"
          >
            <Crown className="w-5 h-5" />
            <span>VIP (2,000/=)</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
            <span>VIP Aktif</span>
          </div>
        )}

        <button
          onClick={() => setIsRequestOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer"
        >
          <Send className="w-5 h-5" />
          <span>{lang === 'sw' ? 'Omba' : 'Request'}</span>
        </button>
      </div>

      {/* Payment Gateway Modal (M-Pesa, Tigo Pesa, Airtel Money, Halopesa) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        lang={lang}
      />

      {/* Video Streaming Player Modal */}
      {selectedMovie && (
        <VideoPlayer
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          lang={lang}
          onOpenWhatsApp={() => {
            setSelectedMovie(null);
            setActiveTab('chat');
          }}
        />
      )}

      {/* WhatsApp Movie Request Modal */}
      <MovieRequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        lang={lang}
      />
    </div>
  );
}
