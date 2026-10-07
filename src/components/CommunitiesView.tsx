import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Plus, 
  Check, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  Flame, 
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { CommunityGroup, CommunityEvent } from '../types';
import { playPopSound } from '../utils/audio';

interface CommunitiesViewProps {
  groups: CommunityGroup[];
  events: CommunityEvent[];
  onToggleJoinGroup: (groupId: string) => void;
  onToggleAttendEvent: (eventId: string) => void;
  onOpenGroupChat: (groupName: string) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  groups,
  events,
  onToggleJoinGroup,
  onToggleAttendEvent,
  onOpenGroupChat,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'groups' | 'events'>('groups');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGroups = groups.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-950 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>MIZIZI Communities & Events</span>
            <Users className="w-6 h-6 text-red-500" />
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            PRD §34–§37: Connect with tech circles, music collectives, and live regional meetups
          </p>
        </div>

        {/* Sub-tab toggle (Groups vs Events) */}
        <div className="flex items-center bg-[#111116] p-1 rounded-2xl border border-red-950/80 w-fit">
          <button
            onClick={() => setActiveSubTab('groups')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'groups'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Groups & Circles ({groups.length})
          </button>
          <button
            onClick={() => setActiveSubTab('events')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'events'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upcoming Events ({events.length})
          </button>
        </div>
      </div>

      {/* GROUPS TAB */}
      {activeSubTab === 'groups' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {['all', 'Technology', 'Creative', 'Business', 'Culture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium cursor-pointer transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'All Communities' : cat}
              </button>
            ))}
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-[#0e0e13] border border-red-950/80 rounded-3xl overflow-hidden shadow-xl hover:border-red-600/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Banner & Avatar */}
                  <div className="relative h-28 bg-black">
                    <img
                      src={group.bannerUrl}
                      alt={group.name}
                      className="w-full h-full object-cover filter brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-transparent to-transparent" />
                    
                    <div className="absolute -bottom-4 left-4 flex items-end gap-3">
                      <img
                        src={group.avatarUrl}
                        alt={group.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-xl bg-black"
                      />
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="pt-6 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {group.name}
                        </h3>
                        <p className="text-[11px] text-red-400 font-semibold mt-0.5">
                          {group.category} · {group.membersCount.toLocaleString()} Members
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          playPopSound();
                          onToggleJoinGroup(group.id);
                        }}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 border ${
                          group.isJoined
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-red-500'
                            : 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-500 shadow-md shadow-red-950'
                        }`}
                      >
                        {group.isJoined ? 'Joined ✓' : '+ Join Group'}
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                      {group.description}
                    </p>

                    {/* Recent Discussion Teaser */}
                    {group.recentDiscussion && (
                      <div className="bg-[#14141c] p-2.5 rounded-xl border border-red-950/50 text-[11px] text-zinc-400 italic">
                        💬 {group.recentDiscussion}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {group.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Group Chat trigger */}
                <div className="p-4 bg-[#0a0a0f] border-t border-red-950/60 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">
                    {group.postsCount} community posts
                  </span>

                  <button
                    onClick={() => {
                      playPopSound();
                      onOpenGroupChat(group.name);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Community Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS TAB */}
      {activeSubTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#0e0e13] border border-red-950/80 rounded-3xl overflow-hidden shadow-xl text-left flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-black">
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover filter brightness-85"
                  />
                  <div className="absolute top-3 left-3 bg-red-950/90 border border-red-600 text-red-300 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow">
                    {ev.category}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {ev.title}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-zinc-300">
                    <p className="flex items-center gap-2 text-red-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.date} · {ev.time}</span>
                    </p>
                    <p className="flex items-center gap-2 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{ev.location}</span>
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Hosted by <b>{ev.organizer}</b>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0a0a0f] border-t border-red-950/60 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  {ev.attendeesCount} People Going
                </span>

                <button
                  onClick={() => {
                    playPopSound();
                    onToggleAttendEvent(ev.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                    ev.isAttending
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950'
                  }`}
                >
                  {ev.isAttending ? '✓ You are Going' : 'RSVP / Interested'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
