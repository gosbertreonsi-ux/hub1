import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Download, 
  Share2, 
  X, 
  Radio, 
  Check, 
  Sliders, 
  Sparkles,
  MessageCircle,
  Eye,
  Heart
} from 'lucide-react';
import { Movie, Language } from '../types';
import { playPopSound } from '../utils/audio';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  lang: Language;
  onOpenWhatsApp: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  movie,
  onClose,
  lang,
  onOpenWhatsApp,
}) => {
  const isSw = lang === 'sw';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<'dj' | 'original' | 'subs'>('dj');
  const [showSettings, setShowSettings] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(movie.likes);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    // Auto play
    video.play().catch(() => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [movie]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    setDownloadProgress(10);
    playPopSound();
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 2500);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Tazama movie kali: *${movie.title}* (${movie.dj || 'Bongo Movies'}) bure kwenye Movies-TZ VIP!\n👉 https://whatsap4.movies-tz.online/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleToggleLike = () => {
    playPopSound();
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        ref={containerRef}
        className="w-full max-w-5xl bg-[#090d16] text-white rounded-none sm:rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[100vh] sm:max-h-[92vh]"
      >
        {/* Top Header of Cinema Player */}
        <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-red-600 font-bold px-2 py-0.5 rounded text-white flex items-center gap-1">
              LIVE HD
            </span>
            <div className="truncate max-w-[220px] sm:max-w-md">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {movie.title}
              </h2>
              <p className="text-[11px] text-emerald-400">
                {movie.dj ? `${movie.dj} · Swahili Dubbed` : 'Bongo Cinema'} · {movie.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1 bg-[#00a884] hover:bg-[#008f70] px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              title="Share to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Screen Area */}
        <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden aspect-video max-h-[60vh] sm:max-h-[64vh]">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            poster={movie.banner || movie.poster}
            className="w-full h-full object-contain"
            playsInline
            onClick={togglePlay}
          />

          {/* Center Play/Pause button on hover/pause */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#00a884]/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Controls Bar Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 sm:p-4 space-y-2">
            {/* Seek Bar */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 accent-[#25D366] rounded-lg cursor-pointer"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay}
                  className="p-1 text-white hover:text-emerald-400 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  <button onClick={toggleMute} className="p-1 cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-slate-700 accent-[#25D366] cursor-pointer hidden sm:inline-block"
                  />
                </div>

                {/* Timestamp */}
                <span className="font-mono text-[11px] text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Settings */}
              <div className="flex items-center gap-2">
                {/* Audio track indicator */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded text-[11px] cursor-pointer font-medium"
                >
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">
                    {selectedAudioTrack === 'dj' 
                      ? (movie.dj || 'DJ Audio') 
                      : (selectedAudioTrack === 'original' ? 'Original Audio' : 'Swahili Subs')}
                  </span>
                  <span className="sm:hidden">{selectedQuality}</span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-emerald-400 cursor-pointer"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Settings Drawer (Quality & Audio Commentary selector) */}
          {showSettings && (
            <div className="absolute right-3 bottom-14 bg-slate-900/95 border border-slate-700 p-3 rounded-xl text-xs space-y-3 z-30 shadow-2xl w-60">
              <div>
                <span className="font-bold text-slate-300 block mb-1">
                  {isSw ? 'Ubora wa Picha (Video Quality):' : 'Video Quality:'}
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(['1080p', '720p', '480p'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuality(q)}
                      className={`px-2 py-1 rounded text-center font-bold cursor-pointer ${
                        selectedQuality === q
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1">
                  {isSw ? 'Sauti / Msimulizi (Audio Track):' : 'Audio Track:'}
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedAudioTrack('dj')}
                    className={`w-full flex items-center justify-between p-1.5 rounded cursor-pointer ${
                      selectedAudioTrack === 'dj' ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>🎙️ {movie.dj || 'DJ Afro'} (Swahili Dub)</span>
                    {selectedAudioTrack === 'dj' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setSelectedAudioTrack('original')}
                    className={`w-full flex items-center justify-between p-1.5 rounded cursor-pointer ${
                      selectedAudioTrack === 'original' ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>🔊 Original Voice</span>
                    {selectedAudioTrack === 'original' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player Details & Action Panel */}
        <div className="p-4 bg-[#0f172a] space-y-3 overflow-y-auto max-h-48">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {isSw ? movie.descriptionSw : movie.descriptionEn}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {movie.views.toLocaleString()} {isSw ? 'Watazamaji' : 'Views'}
                </span>
                <span className="text-slate-600">·</span>
                <span>{movie.duration}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-semibold">{movie.quality}</span>
              </div>
            </div>

            {/* Action Buttons: Download, Like, WhatsApp Chat */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                  isLiked
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloadProgress !== null}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {downloadProgress !== null
                    ? (downloadProgress >= 100 ? (isSw ? 'Imekamilika!' : 'Downloaded!') : `${downloadProgress}%...`)
                    : (isSw ? `Pakua (${movie.downloadSize})` : `Download (${movie.downloadSize})`)}
                </span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-xs font-bold text-white cursor-pointer shadow transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isSw ? 'Jadili WhatsApp' : 'Discuss on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
