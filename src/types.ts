export type Gender = 'male' | 'female' | 'non-binary' | 'all';

export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy' | 'in_call';

export type RelationshipGoal =
  | 'Make friends'
  | 'Meet new people'
  | 'Find a relationship'
  | 'Practice languages'
  | 'Find people with similar interests'
  | 'Casual conversation';

export interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  country: string;
  approxLocation: string;
  avatarUrl: string;
  photos: string[];
  bio: string;
  interests: string[];
  languages: string[];
  goals: RelationshipGoal[];
  personality: 'Introvert' | 'Ambivert' | 'Extrovert';
  onlineStatus: OnlineStatus;
  verified: boolean;
  voiceIntroSeconds?: number;
  occupation?: string;
  compatibilityScore?: number;
}

export interface CurrentUser extends UserProfile {
  email: string;
  phone?: string;
  dateOfBirth: string;
  preferences: {
    minAge: number;
    maxAge: number;
    interestedIn: Gender;
    countries: string[];
    languages: string[];
  };
  privacy: {
    showOnlineStatus: boolean;
    showLocation: boolean;
    allowCallsFrom: 'matches_only' | 'everyone' | 'nobody';
    discoverable: boolean;
  };
  likedUserIds: string[];
  skippedUserIds: string[];
  blockedUserIds: string[];
}

export interface Match {
  id: string;
  userId: string;
  matchedAt: string;
  compatibilityScore: number;
  lastInteraction?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  byMe: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  type: 'text' | 'voice' | 'image' | 'call_log';
  mediaUrl?: string;
  audioDuration?: string;
  timestamp: string;
  read: boolean;
  reactions: MessageReaction[];
  translatedText?: string;
  targetLang?: string;
  isTranslated?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface CallSession {
  id: string;
  participant: UserProfile;
  type: 'voice' | 'video';
  status: 'calling' | 'ringing' | 'connected' | 'ended';
  startedAt?: number;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
}

export interface ReportTicket {
  id: string;
  reportedUserId: string;
  reportedUserNickname: string;
  reporterId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}
