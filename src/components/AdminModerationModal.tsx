import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BarChart3, 
  Search, 
  X,
  PhoneCall,
  MessageSquare,
  Lock,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, ReportTicket } from '../types';
import { playPopSound } from '../utils/audio';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  reports: ReportTicket[];
  onResolveReport: (reportId: string, action: 'ban' | 'warn' | 'dismiss') => void;
  onToggleUserVerification: (userId: string) => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  users,
  reports,
  onResolveReport,
  onToggleUserVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'analytics'>('reports');
  const [userSearch, setUserSearch] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) =>
    u.nickname.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.country.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#0c0c11] border border-red-950/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 sm:p-5 bg-[#121218] border-b border-red-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-700 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Mizizi Connect · Trust, Safety & Admin Console
              </h3>
              <p className="text-[11px] text-zinc-400">
                PRD §26-28 Automated Risk Engine & Moderation Review
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 bg-[#0e0e14] border-b border-red-950 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-2.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'reports'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Moderation Queue ({reports.filter((r) => r.status === 'pending').length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'users'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            User Directory ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'analytics'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            System Metrics & Health
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* 1. MODERATION REPORTS QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs">Moderation queue is clean. No pending user reports.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-[#121218] border border-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          User: {report.reportedUserNickname}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-semibold border border-red-800">
                          {report.reason}
                        </span>
                        <span className="text-[10px] text-zinc-500">{report.createdAt}</span>
                      </div>
                      <p className="text-zinc-300">"{report.details}"</p>
                      <p className="text-[11px] text-zinc-500">
                        Status: <b className="text-red-400 uppercase">{report.status}</b>
                      </p>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            playPopSound();
                            onResolveReport(report.id, 'dismiss');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer font-medium"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            playPopSound();
                            onResolveReport(report.id, 'warn');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800 cursor-pointer font-medium"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => {
                            playPopSound();
                            onResolveReport(report.id, 'ban');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white cursor-pointer font-bold shadow"
                        >
                          Restrict / Ban
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter users by nickname or country..."
                  className="w-full bg-[#121218] border border-red-950 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="divide-y divide-red-950/60 rounded-xl border border-red-950 bg-[#121218]">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.nickname}
                        className="w-9 h-9 rounded-xl object-cover border border-zinc-800"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.nickname}, {u.age}</span>
                          {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-950" />}
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          {u.approxLocation || u.country} · {u.interests.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playPopSound();
                        onToggleUserVerification(u.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer text-[11px] border ${
                        u.verified
                          ? 'bg-red-950/60 text-red-300 border-red-800'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                      }`}
                    >
                      {u.verified ? '✓ Verified' : '+ Mark Verified'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PLATFORM ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#121218] border border-red-950 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Daily Active Users</span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">1,482</div>
                  <span className="text-[10px] text-emerald-400">+14% this week</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121218] border border-red-950 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Mutual Matches</span>
                  <div className="text-xl sm:text-2xl font-black text-red-500 mt-1">3,921</div>
                  <span className="text-[10px] text-zinc-400">High compatibility</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121218] border border-red-950 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Encrypted Messages</span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">24,190</div>
                  <span className="text-[10px] text-red-400">w/ AI Translations</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121218] border border-red-950 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Active WebRTC Calls</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">18</div>
                  <span className="text-[10px] text-emerald-400">HD voice & video</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121218] border border-red-950 text-xs space-y-2">
                <span className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                  Connection Loop Health:
                </span>
                <p className="text-zinc-300">
                  DISCOVER (100%) → LIKE (42%) → MATCH (18%) → CHAT (91% of matches) → VOICE/VIDEO CALL (24%)
                </p>
                <p className="text-zinc-500 text-[11px]">
                  Engine is optimized for low unmatch rate and zero fake profiles.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
