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
