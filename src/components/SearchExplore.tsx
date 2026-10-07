import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Heart, 
  UserPlus, 
  MessageSquare, 
  CheckCircle2, 
  Globe,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { UserProfile, CurrentUser } from '../types';
import { calculateCompatibilityScore, ALL_INTERESTS, ALL_LANGUAGES } from '../data/mockData';
import { playPopSound } from '../utils/audio';

interface SearchExploreProps {
  currentUser: CurrentUser;
  profiles: UserProfile[];
  onLike: (profile: UserProfile, score: number) => void;
  onOpenChat: (userId: string) => void;
  onViewProfile: (profile: UserProfile, score: number) => void;
}

export const SearchExplore: React.FC<SearchExploreProps> = ({
  currentUser,
  profiles,
  onLike,
  onOpenChat,
  onViewProfile,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Tag filter
      if (selectedTag && !p.interests.includes(selectedTag)) {
        return false;
      }

      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = p.nickname.toLowerCase().includes(q);
        const matchCountry = p.country.toLowerCase().includes(q) || p.approxLocation.toLowerCase().includes(q);
        const matchBio = p.bio.toLowerCase().includes(q);
        const matchInterests = p.interests.some((i) => i.toLowerCase().includes(q));
        const matchLangs = p.languages.some((l) => l.toLowerCase().includes(q));
        const matchOccupation = p.occupation ? p.occupation.toLowerCase().includes(q) : false;

        if (!matchName && !matchCountry && !matchBio && !matchInterests && !matchLangs && !matchOccupation) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, query, selectedTag]);

  const handleConnect = (profile: UserProfile) => {
    playPopSound();
    const score = calculateCompatibilityScore(currentUser, profile);
    onLike(profile, score);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="text-left space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Search & Global Discovery</span>
          <Globe className="w-5 h-5 text-red-500" />
        </h2>
        <p className="text-xs text-zinc-400">
          Search people worldwide by interests, country, language or profession (e.g. "Software developer in Tanzania")
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by nickname, country (e.g. Tanzania, France), interests, or keywords..."
          className="w-full bg-[#111116] border border-red-950/80 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Tags (Zero-pill styled buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors whitespace-nowrap ${
            selectedTag === null
              ? 'bg-red-600 text-white font-bold shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-red-950'
          }`}
        >
          All Topics
        </button>
        {ALL_INTERESTS.slice(0, 10).map((interest) => (
          <button
            key={interest.name}
            onClick={() => setSelectedTag(selectedTag === interest.name ? null : interest.name)}
            className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors whitespace-nowrap border ${
              selectedTag === interest.name
                ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            {interest.name}
          </button>
        ))}
      </div>

      {/* Search Results Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
          <span>Found {filteredProfiles.length} compatible profiles</span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e13] rounded-2xl border border-red-950 space-y-3">
            <Search className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No results matched your search</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try searching for different keywords such as "Music", "Tanzania", "Technology", or "Travel".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProfiles.map((p) => {
              const score = calculateCompatibilityScore(currentUser, p);
              const isLiked = currentUser.likedUserIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className="bg-[#101015] border border-red-950/80 rounded-2xl overflow-hidden shadow-lg hover:border-red-600/50 transition-all flex flex-col justify-between group"
                >
                  <div className="p-4 space-y-3">
                    {/* Header with Avatar and Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={p.avatarUrl}
                            alt={p.nickname}
                            className="w-12 h-12 rounded-xl object-cover border border-red-950 group-hover:scale-105 transition-transform"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${
                              p.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                            }`}
                          />
                        </div>

                        <div className="text-left">
                          <h4 className="font-bold text-sm text-white flex items-center gap-1">
                            <span>{p.nickname}, {p.age}</span>
                            {p.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-950" />
                            )}
                          </h4>
                          <p className="text-[11px] text-red-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{p.approxLocation || p.country}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-black bg-red-950/80 text-red-300 px-2 py-0.5 rounded-lg border border-red-800">
                        {score}%
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-zinc-300 line-clamp-2 text-left">
                      "{p.bio}"
                    </p>

                    {/* Interests tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.interests.slice(0, 3).map((int) => (
                        <span
                          key={int}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                        >
                          {int}
                        </span>
                      ))}
                      {p.interests.length > 3 && (
                        <span className="text-[10px] text-zinc-500">
                          +{p.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-[#0a0a0f] border-t border-red-950/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewProfile(p, score)}
                      className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer"
                    >
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      {isLiked ? (
                        <button
                          onClick={() => onOpenChat(p.id)}
                          className="flex items-center gap-1 bg-red-950 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-800 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                          <span>Chat</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(p)}
                          className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
