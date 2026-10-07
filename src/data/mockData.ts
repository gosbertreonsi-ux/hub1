import { UserProfile, CurrentUser, ChatMessage, RelationshipGoal } from '../types';

export const ALL_INTERESTS: { name: string; category: string }[] = [
  { name: 'Technology', category: 'STEM' },
  { name: 'Music', category: 'Creative' },
  { name: 'Football', category: 'Sports' },
  { name: 'Gaming', category: 'Recreation' },
  { name: 'Travel', category: 'Lifestyle' },
  { name: 'Business', category: 'Career' },
  { name: 'Art', category: 'Creative' },
  { name: 'Fitness', category: 'Health' },
  { name: 'Fashion', category: 'Lifestyle' },
  { name: 'Movies', category: 'Entertainment' },
  { name: 'Science', category: 'STEM' },
  { name: 'Books', category: 'Culture' },
  { name: 'Spirituality', category: 'Philosophy' },
  { name: 'Entrepreneurship', category: 'Career' },
  { name: 'Photography', category: 'Creative' },
  { name: 'Cooking', category: 'Lifestyle' },
];

export const ALL_GOALS: RelationshipGoal[] = [
  'Make friends',
  'Meet new people',
  'Find a relationship',
  'Practice languages',
  'Find people with similar interests',
  'Casual conversation',
];

export const ALL_LANGUAGES = [
  'English',
  'Swahili',
  'French',
  'Spanish',
  'Arabic',
  'Portuguese',
  'German',
  'Hindi',
  'Japanese',
];

export const INITIAL_CURRENT_USER: CurrentUser = {
  id: 'me',
  nickname: 'Baraka',
  age: 25,
  gender: 'male',
  country: 'Tanzania',
  approxLocation: 'Dar es Salaam, Tanzania',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  ],
  bio: 'Software engineer & tech enthusiast. Love deep conversations about startups, travel, and acoustic Afro-jazz.',
  interests: ['Technology', 'Music', 'Travel', 'Business', 'Photography'],
  languages: ['Swahili', 'English'],
  goals: ['Make friends', 'Meet new people', 'Find people with similar interests'],
  personality: 'Ambivert',
  onlineStatus: 'online',
  verified: true,
  voiceIntroSeconds: 15,
  occupation: 'Full-stack Developer',
  email: 'baraka@miziziconnect.io',
  phone: '+255 712 998 001',
  dateOfBirth: '2001-04-12',
  preferences: {
    minAge: 20,
    maxAge: 32,
    interestedIn: 'all',
    countries: ['Tanzania', 'Kenya', 'Nigeria', 'South Africa', 'United Kingdom', 'USA'],
    languages: ['Swahili', 'English', 'French'],
  },
  privacy: {
    showOnlineStatus: true,
    showLocation: true,
    allowCallsFrom: 'matches_only',
    discoverable: true,
  },
  likedUserIds: ['user-amani', 'user-zuri'],
  skippedUserIds: [],
  blockedUserIds: [],
};

export const MOCK_DISCOVERY_USERS: UserProfile[] = [
  {
    id: 'user-amani',
    nickname: 'Amani',
    age: 24,
    gender: 'female',
    country: 'Tanzania',
    approxLocation: 'Zanzibar, Tanzania',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Product designer & ocean enthusiast. Learning French, building digital products, and hunting for the best street food in Stonetown.',
    interests: ['Technology', 'Music', 'Travel', 'Business', 'Art'],
    languages: ['Swahili', 'English', 'French'],
    goals: ['Make friends', 'Find people with similar interests', 'Practice languages'],
    personality: 'Ambivert',
    onlineStatus: 'online',
    verified: true,
    voiceIntroSeconds: 18,
    occupation: 'UX/UI Designer',
  },
  {
    id: 'user-zuri',
    nickname: 'Zuri',
    age: 23,
    gender: 'female',
    country: 'Kenya',
    approxLocation: 'Nairobi, Kenya',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Tech founder in fintech. Avid gamer, traveler, and podcast junkie. Looking for genuine minds to talk life and big visions.',
    interests: ['Technology', 'Gaming', 'Entrepreneurship', 'Travel', 'Music'],
    languages: ['English', 'Swahili'],
    goals: ['Meet new people', 'Find a relationship', 'Make friends'],
    personality: 'Extrovert',
    onlineStatus: 'online',
    verified: true,
    voiceIntroSeconds: 22,
    occupation: 'Fintech Founder',
  },
  {
    id: 'user-chidi',
    nickname: 'Chidi',
    age: 26,
    gender: 'male',
    country: 'Nigeria',
    approxLocation: 'Lagos, Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Music producer & filmmaker. Afrobeats, cinematic soundscapes, and photography. Let us connect and exchange cultural vibes.',
    interests: ['Music', 'Photography', 'Art', 'Travel', 'Movies'],
    languages: ['English', 'French'],
    goals: ['Make friends', 'Casual conversation', 'Practice languages'],
    personality: 'Ambivert',
    onlineStatus: 'away',
    verified: true,
    voiceIntroSeconds: 25,
    occupation: 'Sound Engineer & Producer',
  },
  {
    id: 'user-elena',
    nickname: 'Elena',
    age: 25,
    gender: 'female',
    country: 'France',
    approxLocation: 'Paris, France',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Architect, coffee lover, and bookworm. Learning Swahili before my safari next summer! Salut tout le monde.',
    interests: ['Books', 'Art', 'Travel', 'Cooking', 'Technology'],
    languages: ['French', 'English', 'Swahili'],
    goals: ['Practice languages', 'Make friends', 'Meet new people'],
    personality: 'Introvert',
    onlineStatus: 'online',
    verified: true,
    voiceIntroSeconds: 14,
    occupation: 'Architect',
  },
  {
    id: 'user-kwame',
    nickname: 'Kwame',
    age: 27,
    gender: 'male',
    country: 'Ghana',
    approxLocation: 'Accra, Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Software architect, runner, and high-altitude hiker. Always down for late night deep chats about technology and philosophy.',
    interests: ['Technology', 'Fitness', 'Science', 'Books', 'Football'],
    languages: ['English'],
    goals: ['Find people with similar interests', 'Make friends'],
    personality: 'Introvert',
    onlineStatus: 'offline',
    verified: false,
    voiceIntroSeconds: 20,
    occupation: 'Cloud Engineer',
  },
  {
    id: 'user-layla',
    nickname: 'Layla',
    age: 24,
    gender: 'female',
    country: 'Egypt',
    approxLocation: 'Cairo, Egypt',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ],
    bio: 'Astrophotography & ancient history. Passionate about exploring untouched landscapes and coding AI tools.',
    interests: ['Science', 'Photography', 'Technology', 'Travel'],
    languages: ['Arabic', 'English'],
    goals: ['Make friends', 'Practice languages'],
    personality: 'Ambivert',
    onlineStatus: 'online',
    verified: true,
    voiceIntroSeconds: 19,
    occupation: 'Data Scientist',
  },
];

/** PRD §11 Rule-based Compatibility Scoring Algorithm */
export function calculateCompatibilityScore(userA: CurrentUser, userB: UserProfile): number {
  // 1. Interest match (40%)
  const sharedInterests = userA.interests.filter((i) => userB.interests.includes(i));
  const maxInterests = Math.max(userA.interests.length, userB.interests.length, 1);
  const interestScore = (sharedInterests.length / maxInterests) * 40;

  // 2. Goal compatibility (20%)
  const sharedGoals = userA.goals.filter((g) => userB.goals.includes(g));
  const maxGoals = Math.max(userA.goals.length, userB.goals.length, 1);
  const goalScore = (sharedGoals.length / maxGoals) * 20;

  // 3. Language compatibility (15%)
  const sharedLanguages = userA.languages.filter((l) => userB.languages.includes(l));
  const languageScore = sharedLanguages.length > 0 ? 15 : 5;

  // 4. Age preference (10%)
  const withinAgeRange =
    userB.age >= userA.preferences.minAge && userB.age <= userA.preferences.maxAge;
  const ageScore = withinAgeRange ? 10 : 3;

  // 5. Location preference (10%)
  const locationMatches =
    userA.country.toLowerCase() === userB.country.toLowerCase() ||
    userA.preferences.countries.some((c) => c.toLowerCase() === userB.country.toLowerCase());
  const locationScore = locationMatches ? 10 : 4;

  // 6. Personality / Activity (5%)
  const personalityScore = userA.personality === userB.personality ? 5 : 3;

  const total = Math.round(
    interestScore + goalScore + languageScore + ageScore + locationScore + personalityScore
  );
  return Math.min(Math.max(total, 55), 98);
}

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'user-amani': [
    {
      id: 'm1',
      conversationId: 'user-amani',
      senderId: 'user-amani',
      text: 'Habari Baraka! Nimefurahi sana kuona umepata compatibility score ya 94% nasi! 🌊',
      type: 'text',
      timestamp: '10:14',
      read: true,
      reactions: [{ emoji: '❤️', count: 1, byMe: true }],
      translatedText: 'Hello Baraka! I am so glad to see we got a 94% compatibility score! 🌊',
      targetLang: 'English',
      isTranslated: false,
    },
    {
      id: 'm2',
      conversationId: 'user-amani',
      senderId: 'me',
      text: 'Habari Amani! Niliona unapenda tech, photography na Zanzibar street food. Ni combo safi sana!',
      type: 'text',
      timestamp: '10:16',
      read: true,
      reactions: [{ emoji: '🔥', count: 1, byMe: false }],
      translatedText: 'Hello Amani! I saw you love tech, photography and Zanzibar street food. That is a great combo!',
      targetLang: 'English',
      isTranslated: false,
    },
    {
      id: 'm3',
      conversationId: 'user-amani',
      senderId: 'user-amani',
      text: 'Haha asante! Hapa nilipo Forodhani nina design app mpya. Je, unajaribu voice au video call tusalimiane?',
      type: 'text',
      timestamp: '10:18',
      read: true,
      reactions: [],
      translatedText: 'Haha thanks! Right here in Forodhani I am designing a new app. Would you like to try a voice or video call to say hi?',
      targetLang: 'English',
      isTranslated: false,
    },
  ],
  'user-zuri': [
    {
      id: 'z1',
      conversationId: 'user-zuri',
      senderId: 'user-zuri',
      text: 'Hey Baraka! Great to connect. Fellow tech founder here in Nairobi. How is Dar es Salaam tech scene treating you?',
      type: 'text',
      timestamp: 'Yesterday',
      read: true,
      reactions: [{ emoji: '👋', count: 1, byMe: true }],
      translatedText: 'Habari Baraka! Nimefurahi kuungana nawe. Mimi pia ni mwanzilishi wa teknolojia hapa Nairobi. Vipi hali ya teknolojia Dar es Salaam?',
      targetLang: 'Swahili',
      isTranslated: false,
    },
    {
      id: 'z2',
      conversationId: 'user-zuri',
      senderId: 'me',
      text: 'Dar is booming right now! We should definitely bounce some startup ideas.',
      type: 'text',
      timestamp: 'Yesterday',
      read: true,
      reactions: [],
    },
  ],
  'user-elena': [
    {
      id: 'e1',
      conversationId: 'user-elena',
      senderId: 'user-elena',
      text: 'Bonjour Baraka! J\'adore vos photos de la Tanzanie. J\'apprends le Swahili depuis trois mois.',
      type: 'text',
      timestamp: '2 days ago',
      read: true,
      reactions: [{ emoji: '✨', count: 1, byMe: true }],
      translatedText: 'Hello Baraka! I love your photos of Tanzania. I have been learning Swahili for three months.',
      targetLang: 'English',
      isTranslated: false,
    },
  ],
};

/** Quick mock dictionary for live translation */
export const TRANSLATION_MAP: Record<string, Record<string, string>> = {
  'habari': { English: 'hello / how are you', French: 'bonjour' },
  'asante': { English: 'thank you', French: 'merci' },
  'karibu': { English: 'welcome', French: 'bienvenue' },
};

/* =========================================================================
   MIZIZI V2.0 MOCK DATA: STORIES, POSTS, REELS, COMMUNITIES, BUSINESSES
   ========================================================================= */

import { Post, Story, Reel, CommunityGroup, BusinessPage, CommunityEvent } from '../types';

export const MOCK_STORIES: Story[] = [
  {
    id: 's-amani',
    author: MOCK_DISCOVERY_USERS[0], // Amani
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    caption: 'Sunset at Kendwa beach, Zanzibar 🌅✨ Coding with ocean breeze',
    createdAt: '2h ago',
  },
  {
    id: 's-zuri',
    author: MOCK_DISCOVERY_USERS[1], // Zuri
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    caption: 'Pitch day at Nairobi Innovation Hub! 🚀 Big announcement coming',
    createdAt: '4h ago',
  },
  {
    id: 's-chidi',
    author: MOCK_DISCOVERY_USERS[2], // Chidi
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    caption: 'Studio session: Mixing acoustic drums and deep bass lines 🎧',
    createdAt: '6h ago',
  },
  {
    id: 's-elena',
    author: MOCK_DISCOVERY_USERS[3], // Elena
    mediaUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    caption: 'Paris morning coffee & learning 20 new Swahili verbs ☕📖',
    createdAt: '8h ago',
  },
  {
    id: 's-layla',
    author: MOCK_DISCOVERY_USERS[5], // Layla
    mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    caption: 'Desert stargazing & telescope setup in Siwa Oasis 🌌🔭',
    createdAt: '11h ago',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    author: MOCK_DISCOVERY_USERS[0], // Amani
    content: 'Just launched our open-source Swahili design system for African creators! 🎨🚀 Believing in tools crafted by us, for us. Drop your thoughts below!',
    mediaUrls: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'
    ],
    mediaType: 'image',
    likesCount: 342,
    isLiked: false,
    commentsCount: 28,
    sharesCount: 15,
    createdAt: '3 hours ago',
    tags: ['Design', 'TechInAfrica', 'OpenSource', 'Zanzibar'],
    location: 'Zanzibar, Tanzania',
    communityName: 'Mizizi Tech & Designers',
    comments: [
      {
        id: 'c1',
        author: MOCK_DISCOVERY_USERS[1],
        content: 'Huge milestone Amani! Loving the typography hierarchy and color contrast 👏',
        createdAt: '2h ago',
        likesCount: 12,
      },
      {
        id: 'c2',
        author: MOCK_DISCOVERY_USERS[2],
        content: 'Can we integrate audio waveform components? Need this for music drops!',
        createdAt: '1h ago',
        likesCount: 5,
      }
    ]
  },
  {
    id: 'post-2',
    author: MOCK_DISCOVERY_USERS[1], // Zuri
    content: 'Connecting with people based on shared values hits differently than random scrolling. Yesterday matched with Baraka on Mizizi and had an inspiring 1-hour discussion on fintech rails across East Africa 🌍🤝',
    mediaUrls: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80'
    ],
    mediaType: 'image',
    likesCount: 512,
    isLiked: true,
    commentsCount: 44,
    sharesCount: 39,
    createdAt: '6 hours ago',
    tags: ['MiziziConnect', 'Networking', 'EastAfrica', 'Fintech'],
    location: 'Nairobi, Kenya',
  },
  {
    id: 'post-3',
    author: MOCK_DISCOVERY_USERS[2], // Chidi
    content: 'Live sound check in Lagos tonight! Combining Afro-percussion with ambient synthesizers. Streaming live snippet on Mizizi Reels in 10 mins 🥁✨',
    mediaUrls: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
    ],
    mediaType: 'image',
    likesCount: 890,
    isLiked: false,
    commentsCount: 67,
    sharesCount: 82,
    createdAt: '12 hours ago',
    tags: ['Music', 'Afrobeats', 'LiveMusic', 'Lagos'],
    location: 'Victoria Island, Lagos',
    communityName: 'Afro Beats & Producers Hub',
  },
];

export const MOCK_REELS: Reel[] = [
  {
    id: 'reel-1',
    creator: MOCK_DISCOVERY_USERS[0],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    caption: 'Morning in Stone Town: Coffee, ocean breeze, and building Mizizi interfaces 🌊☕ #ZanzibarLife #Design',
    musicTitle: 'Bongo Flava Chill Beats · Amani Audio',
    likesCount: 4210,
    isLiked: false,
    commentsCount: 184,
    sharesCount: 512,
    viewsCount: 38200,
    tags: ['Zanzibar', 'Travel', 'Tech'],
  },
  {
    id: 'reel-2',
    creator: MOCK_DISCOVERY_USERS[2],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    caption: 'How we record live talking drums for cinematic scores in Lagos 🥁🔥 Turn up the volume!',
    musicTitle: 'Lagos Night Pulse · Chidi Studio Master',
    likesCount: 8940,
    isLiked: true,
    commentsCount: 492,
    sharesCount: 1205,
    viewsCount: 94100,
    tags: ['Music', 'Drums', 'Afrobeats'],
  },
  {
    id: 'reel-3',
    creator: MOCK_DISCOVERY_USERS[1],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    caption: 'Top 3 mistakes first-time African tech founders make when pitching investors 💡📈 #StartupTips',
    musicTitle: 'Founders Focus · Nairobi Beats',
    likesCount: 3120,
    isLiked: false,
    commentsCount: 145,
    sharesCount: 410,
    viewsCount: 29400,
    tags: ['Startup', 'Business', 'Kenya'],
  },
];

export const MOCK_COMMUNITIES: CommunityGroup[] = [
  {
    id: 'comm-1',
    name: 'Dar es Salaam Developers & Techies',
    category: 'Technology & STEM',
    avatarUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    description: 'Community for coders, designers, AI practitioners and tech founders in Tanzania. Weekly code jams, mentorship, and career discussions.',
    membersCount: 4890,
    isJoined: true,
    postsCount: 314,
    tags: ['Software', 'React', 'TypeScript', 'AI', 'Startups'],
    rules: [
      'Be respectful and constructive',
      'Share knowledge, no spam or unsolicited ads',
      'English and Swahili both welcome'
    ],
    recentDiscussion: 'Baraka shared: "Best practices for WebRTC low latency calls across 4G networks"'
  },
  {
    id: 'comm-2',
    name: 'Afro Beats & Producers Collective',
    category: 'Creative & Music',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'A global collective connecting beatmakers, vocalists, audio engineers and songwriters exploring contemporary and acoustic African sounds.',
    membersCount: 8210,
    isJoined: false,
    postsCount: 620,
    tags: ['Production', 'Afrobeats', 'SoundDesign', 'Collaboration'],
    rules: ['Feedback must be actionable', 'Respect copyright and credit artists'],
  },
  {
    id: 'comm-3',
    name: 'East Africa Startup Founders Network',
    category: 'Business & Entrepreneurship',
    avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Peer-to-peer circle for founders raising pre-seed to Series A across Kenya, Tanzania, Rwanda, and Uganda.',
    membersCount: 2450,
    isJoined: true,
    postsCount: 198,
    tags: ['Ventures', 'Fundraising', 'Growth', 'Fintech'],
    rules: ['No self-promotion without value', 'Chatham House Rule on internal metrics'],
  },
  {
    id: 'comm-4',
    name: 'Swahili & Global Language Exchange',
    category: 'Culture & Education',
    avatarUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    description: 'Practice Kiswahili, French, English, Spanish and Arabic with native speakers via text and audio calls!',
    membersCount: 6730,
    isJoined: false,
    postsCount: 450,
    tags: ['Swahili', 'Languages', 'Culture', 'Exchange'],
    rules: ['Be patient with language learners', 'Encourage practice without judgment'],
  }
];

export const MOCK_BUSINESS_PAGES: BusinessPage[] = [
  {
    id: 'biz-1',
    name: 'Swahili Tech Labs',
    category: 'Software & Cloud Services',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Engineering resilient digital products and cloud architecture for hyper-growth startups across Africa.',
    location: 'Masaki, Dar es Salaam, Tanzania',
    rating: 4.9,
    reviewsCount: 88,
    verified: true,
    followersCount: 14200,
    isFollowing: true,
    whatsappContact: '+255712345678',
    products: [
      {
        id: 'p1',
        name: 'Full-Stack MVP Sprint (3 Weeks)',
        price: 'TZS 4,500,000',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        description: 'From wireframes to production deployment on AWS/Cloud Run with automated testing.',
        inStock: true,
      },
      {
        id: 'p2',
        name: 'WebRTC Audio/Video Architecture Audit',
        price: 'TZS 1,200,000',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
        description: 'Complete latency optimization and signaling server hardening.',
        inStock: true,
      }
    ]
  },
  {
    id: 'biz-2',
    name: 'Zanzibar Spice & Soul Artisan',
    category: 'E-Commerce & Culture',
    logoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Certified organic organic cloves, cardamom, vanilla, and handcrafted skin oils sourced directly from Pemba & Unguja smallholders.',
    location: 'Stone Town, Zanzibar',
    rating: 4.8,
    reviewsCount: 134,
    verified: true,
    followersCount: 9800,
    isFollowing: false,
    whatsappContact: '+255789123456',
    products: [
      {
        id: 'p3',
        name: 'Signature Zanzibar Spice Box (12 Spices)',
        price: 'TZS 65,000',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh harvest vacuum-sealed spices packaged in handcrafted wooden box.',
        inStock: true,
      }
    ]
  }
];

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'ev-1',
    title: 'East Africa Tech & AI Summit 2026',
    organizer: 'Dar es Salaam Developers',
    date: 'Oct 24, 2026',
    time: '09:00 AM EAT',
    location: 'JNICC, Dar es Salaam & Live on Mizizi Stream',
    attendeesCount: 740,
    isAttending: true,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    category: 'Technology',
  },
  {
    id: 'ev-2',
    title: 'Afro-Fusion Acoustic Rooftop Sessions',
    organizer: 'Afro Beats Collective',
    date: 'Nov 02, 2026',
    time: '07:30 PM EAT',
    location: 'Masaki Rooftop Lounge, Dar es Salaam',
    attendeesCount: 280,
    isAttending: false,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    category: 'Music',
  }
];

