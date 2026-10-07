import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  MapPin, 
  PhoneCall, 
  X, 
  Lock, 
  UserX, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { CurrentUser, UserProfile } from '../types';
import { playPopSound } from '../utils/audio';

interface SafetyPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUpdatePrivacy: (privacy: CurrentUser['privacy']) => void;
  blockedUsers: UserProfile[];
  onUnblockUser: (userId: string) => void;
  reportingUser?: UserProfile | null;
  onSubmitReport?: (userId: string, reason: string, details: string) => void;
  onCloseReport?: () => void;
}

export const SafetyPrivacyModal: React.FC<SafetyPrivacyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePrivacy,
  blockedUsers,
  onUnblockUser,
  reportingUser,
  onSubmitReport,
  onCloseReport,
}) => {
  const [privacyState, setPrivacyState] = useState(currentUser.privacy);
  const [reportReason, setReportReason] = useState('Harassment');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    playPopSound();
    onUpdatePrivacy(privacyState);
    onClose();
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingUser || !onSubmitReport) return;
    playPopSound();
    onSubmitReport(reportingUser.id, reportReason, reportDetails);
    setReportSent(true);
    setTimeout(() => {
      setReportSent(false);
      if (onCloseReport) onCloseReport();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0e0e13] border border-red-950/90 rounded-3xl shadow-2xl p-6 text-white overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-700 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {reportingUser ? `Report ${reportingUser.nickname}` : 'Privacy & Safety Controls'}
              </h3>
              <p className="text-[11px] text-zinc-400">PRD §8 & §22 User Protection</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onCloseReport) onCloseReport();
              onClose();
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REPORT SUBMISSION FORM (If reporting a specific user) */}
        {reportingUser ? (
          <div>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base">Report Submitted to Moderation Queue</h4>
                <p className="text-xs text-zinc-400">
                  Thank you for keeping Mizizi Connect safe. Our automated safety engine and human moderators will review this account immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Select Violation Category:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Harassment">Harassment or Bullying</option>
                    <option value="Spam">Spam or Commercial Solicitation</option>
                    <option value="Scam">Scam / Financial Fraud</option>
                    <option value="Fake Profile">Fake Profile / Impersonation</option>
                    <option value="Hate Speech">Hate Speech or Intolerance</option>
                    <option value="Inappropriate Content">Inappropriate Sexual Content</option>
                    <option value="Underage">Underage User Suspicion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    Describe Details (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide context for the moderator review..."
                    className="w-full bg-[#14141c] border border-red-950 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onCloseReport) onCloseReport();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer shadow-lg shadow-red-950"
                  >
                    Submit Report to Moderation
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD PRIVACY CONTROLS */
          <div className="space-y-5 text-xs">
            {/* 1. Online Status Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#14141c] border border-red-950">
              <div>
                <span className="font-bold text-white block">Online Status Visibility</span>
                <span className="text-[11px] text-zinc-400">
                  Allow other users to see when you are active on the platform.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPrivacyState((prev) => ({
                    ...prev,
                    showOnlineStatus: !prev.showOnlineStatus,
                  }))
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  privacyState.showOnlineStatus ? 'bg-red-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    privacyState.showOnlineStatus ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Approximate Location Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#14141c] border border-red-950">
              <div>
                <span className="font-bold text-white block">Approximate Location Only</span>
                <span className="text-[11px] text-zinc-400">
                  Per PRD §8, your precise coordinates are never stored. Only city/country is shown.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPrivacyState((prev) => ({
                    ...prev,
                    showLocation: !prev.showLocation,
                  }))
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  privacyState.showLocation ? 'bg-red-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    privacyState.showLocation ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Call Permissions */}
            <div className="p-3 rounded-2xl bg-[#14141c] border border-red-950 space-y-2">
              <span className="font-bold text-white block">Who Can Call You (Voice & Video)</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'matches_only', label: 'Matches Only' },
                  { id: 'everyone', label: 'Everyone' },
                  { id: 'nobody', label: 'Nobody' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setPrivacyState((prev) => ({
                        ...prev,
                        allowCallsFrom: opt.id as any,
                      }))
                    }
                    className={`py-2 px-1 rounded-xl text-center font-semibold cursor-pointer border ${
                      privacyState.allowCallsFrom === opt.id
                        ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Blocked Users List */}
            <div className="p-3 rounded-2xl bg-[#14141c] border border-red-950 space-y-2">
              <span className="font-bold text-white block">Blocked Accounts</span>
              {blockedUsers.length === 0 ? (
                <p className="text-[11px] text-zinc-500">You haven't blocked any accounts.</p>
              ) : (
                <div className="space-y-1.5">
                  {blockedUsers.map((bu) => (
                    <div
                      key={bu.id}
                      className="flex items-center justify-between text-xs text-zinc-300"
                    >
                      <span>{bu.nickname}</span>
                      <button
                        onClick={() => onUnblockUser(bu.id)}
                        className="text-red-400 hover:text-red-300 underline cursor-pointer"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 rounded-xl cursor-pointer shadow-lg shadow-red-950 transition-all active:scale-95"
            >
              Save Privacy Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
