import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Crown, 
  Lock, 
  Sparkles, 
  Star, 
  Clock, 
  Download, 
  Share2, 
  Search, 
  Filter, 
  Tv, 
  Film, 
  Flame, 
  Heart,
  MessageCircle,
  Radio,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { Movie, VIPAccess, Language } from '../types';
import { MOVIES_DATABASE } from '../data/mockData';
import { playPopSound } from '../utils/audio';

interface MovieCinemaProps {
  vipAccess: VIPAccess;
  onOpenPayment: () => void;
  onSelectMovie: (movie: Movie) => void;
  onOpenRequest: () => void;
  onOpenWhatsAppFeed: () => void;
  lang: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const MovieCinema: React.FC<MovieCinemaProps> = ({
  vipAccess,
  onOpenPayment,
  onSelectMovie,
  onOpenRequest,
  onOpenWhatsAppFeed,
  lang,
  searchQuery,
  setSearchQuery,
}) => {
  const isSw = lang === 'sw';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDj, setSelectedDj] = useState<string>('all');

  // Featured Premiere
  const heroMovie = MOVIES_DATABASE[0];

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return MOVIES_DATABASE.filter((movie) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'bongo' && movie.category !== 'bongo') return false;
        if (selectedCategory === 'dj-afro' && movie.category !== 'dj-afro') return false;
        if (selectedCategory === 'series' && movie.category !== 'series') return false;
        if (selectedCategory === 'vip-connection' && movie.category !== 'vip-connection') return false;
      }

      // DJ Filter
      if (selectedDj !== 'all') {
        if (movie.dj !== selectedDj) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesDj = movie.dj ? movie.dj.toLowerCase().includes(q) : false;
        const matchesCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDj && !matchesCast) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedDj, searchQuery]);

  const handleMovieCardClick = (movie: Movie) => {
    playPopSound();
    if (movie.isVipOnly && !vipAccess.isActive) {
      onOpenPayment();
    } else {
      onSelectMovie(movie);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 pb-20">
      {/* HERO SPOTLIGHT PREMIERE */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={heroMovie.banner}
            alt={heroMovie.title}
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-left">
            {/* Badges line */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#00a884] text-white flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-white" />
                {isSw ? 'INAYOTREND ZAIDI #1' : 'TRENDING #1'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                🎙️ {heroMovie.dj} · Swahili Dub
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800/90 text-emerald-400 border border-slate-700">
                {heroMovie.quality}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {heroMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {isSw ? heroMovie.descriptionSw : heroMovie.descriptionEn}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                {heroMovie.rating} / 5.0
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {heroMovie.duration}
              </span>
              <span>·</span>
              <span>{heroMovie.year}</span>
              <span>·</span>
              <span className="text-slate-300">
                {heroMovie.cast.slice(0, 2).join(', ')}
              </span>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => handleMovieCardClick(heroMovie)}
                className="flex items-center gap-2 bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{isSw ? 'Tazama Sasa (Full HD)' : 'Watch Now (Full HD)'}</span>
              </button>

              <button
                onClick={onOpenWhatsAppFeed}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{isSw ? 'VIP WhatsApp Group' : 'VIP WhatsApp Group'}</span>
              </button>

              <button
                onClick={onOpenRequest}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSw ? 'Omba Movie Nyingine' : 'Request Movie'}</span>
              </button>
            </div>
          </div>

          {/* Hero Poster Card */}
          <div 
            onClick={() => handleMovieCardClick(heroMovie)}
            className="w-56 sm:w-64 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl relative group cursor-pointer transform hover:-translate-y-1 transition-all"
          >
            <img
              src={heroMovie.poster}
              alt={heroMovie.title}
              className="w-full h-80 sm:h-92 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
              <span className="text-[11px] font-bold text-emerald-300">
                {isSw ? 'GUSA KUTAZAMA BURE' : 'TAP TO STREAM'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VIP PASS UPGRADE BANNER (If not yet active) */}
      {!vipAccess.isActive && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Crown className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {isSw ? 'Fungua Movies-TZ VIP Pass (TZS 2,000 Tu)' : 'Unlock Movies-TZ VIP Pass (TZS 2,000)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isSw 
                    ? 'Pata movie zote mpya za Bongo, DJ Afro bila matangazo, na ufikiaji wa WhatsApp Group la Connection 🔞!'
                    : 'Unlimited HD access to all Bongo movies, DJ Afro translations and VIP WhatsApp group!'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPayment}
              className="w-full sm:w-auto bg-gradient-to-r from-[#00a884] to-[#25D366] hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>{isSw ? 'Lipia 2,000/= Sasa' : 'Get VIP Pass (TZS 2,000)'}</span>
            </button>
          </div>
        </section>
      )}

      {/* FILTER & DISCOVERY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', labelSw: 'Zote (All Movies)', labelEn: 'All Movies' },
              { id: 'dj-afro', labelSw: 'DJ Afro & Mack 🔥', labelEn: 'DJ Afro & Mack 🔥' },
              { id: 'bongo', labelSw: 'Bongo Movies 🎬', labelEn: 'Bongo Movies 🎬' },
              { id: 'series', labelSw: 'Swahili Series 📺', labelEn: 'Swahili Series 📺' },
              { id: 'vip-connection', labelSw: 'VIP Connection 🔞', labelEn: 'VIP Connection 🔞' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00a884] text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {isSw ? cat.labelSw : cat.labelEn}
              </button>
            ))}
          </div>

          {/* DJ Dropdown Filter & Search (Mobile friendly) */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedDj}
                onChange={(e) => setSelectedDj(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{isSw ? 'Watafsiri Wote (All DJs)' : 'All DJs'}</option>
                <option value="DJ Afro">DJ Afro (Kenya/TZ)</option>
                <option value="DJ Mack">DJ Mack</option>
                <option value="DJ Murphy">DJ Murphy</option>
                <option value="DJ Six">DJ Six</option>
                <option value="Asili (Original)">Asili / Bongo</option>
              </select>
            </div>

            {/* Mobile search bar if on small screen */}
            <div className="relative md:hidden flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isSw ? 'Tafuta...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-2 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Counter & Search query clear */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
          <span>
            {isSw 
              ? `Zimepatikana filamu ${filteredMovies.length} katika Movies-TZ Vault` 
              : `Found ${filteredMovies.length} titles in Movies-TZ Vault`}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              {isSw ? 'Futa utafutaji (Clear search)' : 'Clear search'}
            </button>
          )}
        </div>
      </section>

      {/* MOVIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">
              {isSw ? 'Hakuna movie iliyopatikana' : 'No movies found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isSw 
                ? 'Hujaona movie unayoitafuta? Bofya hapa chini kuiomba moja kwa moja kupitia WhatsApp ya Movies-TZ.'
                : 'Could not find what you are looking for? Request it via WhatsApp.'}
            </p>
            <button
              onClick={onOpenRequest}
              className="inline-flex items-center gap-2 bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSw ? 'Omba Movie Kupitia WhatsApp' : 'Request via WhatsApp'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => {
              const isLocked = movie.isVipOnly && !vipAccess.isActive;

              return (
                <div
                  key={movie.id}
                  onClick={() => handleMovieCardClick(movie)}
                  className="group bg-[#0d131f] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/75 text-emerald-400 border border-emerald-500/30">
                        {movie.quality}
                      </span>
                      {movie.isVipOnly && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow">
                          <Crown className="w-3 h-3 fill-slate-950" />
                          VIP
                        </span>
                      )}
                    </div>

                    {/* Lock or Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        {isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Gradient with DJ info */}
                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <p className="text-[11px] font-bold text-emerald-300 truncate">
                        🎙️ {movie.dj || 'Bongo Cinema'}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#25D366] transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {isSw ? movie.descriptionSw : movie.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {movie.rating}
                      </span>
                      <span>{movie.duration}</span>
                      <span className="text-emerald-400 font-medium">
                        {isLocked ? (isSw ? '🔒 Funga' : 'Locked') : (isSw ? '▶ Tazama' : 'Stream')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* WHATSAPP MOVIE REQUEST CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="bg-[#111b21] border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="text-xs uppercase font-extrabold text-[#25D366] tracking-wider">
              {isSw ? 'HUDUMA YA MOJA KWA MOJA' : 'LIVE REQUEST SERVICE'}
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              {isSw 
                ? 'Je, unahitaji movie yoyote ya Kiswahili?' 
                : 'Need any specific Swahili dubbed movie?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              {isSw
                ? 'Tuma ombi lako kwa Admin wa Movies-TZ sasa hivi kupitia WhatsApp! DJ Afro, DJ Mack, Series na filamu zote mpya zinaongezwa kila siku.'
                : 'Message Movies-TZ admin right on WhatsApp to get any new DJ Afro film or Bongo episode uploaded.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenRequest}
              className="bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>{isSw ? 'Omba Movie WhatsApp' : 'Request on WhatsApp'}</span>
            </button>

            <button
              onClick={onOpenWhatsAppFeed}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{isSw ? 'Fungua Live Chat Group' : 'Open Live Chat Group'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
