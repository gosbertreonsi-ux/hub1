import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Signal, 
  Maximize, 
  Minimize,
  Radio
} from 'lucide-react';
import { CallSession, UserProfile } from '../types';
import { playCallEndTone } from '../utils/audio';

interface CallModalProps {
  callSession: CallSession | null;
  onEndCall: () => void;
  onReportUser: (participant: UserProfile) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  callSession,
  onEndCall,
  onReportUser,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Timer counter
  useEffect(() => {
    if (!callSession || callSession.status !== 'connected') return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callSession]);

  // Request actual camera stream for WebRTC video call if video mode
  useEffect(() => {
    if (!callSession || callSession.type !== 'video' || callSession.status !== 'connected') {
      return;
    }

    let isMounted = true;

    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (isMounted) {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              localVideoRef.current.play().catch(() => {});
            }
          }
        }
      } catch (err) {
        console.debug('Webcam access fallback to avatar mode', err);
        if (isMounted) setCameraError(true);
      }
    }

    setupCamera();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [callSession?.type, callSession?.status]);

  if (!callSession) return null;

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    playCallEndTone();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    onEndCall();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = isVideoOff;
      });
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

  const participant = callSession.participant;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        ref={containerRef}
        className="w-full max-w-4xl h-full sm:h-[88vh] bg-[#09090e] border border-red-950/80 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Top Header of Call */}
        <header className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">{participant.nickname}</h3>
              <p className="text-[11px] text-red-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3 h-3" />
                <span>
                  {callSession.status === 'connected'
                    ? formatSeconds(callDuration)
                    : 'Connecting WebRTC Session...'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <Signal className="w-3 h-3" />
                  HD 24ms
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReportUser(participant)}
              className="p-2 rounded-xl bg-black/60 hover:bg-red-950/80 text-zinc-300 hover:text-red-300 border border-zinc-800 cursor-pointer"
              title="Report User"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/60 hover:bg-zinc-800 text-zinc-300 cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Video / Audio Stage */}
        <main className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          {callSession.type === 'video' ? (
            /* VIDEO CALL MODE */
            <div className="w-full h-full relative">
              {/* Remote Participant Video Feed */}
              <img
                src={participant.photos[0] || participant.avatarUrl}
                alt={participant.nickname}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

              {/* Local Video Stream Picture-in-Picture */}
              <div className="absolute bottom-24 right-4 sm:right-6 w-32 sm:w-44 aspect-[3/4] bg-zinc-900 border-2 border-red-600 rounded-2xl overflow-hidden shadow-2xl z-10">
                {!isVideoOff && !cameraError ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#15151c] text-zinc-400 p-2 text-center text-[10px]">
                    <VideoOff className="w-6 h-6 text-red-400 mb-1" />
                    <span>Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[10px] text-white font-bold bg-black/70 px-1 rounded">
                  You
                </div>
              </div>
            </div>
          ) : (
            /* VOICE CALL MODE */
            <div className="text-center space-y-6 z-10 p-6">
              <div className="relative inline-block mx-auto">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-red-600 p-1 animate-red-ring">
                  <img
                    src={participant.avatarUrl}
                    alt={participant.nickname}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-red-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-lg">
                  Voice Call
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">{participant.nickname}</h2>
                <p className="text-sm text-zinc-400 mt-1">{participant.approxLocation}</p>
              </div>

              {/* Live WebRTC Audio Frequency Bars Simulation */}
              <div className="flex items-center justify-center gap-1.5 h-12 max-w-xs mx-auto">
                {[40, 70, 95, 60, 85, 30, 90, 100, 75, 50, 80, 45, 90, 60, 35].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-red-800 to-rose-500 animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Call Controls Bar */}
        <footer className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-4 sm:gap-6">
          {/* Mute Mic button */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isMuted
                ? 'bg-red-950 border border-red-600 text-red-400'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle (If in video call) */}
          {callSession.type === 'video' && (
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isVideoOff
                  ? 'bg-red-950 border border-red-600 text-red-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-white'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* END CALL BUTTON (Crimson circle) */}
          <button
            onClick={handleEnd}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white flex items-center justify-center cursor-pointer shadow-xl shadow-red-950/90 transition-all active:scale-95 border-2 border-red-400/50"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Speaker toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isSpeakerOn
                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-500'
            }`}
            title="Speaker"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </footer>
      </div>
    </div>
  );
};
