import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Phone, 
  Video, 
  Languages, 
  Smile, 
  Paperclip, 
  Mic, 
  Play, 
  Pause, 
  CheckCheck, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  MessageSquare, 
  User, 
  MoreVertical,
  Radio,
  Clock,
  Heart,
  Flame,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { 
  UserProfile, 
  CurrentUser, 
  ChatMessage, 
  Match, 
  MessageReaction 
} from '../types';
import { calculateCompatibilityScore } from '../data/mockData';
import { playPopSound, playNotificationChime, playVoiceNoteBeep } from '../utils/audio';

interface ChatSystemProps {
  currentUser: CurrentUser;
  matches: Match[];
  profiles: UserProfile[];
  conversations: Record<string, ChatMessage[]>;
  activeParticipantId: string | null;
  onSelectParticipant: (userId: string) => void;
  onSendMessage: (participantId: string, text: string, type?: 'text' | 'voice') => void;
  onStartVoiceCall: (participant: UserProfile) => void;
  onStartVideoCall: (participant: UserProfile) => void;
  onReportUser: (participant: UserProfile) => void;
  onBlockUser: (participant: UserProfile) => void;
  onViewProfile: (participant: UserProfile, score: number) => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  currentUser,
  matches,
  profiles,
  conversations,
  activeParticipantId,
  onSelectParticipant,
  onSendMessage,
  onStartVoiceCall,
  onStartVideoCall,
  onReportUser,
  onBlockUser,
  onViewProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [selectedTargetLang, setSelectedTargetLang] = useState('English');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [translatedMsgIds, setTranslatedMsgIds] = useState<Record<string, boolean>>({});

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Selected participant object
  const activeProfile = profiles.find((p) => p.id === activeParticipantId) || null;
  const currentMessages = activeParticipantId ? conversations[activeParticipantId] || [] : [];
  const activeCompatibility = activeProfile
    ? calculateCompatibilityScore(currentUser, activeProfile)
    : 88;

  // Auto scroll chat to bottom
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeParticipantId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeParticipantId) return;

    playPopSound();
    onSendMessage(activeParticipantId, inputText.trim(), 'text');
    setInputText('');
  };

  const handleSendVoiceNote = () => {
    if (!activeParticipantId) return;
    setIsRecordingVoice(true);
    playVoiceNoteBeep();

    setTimeout(() => {
      setIsRecordingVoice(false);
      onSendMessage(
        activeParticipantId,
        'Voice Message (0:14) 🎙️',
        'voice'
      );
      playPopSound();
    }, 2000);
  };

  const toggleTranslate = (msgId: string) => {
    playPopSound();
    setTranslatedMsgIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      playVoiceNoteBeep();
      setTimeout(() => setPlayingVoiceId(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 flex flex-col h-[calc(100vh-5rem)]">
      {/* Integrated Unified Container (All on the same layout) */}
      <div className="flex-1 bg-[#0c0c11] border border-red-950/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANEL: Matches Bar & Conversation History */}
        <aside
          className={`w-full md:w-80 lg:w-96 bg-[#09090d] border-r border-red-950/80 flex flex-col ${
            activeParticipantId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Matches Header */}
          <div className="p-4 border-b border-red-950/80 flex items-center justify-between">
            <div>
              <h3 className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Your Connections</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                {matches.length} Mutual Matches · 1-to-1 Conversations
              </p>
            </div>
            <span className="text-[10px] font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-800">
              {matches.length}
            </span>
          </div>

          {/* New Mutual Matches Horizontal Scroller */}
          <div className="p-3 border-b border-red-950/60 bg-[#0e0e14]">
            <span className="text-[10px] uppercase font-bold text-red-400/80 tracking-wider block mb-2 px-1">
              New Mutual Matches
            </span>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {matches.map((m) => {
                const matchedUser = profiles.find((p) => p.id === m.userId);
                if (!matchedUser) return null;
                const isSelected = activeParticipantId === matchedUser.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectParticipant(matchedUser.id)}
                    className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`relative p-0.5 rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-red-500 bg-red-600'
                          : 'group-hover:ring-1 group-hover:ring-red-400 bg-gradient-to-tr from-red-600 to-rose-700'
                      }`}
                    >
                      <img
                        src={matchedUser.avatarUrl}
                        alt={matchedUser.nickname}
                        className="w-12 h-12 rounded-full object-cover border-2 border-black"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-black text-red-400 px-1 rounded-full border border-red-800">
                        {m.compatibilityScore}%
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-300 font-medium truncate max-w-[60px]">
                      {matchedUser.nickname}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-red-950/40">
            {matches.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs">No active matches yet.</p>
                <p className="text-[11px] text-zinc-600">
                  Head to Discover and like someone to start talking!
                </p>
              </div>
            ) : (
              matches.map((m) => {
                const matchedUser = profiles.find((p) => p.id === m.userId);
                if (!matchedUser) return null;
                const userMsgs = conversations[matchedUser.id] || [];
                const lastMsg = userMsgs[userMsgs.length - 1];
                const isSelected = activeParticipantId === matchedUser.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectParticipant(matchedUser.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#181822] border-l-4 border-red-600'
                        : 'hover:bg-[#12121a]'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={matchedUser.avatarUrl}
                        alt={matchedUser.nickname}
                        className="w-11 h-11 rounded-full object-cover border border-red-950"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                          matchedUser.onlineStatus === 'online'
                            ? 'bg-emerald-500'
                            : 'bg-zinc-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                          <span>{matchedUser.nickname}</span>
                          {matchedUser.verified && (
                            <CheckCircle2 className="w-3 h-3 text-red-500 fill-red-950 inline" />
                          )}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {lastMsg ? lastMsg.timestamp : 'Matched'}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : `Mutual connection (${m.compatibilityScore}% match)`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER / MAIN PANEL: Active Conversation & Controls */}
        {activeProfile ? (
          <main className="flex-1 flex flex-col bg-[#0e0e13] text-white">
            {/* Active Chat Header */}
            <header className="p-3 sm:p-4 bg-[#111116] border-b border-red-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Mobile Back Button */}
                <button
                  onClick={() => onSelectParticipant('')}
                  className="md:hidden p-1 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div 
                  className="relative cursor-pointer" 
                  onClick={() => setShowProfileDrawer(true)}
                >
                  <img
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.nickname}
                    className="w-10 h-10 rounded-full object-cover border border-red-500/50"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                      activeProfile.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-500'
                    }`}
                  />
                </div>

                <div className="text-left cursor-pointer" onClick={() => setShowProfileDrawer(true)}>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white">{activeProfile.nickname}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                      {activeCompatibility}% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-red-400/80 capitalize flex items-center gap-1">
                    <span>{activeProfile.onlineStatus}</span>
                    <span>·</span>
                    <span>{activeProfile.country}</span>
                  </p>
                </div>
              </div>

              {/* Call Action Triggers & Menu */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Voice Call Button */}
                <button
                  onClick={() => onStartVoiceCall(activeProfile)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 border border-red-950 hover:border-red-600 hover:bg-red-950/60 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
                  title="Start Voice Call"
                >
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="hidden sm:inline">Voice Call</span>
                </button>

                {/* Video Call Button */}
                <button
                  onClick={() => onStartVideoCall(activeProfile)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg shadow-red-950/80"
                  title="Start Video Call (WebRTC)"
                >
                  <Video className="w-4 h-4 fill-white" />
                  <span className="hidden sm:inline">Video Call</span>
                </button>

                {/* Profile Info Drawer Toggle */}
                <button
                  onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-red-950 cursor-pointer"
                  title="View Profile Details"
                >
                  <Info className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </header>

            {/* Translation Settings Strip (PRD §15 & §53) */}
            <div className="bg-[#14141c] px-4 py-1.5 border-b border-red-950/40 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-red-300">
                <Languages className="w-3.5 h-3.5 text-red-400" />
                <span>Live Translation:</span>
                <span className="font-semibold text-white">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Translate to:</span>
                <select
                  value={selectedTargetLang}
                  onChange={(e) => setSelectedTargetLang(e.target.value)}
                  className="bg-black/60 border border-zinc-700 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none focus:border-red-500"
                >
                  <option value="English">English</option>
                  <option value="Swahili">Swahili</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0a0a0f] bg-[radial-gradient(#181822_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Privacy Encryption Notice */}
              <div className="max-w-md mx-auto text-center p-2 rounded-xl bg-[#14141a] border border-red-950/60 text-[11px] text-zinc-400">
                <span>
                  🔒 One-to-one encrypted session between you & <b>{activeProfile.nickname}</b>.
                </span>
              </div>

              {currentMessages.map((msg) => {
                const isMe = msg.senderId === 'me';
                const isTranslated = !!translatedMsgIds[msg.id];
                const displayText =
                  isTranslated && msg.translatedText ? msg.translatedText : msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md relative group ${
                        isMe
                          ? 'bg-gradient-to-r from-red-700 to-rose-700 text-white rounded-tr-none'
                          : 'bg-[#181822] text-zinc-100 rounded-tl-none border border-red-950/70'
                      }`}
                    >
                      {/* VOICE MESSAGE TYPE */}
                      {msg.type === 'voice' ? (
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <button
                            onClick={() => toggleVoicePlayback(msg.id)}
                            className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer shadow hover:scale-105"
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-3.5 h-3.5 fill-white" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 flex items-center gap-0.5 h-5">
                            {[30, 60, 45, 90, 70, 40, 80, 50, 85, 30, 60, 40].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-1 rounded-full ${
                                  playingVoiceId === msg.id
                                    ? 'bg-white animate-pulse'
                                    : 'bg-red-400/70'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-300">0:14</span>
                        </div>
                      ) : (
                        /* TEXT MESSAGE TYPE */
                        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-text">
                          {displayText}
                        </p>
                      )}

                      {/* Translation Indicator & Toggle */}
                      {msg.translatedText && (
                        <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => toggleTranslate(msg.id)}
                            className="text-red-200 hover:text-white font-medium flex items-center gap-1 cursor-pointer underline"
                          >
                            <Languages className="w-3 h-3" />
                            <span>
                              {isTranslated ? 'Show original' : `Translate to ${selectedTargetLang}`}
                            </span>
                          </button>
                          {isTranslated && (
                            <span className="text-zinc-300 italic">Translated by Mizizi AI</span>
                          )}
                        </div>
                      )}

                      {/* Timestamp & Read ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-zinc-300/80">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatScrollRef} className="h-2" />
            </div>

            {/* Input Bar */}
            <footer className="p-3 bg-[#111116] border-t border-red-950 flex items-center gap-2">
              {/* Voice Note Record Button */}
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className={`p-2.5 rounded-full cursor-pointer transition-all ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-ping'
                    : 'bg-zinc-900 text-red-400 hover:bg-zinc-800'
                }`}
                title="Send Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Quick Preset Emojis */}
              <div className="hidden sm:flex items-center gap-1">
                {['❤️', '🔥', '✨', '👋', '☕'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setInputText((prev) => prev + em)}
                    className="p-1 hover:bg-zinc-800 rounded text-sm cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeProfile.nickname}...`}
                  className="w-full bg-[#181822] text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm border border-red-950 focus:outline-none focus:border-red-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    inputText.trim()
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>
          </main>
        ) : (
          /* Empty State when no conversation selected */
          <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0e] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Select a match to start connecting</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Discover compatible people on the platform, chat with live translation, or initiate real-time WebRTC voice and video calls.
            </p>
          </main>
        )}

        {/* RIGHT DRAWER: Participant Profile & Safety Controls (Collapsible) */}
        {showProfileDrawer && activeProfile && (
          <aside className="w-full md:w-72 lg:w-80 bg-[#09090d] border-l border-red-950/80 p-4 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-red-950 pb-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Connection Details
              </span>
              <button
                onClick={() => setShowProfileDrawer(false)}
                className="text-zinc-400 hover:text-white cursor-pointer text-xs"
              >
                Close ✕
              </button>
            </div>

            <div className="text-center space-y-2">
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.nickname}
                className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-red-500/60 shadow-lg"
              />
              <h4 className="font-bold text-base text-white">
                {activeProfile.nickname}, {activeProfile.age}
              </h4>
              <p className="text-xs text-red-400">{activeProfile.approxLocation}</p>
              <div className="text-xs bg-red-950/60 text-red-200 py-1 px-3 rounded-full border border-red-800 inline-block">
                {activeCompatibility}% Compatibility Match
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-zinc-400 block mb-1">About</span>
                <p className="text-zinc-300 leading-relaxed">"{activeProfile.bio}"</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 block mb-1">Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.interests.map((i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-zinc-400 block mb-1">Languages</span>
                <p className="text-zinc-300">{activeProfile.languages.join(', ')}</p>
              </div>
            </div>

            {/* Safety & Moderation Actions (PRD §22) */}
            <div className="pt-4 border-t border-red-950 space-y-2 text-xs">
              <button
                onClick={() => onReportUser(activeProfile)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-900/40 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Report User</span>
              </button>

              <button
                onClick={() => onBlockUser(activeProfile)}
                className="w-full py-2 px-3 rounded-xl bg-red-950/50 hover:bg-red-900 text-red-300 border border-red-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Block Communication</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
