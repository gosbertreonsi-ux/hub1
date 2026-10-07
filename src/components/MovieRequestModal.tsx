import React, { useState } from 'react';
import { X, Send, Film, MessageCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { playNotificationChime, playPopSound } from '../utils/audio';

interface MovieRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onBroadcastToChat?: (text: string) => void;
}

export const MovieRequestModal: React.FC<MovieRequestModalProps> = ({
  isOpen,
  onClose,
  lang,
  onBroadcastToChat,
}) => {
  const isSw = lang === 'sw';
  const [movieName, setMovieName] = useState('');
  const [preferredDj, setPreferredDj] = useState('DJ Afro');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName.trim()) return;

    playPopSound();
    const formattedText = `Habari Admin wa Movies-TZ! Naitwa ${userName || 'Mteja wa VIP'}, ninaomba tafadhali muweke movie ya: *${movieName.trim()}* (Msimulizi: ${preferredDj}). Asante sana!`;

    // Also broadcast to the internal group chat feed
    if (onBroadcastToChat) {
      onBroadcastToChat(`Nimeomba movie ya "${movieName.trim()}" (${preferredDj}) ipandishwe kwenye VIP Cinema! 🔥🍿`);
    }

    setSubmitted(true);
    playNotificationChime();

    // Trigger WhatsApp URL
    const waUrl = `https://api.whatsapp.com/send?phone=255712345678&text=${encodeURIComponent(formattedText)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
      onClose();
      setSubmitted(false);
      setMovieName('');
      setUserName('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#111b21] text-slate-100 w-full max-w-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1f2c34] px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00a884] flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {isSw ? 'Omba Movie Kupitia WhatsApp' : 'Request Movie via WhatsApp'}
              </h3>
              <p className="text-[11px] text-emerald-400">Movies-TZ Admin Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="font-bold text-white text-base">
                {isSw ? 'Ombi Lako Linatumwa WhatsApp!' : 'Opening WhatsApp with Your Request!'}
              </h4>
              <p className="text-xs text-slate-300">
                {isSw 
                  ? 'Admin wetu atapokea ombi na kulipakia kwenye VIP Cinema ndani ya muda mfupi.'
                  : 'Our admins will receive your request and add it to the VIP catalog.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#1f2c34] rounded-xl p-3 border border-slate-700 text-xs text-slate-300">
                {isSw
                  ? 'Unatafuta filamu yoyote ya DJ Afro, DJ Mack, au Bongo Movie ambayo haipo kwenye orodha? Iombe hapa na admin ataipakia!'
                  : 'Cannot find a specific movie or series? Submit your request and our admin team will upload it!'}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Jina la Movie au Series Unayotaka *' : 'Movie or Series Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isSw ? 'mf. IP MAN 4, KIGONGO, EXTRACTION 2...' : 'e.g. IP MAN 4, EXTRACTION 2...'}
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  className="w-full bg-[#1f2c34] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Msimulizi Unayempendelea (DJ Voice)' : 'Preferred DJ / Narrator'}
                </label>
                <select
                  value={preferredDj}
                  onChange={(e) => setPreferredDj(e.target.value)}
                  className="w-full bg-[#1f2c34] text-white px-3 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="DJ Afro">DJ Afro (Kenya & Tanzania)</option>
                  <option value="DJ Mack">DJ Mack (Tafsiri ya Kiswahili)</option>
                  <option value="DJ Murphy">DJ Murphy</option>
                  <option value="DJ Six">DJ Six</option>
                  <option value="Bongo Movie Asili">Bongo Movie Asili (Tanzanian)</option>
                  <option value="Sauti Asili + Subtitles">Sauti Asili + Subtitles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Jina Lako (Hiari)' : 'Your Name (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={isSw ? 'mf. Juma wa Dar' : 'e.g. Juma'}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#1f2c34] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{isSw ? 'Tuma Ombi kwa Admin WhatsApp' : 'Send Request via WhatsApp'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
