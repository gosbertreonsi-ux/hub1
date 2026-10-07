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
  isSubscribed?: boolean;
  subscriptionPlan?: 'free' | 'daily' | 'monthly' | 'founder';
  subscriptionExpiresAt?: number | null;
  isGuest?: boolean;
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

/* =========================================================================
   MIZIZI V2.0 MASTER UNIFIED SOCIAL & COMMUNITY TYPES (PRD V2.0)
   ========================================================================= */

export interface PostComment {
  id: string;
  author: UserProfile;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  mediaUrls: string[];
  mediaType?: 'image' | 'video';
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  comments?: PostComment[];
  sharesCount: number;
  createdAt: string;
  tags?: string[];
  location?: string;
  communityName?: string;
}

export interface Story {
  id: string;
  author: UserProfile;
  mediaUrl: string;
  type: 'image' | 'video' | 'text';
  caption?: string;
  createdAt: string;
  viewed?: boolean;
}

export interface Reel {
  id: string;
  creator: UserProfile;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  musicTitle: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  tags: string[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  bannerUrl: string;
  description: string;
  membersCount: number;
  isJoined: boolean;
  postsCount: number;
  tags: string[];
  rules: string[];
  recentDiscussion?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
}

export interface BusinessPage {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  location: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  followersCount: number;
  isFollowing: boolean;
  products: ProductItem[];
  whatsappContact?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  isAttending: boolean;
  imageUrl: string;
  category: string;
}

