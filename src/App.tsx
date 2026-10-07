import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeFeed } from './components/HomeFeed';
import { ReelsView } from './components/ReelsView';
import { DiscoveryView } from './components/DiscoveryView';
import { ChatSystem } from './components/ChatSystem';
import { CommunitiesView } from './components/CommunitiesView';
import { BusinessHubView } from './components/BusinessHubView';
import { SearchExplore } from './components/SearchExplore';
import { CallModal } from './components/CallModal';
import { IncomingCallBanner } from './components/IncomingCallBanner';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { SafetyPrivacyModal } from './components/SafetyPrivacyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { 
  UserProfile, 
  CurrentUser, 
  ChatMessage, 
  Match, 
  CallSession, 
  ReportTicket,
  OnlineStatus,
  Post,
  Story,
  Reel,
  CommunityGroup,
  BusinessPage,
  CommunityEvent 
} from './types';
import { 
  INITIAL_CURRENT_USER, 
  MOCK_DISCOVERY_USERS, 
  INITIAL_CHAT_MESSAGES,
  MOCK_STORIES,
  MOCK_POSTS,
  MOCK_REELS,
  MOCK_COMMUNITIES,
  MOCK_BUSINESS_PAGES,
  MOCK_EVENTS,
  calculateCompatibilityScore 
} from './data/mockData';
import { playNotificationChime, playPopSound } from './utils/audio';

const STORAGE_KEY = 'mizizi_connect_user_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('feed');

  // Current User state
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CURRENT_USER;
  });

  // Profiles list
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_DISCOVERY_USERS);

  // V2.0 Content & Community States
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [reels, setReels] = useState<Reel[]>(MOCK_REELS);
  const [groups, setGroups] = useState<CommunityGroup[]>(MOCK_COMMUNITIES);
  const [businesses, setBusinesses] = useState<BusinessPage[]>(MOCK_BUSINESS_PAGES);
  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_EVENTS);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Matches list
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 'match-amani',
      userId: 'user-amani',
      matchedAt: '10:12 AM',
      compatibilityScore: 94,
      lastInteraction: 'Just now',
    },
    {
      id: 'match-zuri',
      userId: 'user-zuri',
      matchedAt: 'Yesterday',
      compatibilityScore: 89,
    },
    {
      id: 'match-elena',
      userId: 'user-elena',
      matchedAt: '2 days ago',
      compatibilityScore: 81,
    },
  ]);

  // Conversations dictionary
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>('user-amani');

  // Call sessions & Incoming call state
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<{
    caller: UserProfile;
    type: 'voice' | 'video';
  } | null>(null);

  // Modals state
  const [celebrationMatch, setCelebrationMatch] = useState<{
    profile: UserProfile;
    score: number;
  } | null>(null);
  const [inspectProfile, setInspectProfile] = useState<{
    profile: UserProfile;
    score: number;
  } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptionNotice, setSubscriptionNotice] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [reportingUser, setReportingUser] = useState<UserProfile | null>(null);

  const handleRequireSubscription = (message?: string) => {
    setSubscriptionNotice(message);
    setIsSubscriptionOpen(true);
  };

  const handleActivateVIP = (plan: 'daily' | 'monthly' | 'founder') => {
    setCurrentUser((prev) => ({
      ...prev,
      isSubscribed: true,
      subscriptionPlan: plan,
    }));
  };

  const handleDowngradeToFree = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isSubscribed: false,
      subscriptionPlan: 'free',
    }));
  };

  // Moderation Reports Queue
  const [reports, setReports] = useState<ReportTicket[]>([
    {
      id: 'rep-1',
      reportedUserId: 'user-kwame',
      reportedUserNickname: 'Kwame',
      reporterId: 'user-amani',
      reason: 'Spam',
      details: 'Sending unsolicited external promotion links in chat.',
      status: 'pending',
      createdAt: '2 hours ago',
    },
  ]);

  // Persist current user
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Count unread messages
  const unreadCount = Object.values(conversations).reduce((acc, msgs) => {
    return acc + msgs.filter((m) => !m.read && m.senderId !== 'me').length;
  }, 0);

  // Filtered active profiles
  const activeProfiles = profiles.filter(
    (p) => !currentUser.blockedUserIds.includes(p.id)
  );

  const blockedUsersList = profiles.filter((p) =>
    currentUser.blockedUserIds.includes(p.id)
  );

  // --- V2.0 SOCIAL FEED ACTIONS ---
  const handleLikePost = (postId: string) => {
    playPopSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (content: string, imageUrl?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      content,
      mediaUrls: imageUrl ? [imageUrl] : [],
      mediaType: 'image',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: 'Just now',
      tags: ['MiziziLife', 'Updates'],
      location: currentUser.approxLocation,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleToggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          return {
            ...g,
            isJoined: nextJoined,
            membersCount: nextJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  const handleToggleAttendEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextAttending = !ev.isAttending;
          return {
            ...ev,
            isAttending: nextAttending,
            attendeesCount: nextAttending ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      })
    );
  };

  const handleToggleFollowBusiness = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          const nextFollow = !b.isFollowing;
          return {
            ...b,
            isFollowing: nextFollow,
            followersCount: nextFollow ? b.followersCount + 1 : b.followersCount - 1,
          };
        }
        return b;
      })
    );
  };

  const handleReplyToStory = (authorId: string, replyText: string) => {
    handleSendMessage(authorId, replyText);
    setActiveParticipantId(authorId);
    setActiveTab('chat');
  };

  // --- BIBO DISCOVERY & MATCHING ACTIONS ---
  const handleLike = (profile: UserProfile, score: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      likedUserIds: [...prev.likedUserIds, profile.id],
    }));

    const newMatch: Match = {
      id: `match-${profile.id}`,
      userId: profile.id,
      matchedAt: 'Just now',
      compatibilityScore: score,
    };

    setMatches((prev) => [newMatch, ...prev.filter((m) => m.userId !== profile.id)]);
    setCelebrationMatch({ profile, score });

    if (!conversations[profile.id]) {
      setConversations((prev) => ({
        ...prev,
        [profile.id]: [
          {
            id: `msg-${Date.now()}`,
            conversationId: profile.id,
            senderId: profile.id,
            text: `Habari! I noticed we have a ${score}% compatibility match on Mizizi! Excited to connect.`,
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
            reactions: [{ emoji: '🔥', count: 1, byMe: false }],
            translatedText: `Hello! I noticed we have a ${score}% compatibility match on Mizizi! Excited to connect.`,
            targetLang: 'English',
            isTranslated: false,
          },
        ],
      }));
    }
  };

  const handleSkip = (profile: UserProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      skippedUserIds: [...prev.skippedUserIds, profile.id],
    }));
  };

  const handleSuperConnect = (profile: UserProfile, score: number) => {
    handleLike(profile, Math.min(score + 5, 99));
  };

  // --- CHAT & MESSAGING ACTIONS ---
  const handleSendMessage = (participantId: string, text: string, type: 'text' | 'voice' = 'text') => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: participantId,
      senderId: 'me',
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      reactions: [],
      translatedText: text.startsWith('Habari') ? 'Hello! How are you doing?' : undefined,
    };

    setConversations((prev) => ({
      ...prev,
      [participantId]: [...(prev[participantId] || []), newMsg],
    }));

    // Simulated reply
    const participant = profiles.find((p) => p.id === participantId);
    if (participant) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          conversationId: participantId,
          senderId: participantId,
          text: `Thanks for messaging! Love connecting with fellow minds on MIZIZI ✨`,
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
          reactions: [{ emoji: '❤️', count: 1, byMe: false }],
          translatedText: 'Asante kwa ujumbe wako! Napenda kuungana na watu wenye maono sawa hapa MIZIZI ✨',
          targetLang: 'Swahili',
          isTranslated: false,
        };

        setConversations((prev) => ({
          ...prev,
          [participantId]: [...(prev[participantId] || []), replyMsg],
        }));
        playNotificationChime();
      }, 1800);
    }
  };

  // --- CALLS ---
  const handleStartVoiceCall = (participant: UserProfile) => {
    setActiveCall({
      id: `call-${Date.now()}`,
      participant,
      type: 'voice',
      status: 'connected',
      startedAt: Date.now(),
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: true,
      isSpeakerOn: true,
    });
  };

  const handleStartVideoCall = (participant: UserProfile) => {
    setActiveCall({
      id: `call-${Date.now()}`,
      participant,
      type: 'video',
      status: 'connected',
      startedAt: Date.now(),
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
    });
  };

  // --- SAFETY & MODERATION ---
  const handleInitiateReport = (participant: UserProfile) => {
    setReportingUser(participant);
    setIsPrivacyOpen(true);
  };

  const handleSubmitReport = (userId: string, reason: string, details: string) => {
    const reported = profiles.find((p) => p.id === userId);
    const newReport: ReportTicket = {
      id: `rep-${Date.now()}`,
      reportedUserId: userId,
      reportedUserNickname: reported ? reported.nickname : 'User',
      reporterId: 'me',
      reason,
      details,
      status: 'pending',
      createdAt: 'Just now',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const handleBlockUser = (participant: UserProfile) => {
    playPopSound();
    setCurrentUser((prev) => ({
      ...prev,
      blockedUserIds: [...prev.blockedUserIds, participant.id],
    }));
    if (activeParticipantId === participant.id) {
      setActiveParticipantId(null);
    }
  };

  const handleUnblockUser = (userId: string) => {
    playPopSound();
    setCurrentUser((prev) => ({
      ...prev,
      blockedUserIds: prev.blockedUserIds.filter((id) => id !== userId),
    }));
  };

  const handleResolveReport = (reportId: string, action: 'ban' | 'warn' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === 'dismiss' ? 'dismissed' : 'resolved',
            }
          : r
      )
    );
  };

  const handleToggleVerification = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, verified: !p.verified } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Universal Master Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadMessagesCount={unreadCount}
        matchesCount={matches.length}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSubscription={() => {
          setSubscriptionNotice(undefined);
          setIsSubscriptionOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onUpdateStatus={(status) => setCurrentUser({ ...currentUser, onlineStatus: status })}
      />

      {/* Main Tab Content Views */}
      <div className="flex-1">
        {/* 1. SOCIAL HOME FEED (Instagram/Facebook Feed & 24h Stories) */}
        {activeTab === 'feed' && (
          <HomeFeed
            currentUser={currentUser}
            stories={stories}
            posts={posts}
            onOpenStory={(idx) => setActiveStoryIndex(idx)}
            onOpenChat={(id) => {
              setActiveParticipantId(id);
              setActiveTab('chat');
            }}
            onViewProfile={(profile) => {
              const score = calculateCompatibilityScore(currentUser, profile);
              setInspectProfile({ profile, score });
            }}
            onLikePost={handleLikePost}
            onCreatePost={handleCreatePost}
            onNavigateToCommunities={() => setActiveTab('communities')}
            onRequireSubscription={handleRequireSubscription}
          />
        )}

        {/* 2. REELS (Short Vertical Video Player) */}
        {activeTab === 'reels' && (
          <ReelsView
            reels={reels}
            currentUser={currentUser}
            onOpenChat={(id) => {
              setActiveParticipantId(id);
              setActiveTab('chat');
            }}
            onLikeReel={handleLikeReel}
            onViewProfile={(profile) => {
              const score = calculateCompatibilityScore(currentUser, profile);
              setInspectProfile({ profile, score });
            }}
          />
        )}

        {/* 3. BIBO PEOPLE DISCOVERY (Matching & Compatibility) */}
        {activeTab === 'discover' && (
          <DiscoveryView
            currentUser={currentUser}
            profiles={activeProfiles}
            onLike={handleLike}
            onSkip={handleSkip}
            onSuperConnect={handleSuperConnect}
            onViewProfile={(profile, score) => setInspectProfile({ profile, score })}
            onResetDeck={() => {
              setCurrentUser((prev) => ({
                ...prev,
                likedUserIds: [],
                skippedUserIds: [],
              }));
            }}
            onRequireSubscription={handleRequireSubscription}
          />
        )}

        {/* 4. CHAT SYSTEM (1-to-1 Conversations, Live Translation, Calls) */}
        {activeTab === 'chat' && (
          <ChatSystem
            currentUser={currentUser}
            matches={matches}
            profiles={profiles}
            conversations={conversations}
            activeParticipantId={activeParticipantId}
            onSelectParticipant={(id) => setActiveParticipantId(id)}
            onSendMessage={handleSendMessage}
            onStartVoiceCall={handleStartVoiceCall}
            onStartVideoCall={handleStartVideoCall}
            onReportUser={handleInitiateReport}
            onBlockUser={handleBlockUser}
            onViewProfile={(profile, score) => setInspectProfile({ profile, score })}
            onRequireSubscription={handleRequireSubscription}
          />
        )}

        {/* 5. COMMUNITIES & GROUPS (Facebook Groups & Events) */}
        {activeTab === 'communities' && (
          <CommunitiesView
            groups={groups}
            events={events}
            onToggleJoinGroup={handleToggleJoinGroup}
            onToggleAttendEvent={handleToggleAttendEvent}
            onOpenGroupChat={(groupName) => {
              setActiveParticipantId('user-amani');
              setActiveTab('chat');
            }}
          />
        )}

        {/* 6. BUSINESS & CREATOR PAGES (Pages & Product Catalog) */}
        {activeTab === 'business' && (
          <BusinessHubView
            businesses={businesses}
            onOpenChat={(bizName) => {
              setActiveParticipantId('user-amani');
              setActiveTab('chat');
            }}
            onToggleFollowBusiness={handleToggleFollowBusiness}
          />
        )}

        {/* 7. GLOBAL SEARCH */}
        {activeTab === 'search' && (
          <SearchExplore
            currentUser={currentUser}
            profiles={activeProfiles}
            onLike={handleLike}
            onOpenChat={(id) => {
              setActiveParticipantId(id);
              setActiveTab('chat');
            }}
            onViewProfile={(profile, score) => setInspectProfile({ profile, score })}
          />
        )}

        {/* 8. SAFETY & ADMIN CONSOLE */}
        {activeTab === 'admin' && (
          <div className="py-6">
            <AdminModerationModal
              isOpen={true}
              onClose={() => setActiveTab('feed')}
              users={profiles}
              reports={reports}
              onResolveReport={handleResolveReport}
              onToggleUserVerification={handleToggleVerification}
            />
          </div>
        )}

        {/* 9. USER PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-[#0e0e13] border border-red-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.nickname}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-red-500 shadow-xl"
                />
                <div>
                  <h2 className="text-2xl font-black text-white">{currentUser.nickname}, {currentUser.age}</h2>
                  <p className="text-xs text-red-400">{currentUser.approxLocation} · {currentUser.occupation}</p>
                  <p className="text-xs text-zinc-400 mt-1">{currentUser.email}</p>
                </div>
              </div>

              {/* VIP & BILLIONAIRE CLUB SUBSCRIPTION STATUS CARD */}
              <div className={`p-4 rounded-2xl border transition-all ${
                currentUser.isSubscribed
                  ? 'bg-gradient-to-r from-amber-950/60 via-red-950/60 to-black border-amber-500/80 shadow-lg shadow-amber-950/40'
                  : 'bg-gradient-to-r from-red-950/60 via-black to-zinc-950 border-red-800/60'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentUser.isSubscribed
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      <span className="text-lg">{currentUser.isSubscribed ? '👑' : '👁️'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {currentUser.isSubscribed ? 'MIZIZI VIP & Billionaire Club Member' : 'Free Preview Mode'}
                        </h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          currentUser.isSubscribed
                            ? 'bg-amber-400 text-black font-extrabold'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {currentUser.isSubscribed ? (currentUser.subscriptionPlan || 'VIP Active') : 'Free'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {currentUser.isSubscribed
                          ? 'Unlimited 1-to-1 WebRTC video calls, voice notes, live translation & unlimited matching unlocked.'
                          : 'You can explore and preview everything! Subscribe to like, match, chat & start video calls.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {currentUser.isSubscribed ? (
                      <>
                        <button
                          onClick={() => {
                            setSubscriptionNotice(undefined);
                            setIsSubscriptionOpen(true);
                          }}
                          className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer shadow-md transition-all"
                        >
                          Manage VIP
                        </button>
                        <button
                          onClick={handleDowngradeToFree}
                          className="px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-semibold cursor-pointer"
                          title="Switch to Free Preview to test paywalls"
                        >
                          Test Free Mode
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSubscriptionNotice(undefined);
                          setIsSubscriptionOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>👑</span>
                        <span>Subscribe VIP Pass</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-red-400 uppercase tracking-wider block">Bio</span>
                <p className="text-zinc-300 bg-[#14141c] p-3 rounded-xl border border-red-950">
                  "{currentUser.bio}"
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-red-400 uppercase tracking-wider block">My Interests</span>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-red-950/80 text-red-200 border border-red-800 font-medium">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-red-400 uppercase tracking-wider block">My Relationship Goals</span>
                <p className="text-zinc-300">{currentUser.goals.join(' · ')}</p>
              </div>

              <div className="pt-4 border-t border-red-950 flex flex-wrap gap-2.5">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer shadow-lg shadow-red-950"
                >
                  Edit Profile & Preferences
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer border border-red-950 flex items-center gap-1.5"
                >
                  <span>+ Create / Switch Account</span>
                </button>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer border border-zinc-700"
                >
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 24-HOUR STORY VIEWER MODAL */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onReplyToStory={handleReplyToStory}
        />
      )}

      {/* WebRTC Voice & Video Call Active Modal */}
      {activeCall && (
        <CallModal
          callSession={activeCall}
          onEndCall={() => setActiveCall(null)}
          onReportUser={handleInitiateReport}
        />
      )}

      {/* Incoming Call Notification Pop-up Banner */}
      {incomingCall && (
        <IncomingCallBanner
          caller={incomingCall.caller}
          callType={incomingCall.type}
          onAccept={() => {
            if (incomingCall.type === 'video') {
              handleStartVideoCall(incomingCall.caller);
            } else {
              handleStartVoiceCall(incomingCall.caller);
            }
            setIncomingCall(null);
          }}
          onReject={() => setIncomingCall(null)}
        />
      )}

      {/* Mutual Match Celebration Modal */}
      {celebrationMatch && (
        <MatchCelebrationModal
          currentUser={currentUser}
          matchedProfile={celebrationMatch.profile}
          compatibilityScore={celebrationMatch.score}
          onOpenChat={(userId) => {
            setActiveParticipantId(userId);
            setActiveTab('chat');
          }}
          onStartVideoCall={handleStartVideoCall}
          onClose={() => setCelebrationMatch(null)}
        />
      )}

      {/* Full User Profile Inspector Modal */}
      {inspectProfile && (
        <UserProfileModal
          profile={inspectProfile.profile}
          compatibilityScore={inspectProfile.score}
          currentUser={currentUser}
          onClose={() => setInspectProfile(null)}
          onLike={(p, sc) => {
            handleLike(p, sc);
            setInspectProfile(null);
          }}
          onOpenChat={(id) => {
            setActiveParticipantId(id);
            setActiveTab('chat');
            setInspectProfile(null);
          }}
          onStartVoiceCall={(p) => {
            handleStartVoiceCall(p);
            setInspectProfile(null);
          }}
          onStartVideoCall={(p) => {
            handleStartVideoCall(p);
            setInspectProfile(null);
          }}
          onReportUser={handleInitiateReport}
          onBlockUser={handleBlockUser}
          onRequireSubscription={handleRequireSubscription}
        />
      )}

      {/* Safety & Privacy Settings Modal */}
      <SafetyPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => {
          setIsPrivacyOpen(false);
          setReportingUser(null);
        }}
        currentUser={currentUser}
        onUpdatePrivacy={(priv) => setCurrentUser({ ...currentUser, privacy: priv })}
        blockedUsers={blockedUsersList}
        onUnblockUser={handleUnblockUser}
        reportingUser={reportingUser}
        onSubmitReport={handleSubmitReport}
        onCloseReport={() => setReportingUser(null)}
      />

      {/* Onboarding / Profile Edit Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(up) => setCurrentUser(up)}
        isInitialOnboarding={false}
      />

      {/* Subscription Paywall & Billionaire Club Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => {
          setIsSubscriptionOpen(false);
          setSubscriptionNotice(undefined);
        }}
        onActivateVIP={handleActivateVIP}
        onDowngradeToFree={handleDowngradeToFree}
        isCurrentlySubscribed={!!currentUser.isSubscribed}
        featureLockedMessage={subscriptionNotice}
      />

      {/* Account Registration & Switching Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(newUser) => {
          setCurrentUser(newUser);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
