import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Lock, 
  Play, 
  Pause, 
  Share2, 
  CheckCheck, 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  Sparkles, 
  Users, 
  Crown, 
  Film,
  Volume2
} from 'lucide-react';
import { ChatMessage, ChatPerson, Language, VIPAccess, Movie } from '../types';
import { INITIAL_MESSAGES, CHAT_PERSONS, MOVIES_DATABASE } from '../data/mockData';
import { playNotificationChime, playPopSound, playVoiceNoteBeep } from '../utils/audio';

interface WhatsAppFeedProps {
  vipAccess: VIPAccess;
  onOpenPayment: () => void;
  onWatchMovie: (movie: Movie) => void;
  lang: Language;
  onSwitchToCinema: () => void;
}

export const WhatsAppFeed: React.FC<WhatsAppFeedProps> = ({
  vipAccess,
  onOpenPayment,
  onWatchMovie,
  lang,
  onSwitchToCinema,
}) => {
  const isSw = lang === 'sw';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<string | null>('Amina Bongo');
  const [memberCount, setMemberCount] = useState(1034);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [readMoreDesc, setReadMoreDesc] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Live member count increment simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setMemberCount((prev) => (prev < 1480 ? prev + Math.floor(Math.random() * 3) + 1 : prev));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Reveal messages progressively like live incoming WhatsApp chat
  useEffect(() => {
    let index = 0;
    const initialBatch = INITIAL_MESSAGES.slice(0, 4);
    setMessages(initialBatch);

    const interval = setInterval(() => {
      index++;
      const nextIndex = 3 + index;
      if (nextIndex < INITIAL_MESSAGES.length) {
        const nextMsg = INITIAL_MESSAGES[nextIndex];
        setIsTyping(nextMsg.sender.name);
        
        setTimeout(() => {
          setMessages((prev) => [...prev, nextMsg]);
          setIsTyping(null);
          playNotificationChime();
        }, 1200);
      } else {
        clearInterval(interval);
        setIsTyping(null);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat smoothly
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle voice note playback simulation
  const handleToggleAudio = (msgId: string) => {
    if (isPlayingAudioId === msgId) {
      setIsPlayingAudioId(null);
    } else {
      setIsPlayingAudioId(msgId);
      playVoiceNoteBeep();
      setTimeout(() => {
        setIsPlayingAudioId(null);
      }, 5000);
    }
  };

  // Handle sending user message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    playPopSound();
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: {
        id: 'user-me',
        name: isSw ? 'Wewe' : 'You',
        phone: '0712 *** 999',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        role: 'member',
      },
      type: 'text',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [{ emoji: '❤️', count: 1 }],
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger an admin / member reply after 2 seconds
    setTimeout(() => {
      setIsTyping('Rose 😘 (Admin)');
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: CHAT_PERSONS.rose,
          type: 'text',
          text: isSw
            ? 'Karibu sana mpendwa! Jiunge na VIP kupata movie zote mpya za Bongo, DJ Afro na connection bila kukwama! 🔞🍿'
            : 'Welcome friend! Join VIP to stream all latest Bongo movies, DJ Afro dubbed films and uncensored connections!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '🔥', count: 18 }],
        };
        setMessages((prev) => [...prev, replyMsg]);
        setIsTyping(null);
        playNotificationChime();
      }, 1500);
    }, 1000);
  };

  // Handle clicking a video message in chat
  const handleVideoClick = (msg: ChatMessage) => {
    if (vipAccess.isActive) {
      // Find matching movie or default
      const movie = MOVIES_DATABASE.find((m) => m.id === msg.movieRefId) || MOVIES_DATABASE[0];
      onWatchMovie(movie);
    } else {
      // Prompt payment / VIP activation
      onOpenPayment();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#0b141a] text-slate-100 flex flex-col justify-between max-w-4xl mx-auto shadow-2xl border-x border-slate-800">
      {/* WhatsApp Chat Header */}
      <header className="sticky top-16 z-30 bg-[#1f2c34] px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => setShowGroupModal(true)}>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); onSwitchToCinema(); }}
            className="text-slate-300 hover:text-white p-1 -ml-1 cursor-pointer"
            title={isSw ? 'Rudi kwenye Cinema' : 'Back to Cinema'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Group Avatar with verified check badge */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Group Avatar"
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/50"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full p-0.5 border-2 border-[#1f2c34]">
              <Lock className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base text-slate-100 leading-tight">
                Video Tamu za Bongo 🔞
              </h1>
              <span className="text-[10px] bg-red-600/30 text-red-300 px-1 py-0.2 rounded font-semibold border border-red-500/30">
                18+
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium truncate max-w-[210px] sm:max-w-md">
              {isTyping ? (
                <span className="italic flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isTyping} {isSw ? 'anaandika...' : 'is typing...'}
                </span>
              ) : (
                `+255 712 *** 678, +255 754 *** 456, +${memberCount} wengine`
              )}
            </p>
          </div>
        </div>

        {/* Header Right Action Icons */}
        <div className="flex items-center gap-2 text-slate-300">
          <button 
            onClick={() => setShowGroupModal(true)}
            className="p-2 hover:bg-slate-700/50 rounded-full cursor-pointer text-[#00a884]"
            title={isSw ? 'Maelezo ya Group' : 'Group Info'}
          >
            <Users className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenPayment}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#00a884] hover:bg-[#008f70] text-white rounded-full text-xs font-bold cursor-pointer transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{isSw ? 'Jiunge VIP' : 'Join VIP'}</span>
          </button>
          <button 
            onClick={() => setShowGroupModal(true)} 
            className="p-1.5 hover:bg-slate-700/50 rounded-full cursor-pointer"
          >
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Chat Messages Body with WhatsApp authentic wallpaper texture */}
      <main className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3.5 bg-[#0b141a] bg-opacity-95 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="bg-[#182229] text-slate-400 text-[11px] px-3 py-1 rounded-lg shadow-sm border border-slate-800">
            {isSw ? 'Leo, 6 Oktoba 2026' : 'Today, October 6, 2026'}
          </span>
        </div>

        {/* Security / Encryption Notice Banner */}
        <div className="bg-[#182229]/90 border border-amber-500/20 rounded-xl p-2.5 mx-auto max-w-md text-center text-[11.5px] text-amber-200/90 shadow-sm flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            {isSw
              ? 'Meseji zote zinalindwa kwa njia fiche ya mwisho-hadi-mwisho (End-to-End Encrypted).'
              : 'Messages and calls are end-to-end encrypted. No one outside of this chat can read them.'}
          </span>
        </div>

        {/* Messages List */}
        {messages.map((msg) => {
          const isUser = msg.sender.id === 'user-me';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-opacity duration-300`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-2.5 sm:p-3 shadow-md relative ${
                  isUser
                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                }`}
              >
                {/* Sender Tag with Tanzanian Masked Phone Number */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mb-1 text-[11px]">
                    <span className="font-bold text-[#53bdeb] hover:underline cursor-pointer">
                      {msg.sender.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {msg.sender.phone}
                    </span>
                  </div>
                )}

                {/* Forwarded Header */}
                {msg.isForwarded && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 italic mb-1.5">
                    <Share2 className="w-3 h-3 text-slate-400 rotate-180" />
                    <span>{isSw ? 'Imetumwa mbele' : 'Forwarded'}</span>
                  </div>
                )}

                {/* TEXT MESSAGE */}
                {msg.type === 'text' && (
                  <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap select-text">
                    {msg.text}
                  </p>
                )}

                {/* VIDEO MESSAGE PREVIEW */}
                {msg.type === 'video' && (
                  <div 
                    onClick={() => handleVideoClick(msg)}
                    className="group relative rounded-xl overflow-hidden cursor-pointer mt-1 border border-slate-700/70 bg-black/40"
                  >
                    <img
                      src={msg.thumb}
                      alt="Movie Preview"
                      className="w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex flex-col justify-between p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded text-white flex items-center gap-1">
                          <Film className="w-3 h-3 text-emerald-400" />
                          {msg.size || 'HD Video'}
                        </span>
                        {!vipAccess.isActive && (
                          <span className="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            VIP Only
                          </span>
                        )}
                      </div>

                      {/* Play / Unlock Big Center Icon */}
                      <div className="self-center">
                        <div className="w-12 h-12 rounded-full bg-[#00a884]/90 group-hover:bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          {vipAccess.isActive ? (
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          ) : (
                            <Lock className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Video Meta Info at bottom */}
                      <div className="flex items-center justify-between text-xs text-white">
                        <span className="font-semibold text-emerald-300">
                          {vipAccess.isActive
                            ? (isSw ? '▶ Gusa kutazama HD' : '▶ Tap to stream HD')
                            : (isSw ? '🔒 Gusa kufungua (Lipia 2,000/=)' : '🔒 Tap to unlock (Pay TZS 2,000)')}
                        </span>
                        <span className="text-[10px] text-slate-300">1080p FHD</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AUDIO / VOICE NOTE MESSAGE */}
                {msg.type === 'audio' && (
                  <div className="flex items-center gap-3 py-1 px-1 min-w-[200px] sm:min-w-[260px]">
                    <button
                      onClick={() => handleToggleAudio(msg.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow ${
                        isPlayingAudioId === msg.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#00a884] text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isPlayingAudioId === msg.id ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>

                    {/* Animated Waveform */}
                    <div className="flex-1 flex items-center gap-0.5 h-6">
                      {[40, 75, 55, 90, 60, 85, 30, 95, 70, 50, 80, 45, 65, 90, 40].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isPlayingAudioId === msg.id
                              ? 'bg-[#53bdeb] animate-pulse'
                              : 'bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {msg.duration || '0:45'}
                    </span>
                  </div>
                )}

                {/* Message Footer: Timestamp & Double Blue Ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.time}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>

                {/* Interactive Message Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="absolute -bottom-3 left-3 bg-[#182229] border border-slate-700 rounded-full px-2 py-0.5 flex items-center gap-1.5 shadow-sm">
                    {msg.reactions.map((rx, idx) => (
                      <span key={idx} className="text-[11px] flex items-center gap-0.5">
                        <span>{rx.emoji}</span>
                        <span className="text-[10px] text-slate-300 font-semibold">{rx.count}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-[#202c33]/70 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isTyping} {isSw ? 'anaandika...' : 'is typing...'}</span>
          </div>
        )}

        <div ref={chatBottomRef} className="h-4" />
      </main>

      {/* Floating Action Button: Join Group / VIP Access */}
      <div className="sticky bottom-16 sm:bottom-20 z-20 flex justify-center px-4 pointer-events-none">
        <button
          onClick={() => setShowGroupModal(true)}
          className="pointer-events-auto flex items-center gap-2 bg-[#00a884] hover:bg-[#008f70] active:scale-95 text-white font-bold py-2.5 px-5 rounded-full shadow-xl shadow-emerald-950/60 transition-all cursor-pointer border border-emerald-400/30"
        >
          <Users className="w-4 h-4" />
          <span>{isSw ? 'Jiunge na Group (1,034+ Members)' : 'Join WhatsApp Group'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping ml-1" />
        </button>
      </div>

      {/* Bottom Message Input Bar */}
      <footer className="sticky bottom-0 z-30 bg-[#202c33] px-3 py-2 border-t border-slate-700/80 flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setInputText((prev) => prev + ' 🔥')}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-full cursor-pointer"
          title="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Quick Emoji Bar for Fast Mobile Interactivity */}
        <div className="hidden sm:flex items-center gap-1">
          {['🔥', '❤️', '🔞', '🍿', '🍑'].map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setInputText((prev) => prev + em)}
              className="text-sm p-1 hover:bg-slate-700 rounded cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isSw ? 'Andika ujumbe wako kwenye group...' : 'Type a message in the group...'}
            className="w-full bg-[#2a3942] text-slate-100 placeholder-slate-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          {inputText.trim() ? (
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer transition-colors shadow"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setInputText(isSw ? 'Nahitaji movie mpya ya DJ Afro!' : 'I need the new DJ Afro movie!');
              }}
              className="w-9 h-9 rounded-full bg-[#2a3942] hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              title="Voice / Mic"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </form>
      </footer>

      {/* WHATSAPP GROUP INFO MODAL (Matches whatsap4.movies-tz.online bottom sheet) */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-[#1f2c34] text-slate-100 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-700 p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top close handle */}
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="text-center">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Group Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-emerald-500 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 bg-[#00a884] text-white p-1 rounded-full text-xs">
                  <Lock className="w-3.5 h-3.5" />
                </span>
              </div>

              <h2 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                Video Tamu za Bongo 🔞
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSw ? 'Created by Rose 😘 · Miezi 6 iliyopita' : 'Created by Rose 😘 · 6 months ago'}
              </p>

              {/* Members reactions avatar stack */}
              <div className="flex items-center justify-center gap-1 mt-3">
                <div className="flex -space-x-2">
                  {Object.values(CHAT_PERSONS).slice(0, 5).map((p) => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.name}
                      className="w-7 h-7 rounded-full border-2 border-[#1f2c34] object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-400 ml-2">
                  +{memberCount} Members
                </span>
              </div>

              {/* Group Description */}
              <div className="bg-[#111b21] rounded-xl p-3 text-left text-xs text-slate-300 my-4 border border-slate-700/60">
                <p className="font-semibold text-white mb-1">
                  {isSw ? 'Group Rasmi la Utamu wa Bongo & Movies-TZ' : 'Official Movies-TZ VIP Group'}
                </p>
                <p className="text-slate-400">
                  {isSw ? 'WhatsApp Group Invite rasmi...' : 'Official WhatsApp Group Invite...'}
                </p>

                {readMoreDesc ? (
                  <div className="mt-2 space-y-1 text-slate-300 border-t border-slate-700 pt-2 animate-in fade-in">
                    <p>🔥 Video za Bongo na Connection zote</p>
                    <p>🎬 DJ Afro, DJ Mack na Series zote mpya za Kiswahili</p>
                    <p>🍿 Full HD 1080p Streaming & Direct Downloads</p>
                    <p>🔞 Warembo wa Dar, Mwanza, Arusha na Morogoro</p>
                    <p>⚡ Link zote za Telegram na WhatsApp Direct</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setReadMoreDesc(!readMoreDesc)}
                  className="text-emerald-400 font-semibold mt-1 inline-block hover:underline cursor-pointer"
                >
                  {readMoreDesc ? (isSw ? 'Funga' : 'Show less') : (isSw ? 'Soma zaidi...' : 'Read more...')}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowGroupModal(false);
                    onOpenPayment();
                  }}
                  className="w-full bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {vipAccess.isActive
                      ? (isSw ? 'Wewe ni Mwanachama wa VIP (Ingia)' : 'You are VIP (Enter)')
                      : (isSw ? 'Jiunge na Group (Lipia TZS 2,000)' : 'Join the Group (Pay TZS 2,000)')}
                  </span>
                </button>

                <button
                  onClick={() => setShowGroupModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  {isSw ? 'Funga Dirisha' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
