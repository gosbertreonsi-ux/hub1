export type Language = 'sw' | 'en';

export interface ChatPerson {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role?: 'admin' | 'creator' | 'member';
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: ChatPerson;
  type: 'text' | 'video' | 'audio' | 'image' | 'sticker';
  text?: string;
  thumb?: string;
  videoUrl?: string;
  size?: string;
  duration?: string;
  time: string;
  isForwarded?: boolean;
  reactions?: { emoji: string; count: number }[];
  isLocked?: boolean;
  movieRefId?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  category: 'bongo' | 'dj-afro' | 'series' | 'vip-connection' | 'nollywood' | 'bollywood';
  dj?: 'DJ Afro' | 'DJ Mack' | 'DJ Murphy' | 'DJ Six' | 'DJ Black' | 'Asili (Original)';
  year: number;
  rating: number;
  duration: string;
  quality: '4K' | '1080p FHD' | '720p HD';
  poster: string;
  banner: string;
  descriptionSw: string;
  descriptionEn: string;
  cast: string[];
  views: number;
  likes: number;
  videoUrl: string;
  trailerUrl?: string;
  isVipOnly?: boolean;
  episodesCount?: number;
  downloadSize: string;
  trendingRank?: number;
}

export type PaymentCarrier = 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';

export interface PaymentStatus {
  status: 'idle' | 'submitting' | 'waiting_ussd' | 'pin_prompt' | 'success' | 'failed';
  orderId?: string;
  carrier?: PaymentCarrier;
  phone?: string;
  amount: number;
  message?: string;
  timestamp?: number;
}

export interface VIPAccess {
  isActive: boolean;
  expiresAt: number | null;
  phone?: string;
  carrier?: PaymentCarrier;
  token?: string;
}
