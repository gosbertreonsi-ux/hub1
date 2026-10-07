import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoveryView } from './components/DiscoveryView';
import { ChatSystem } from './components/ChatSystem';
import { SearchExplore } from './components/SearchExplore';
import { CallModal } from './components/CallModal';
import { IncomingCallBanner } from './components/IncomingCallBanner';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { SafetyPrivacyModal } from './components/SafetyPrivacyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { 
  UserProfile, 
  CurrentUser, 
  ChatMessage, 
  Match, 
  CallSession, 
  ReportTicket,
  OnlineStatus 
} from './types';
import { 
  INITIAL_CURRENT_USER, 
  MOCK_DISCOVERY_USERS, 
  INITIAL_CHAT_MESSAGES,
  calculateCompatibilityScore 
} from './data/mockData';
import { playNotificationChime, playPopSound } from './utils/audio';

const STORAGE_KEY = 'mizizi_connect_user_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'chat' | 'search' | 'admin' | 'profile'>('discover');

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
  const [reportingUser, setReportingUser] = useState<UserProfile | null>(null);

  // Moderation Reports Queue (PRD §26-28)
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

  // Blocked profiles filter
  const activeProfiles = profiles.filter(
    (p) => !currentUser.blockedUserIds.includes(p.id)
  );

  // Blocked users objects
  const blockedUsersList = profiles.filter((p) =>
    currentUser.blockedUserIds.includes(p.id)
  );

  // LIKE ACTION
  const handleLike = (profile: UserProfile, score: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      likedUserIds: [...prev.likedUserIds, profile.id],
    }));

    // Trigger mutual match
    const newMatch: Match = {
      id: `match-${profile.id}`,
      userId: profile.id,
      matchedAt: 'Just now',
      compatibilityScore: score,
    };

    setMatches((prev) => [newMatch, ...prev.filter((m) => m.userId !== profile.id)]);
    setCelebrationMatch({ profile, score });

    // Seed conversation with friendly greeting if empty
    if (!conversations[profile.id]) {
      setConversations((prev) => ({
        ...prev,
        [profile.id]: [
          {
            id: `msg-${Date.now()}`,
            conversationId: profile.id,
            senderId: profile.id,
            text: `Habari! I noticed we have a ${score}% compatibility match! Excited to connect.`,
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
            reactions: [{ emoji: '🔥', count: 1, byMe: false }],
            translatedText: `Hello! I noticed we have a ${score}% compatibility match! Excited to connect.`,
            targetLang: 'English',
            isTranslated: false,
          },
        ],
      }));
    }
  };

  // SKIP ACTION
  const handleSkip = (profile: UserProfile) => {
    setCurrentUser((prev) => ({
      ...prev,
      skippedUserIds: [...prev.skippedUserIds, profile.id],
    }));
  };

  // SUPER CONNECT ACTION
  const handleSuperConnect = (profile: UserProfile, score: number) => {
    handleLike(profile, Math.min(score + 5, 99));
  };

  // SEND MESSAGE
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

    // Simulate reply from the participant after 2 seconds
    const participant = profiles.find((p) => p.id === participantId);
    if (participant) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          conversationId: participantId,
          senderId: participantId,
          text: `Thanks for messaging! Always love connecting with fellow minds on Mizizi Connect ✨`,
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
          reactions: [{ emoji: '❤️', count: 1, byMe: false }],
          translatedText: 'Asante kwa kunitumia ujumbe! Mara zote napenda kuungana na watu wenye maono sawa hapa Mizizi Connect ✨',
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

  // VOICE CALL
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

  // VIDEO CALL
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

  // REPORT USER
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

  // BLOCK USER
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

  // RESOLVE REPORT (Admin)
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

  // VERIFY USER TOGGLE (Admin)
  const handleToggleVerification = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, verified: !p.verified } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadMessagesCount={unreadCount}
        matchesCount={matches.length}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onUpdateStatus={(status) => setCurrentUser({ ...currentUser, onlineStatus: status })}
      />

      {/* Main Tab Views (Discover, Chat & Calls, Search, Admin, Profile) */}
      <div className="flex-1">
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
          />
        )}

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
          />
        )}

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

        {activeTab === 'admin' && (
          <div className="py-6">
            <AdminModerationModal
              isOpen={true}
              onClose={() => setActiveTab('discover')}
              users={profiles}
              reports={reports}
              onResolveReport={handleResolveReport}
              onToggleUserVerification={handleToggleVerification}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-[#0e0e13] border border-red-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
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

              <div className="pt-4 border-t border-red-950 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer shadow-lg shadow-red-950"
                >
                  Edit Profile & Preferences
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
    </div>
  );
}
