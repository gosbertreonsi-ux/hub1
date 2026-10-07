import React, { useEffect } from 'react';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { startRingtone, stopRingtone } from '../utils/audio';

interface IncomingCallBannerProps {
  caller: UserProfile;
  callType: 'voice' | 'video';
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallBanner: React.FC<IncomingCallBannerProps> = ({
  caller,
  callType,
  onAccept,
  onReject,
}) => {
  useEffect(() => {
    startRingtone();
    return () => stopRingtone();
  }, []);

  const handleAccept = () => {
    stopRingtone();
    onAccept();
  };

  const handleReject = () => {
    stopRingtone();
    onReject();
  };

  return (
    <div className="fixed top-5 inset-x-4 max-w-md mx-auto z-50 bg-[#121218]/95 backdrop-blur-md border-2 border-red-600 rounded-3xl p-4 shadow-2xl shadow-red-950/90 animate-bounce duration-1000">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={caller.avatarUrl}
              alt={caller.nickname}
              className="w-12 h-12 rounded-full object-cover border-2 border-red-500 animate-pulse"
            />
            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full text-[10px]">
              {callType === 'video' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-white text-sm">{caller.nickname}</h4>
              <span className="text-[10px] bg-red-950 text-red-300 font-bold px-1.5 rounded">
                Incoming {callType} call
              </span>
            </div>
            <p className="text-xs text-zinc-400">{caller.approxLocation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reject button */}
          <button
            onClick={handleReject}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Decline"
          >
            <PhoneOff className="w-4 h-4 text-red-400" />
          </button>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white flex items-center justify-center cursor-pointer shadow-lg transition-all active:scale-95"
            title="Accept Call"
          >
            <Phone className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
