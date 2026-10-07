import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Crown, 
  Sparkles, 
  Check, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Lock, 
  ArrowRight,
  Gem,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { playMatchFanfare, playPopSound } from '../utils/audio';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateVIP: (plan: 'daily' | 'monthly' | 'founder') => void;
  onDowngradeToFree?: () => void;
  isCurrentlySubscribed?: boolean;
  featureLockedMessage?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onActivateVIP,
  onDowngradeToFree,
  isCurrentlySubscribed = false,
  featureLockedMessage,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly' | 'founder'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [carrier, setCarrier] = useState<'vodacom' | 'tigo' | 'airtel' | 'halotel'>('vodacom');
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ussdStep, setUssdStep] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    playPopSound();

    if (paymentMethod === 'mobile') {
      // Simulate USSD push prompt
      setTimeout(() => {
        setUssdStep(true);
      }, 700);

      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setUssdStep(false);
        playMatchFanfare();

        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#e11d48', '#ef4444', '#f59e0b', '#ffffff', '#fbbf24'],
          });
        } catch {
          // ignore
        }

        setTimeout(() => {
          onActivateVIP(selectedPlan);
          onClose();
          setIsSuccess(false);
        }, 1800);
      }, 2400);
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        playMatchFanfare();

        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#e11d48', '#ef4444', '#f59e0b', '#ffffff'],
          });
        } catch {
          // ignore
        }

        setTimeout(() => {
          onActivateVIP(selectedPlan);
          onClose();
          setIsSuccess(false);
        }, 1800);
      }, 1500);
    }
  };

  const handleInstantDemoPass = () => {
    playMatchFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#ffffff'],
      });
    } catch {
      // ignore
    }
    onActivateVIP('monthly');
    onClose();
  };

  const handleSwitchToFree = () => {
    playPopSound();
    if (onDowngradeToFree) {
      onDowngradeToFree();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0c0c12] border-2 border-red-600/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl shadow-red-950 relative max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown & VIP Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-600 to-rose-700 p-0.5 mx-auto shadow-xl shadow-red-950">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>MIZIZI BILLIONAIRE CLUB & VIP PASS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isCurrentlySubscribed ? 'VIP Pass Active' : 'Subscribe to Unlock Full Access'}
          </h2>

          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/60 max-w-md mx-auto">
            <p className="text-xs text-red-200 leading-relaxed font-medium">
              {featureLockedMessage ? (
                <span>⚠️ <strong className="text-white">{featureLockedMessage}</strong></span>
              ) : (
                <span>✨ Anyone can preview and explore how Mizizi works! To connect, chat, start video calls, match, and post — become a VIP subscriber.</span>
              )}
            </p>
          </div>
        </div>

        {/* PRICING PLANS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Daily Plan */}
          <div
            onClick={() => setSelectedPlan('daily')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === 'daily'
                ? 'bg-red-950/60 border-red-500 shadow-lg ring-1 ring-red-500'
                : 'bg-[#14141c] border-red-950 hover:border-zinc-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">24h Pass</span>
              <div className="text-base font-extrabold text-white mt-1">TZS 2,000</div>
              <span className="text-[10px] text-zinc-400">$1.00 USD</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Unlimited day access</p>
          </div>

          {/* Monthly VIP Plan (Featured) */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-b from-red-950 to-black border-red-500 shadow-xl ring-2 ring-red-500'
                : 'bg-[#14141c] border-red-950 hover:border-zinc-700'
            }`}
          >
            <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-red-600 to-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Monthly VIP</span>
              <div className="text-base font-extrabold text-white mt-1">TZS 15,000</div>
              <span className="text-[10px] text-zinc-400">$6.00 / month</span>
            </div>
            <p className="text-[10px] text-red-300 font-semibold mt-2">Full matching & calls</p>
          </div>

          {/* Founder Billionaire Plan */}
          <div
            onClick={() => setSelectedPlan('founder')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === 'founder'
                ? 'bg-gradient-to-b from-amber-950/50 to-black border-amber-500 shadow-xl ring-2 ring-amber-500'
                : 'bg-[#14141c] border-red-950 hover:border-zinc-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <Gem className="w-3 h-3" /> Billionaire
              </span>
              <div className="text-base font-extrabold text-white mt-1">TZS 99,000</div>
              <span className="text-[10px] text-zinc-400">$39.00 / year</span>
            </div>
            <p className="text-[10px] text-amber-300 font-semibold mt-2">Gold badge & perks</p>
          </div>
        </div>

        {/* VIP PERKS LIST */}
        <div className="bg-[#12121a] rounded-2xl p-3.5 border border-red-950 mb-5 text-xs space-y-1.5 text-zinc-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Unlimited 1-to-1 WebRTC Voice & Video Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Direct Messaging & Voice Note Exchange</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Unlimited Discovery Swiping & Instant Mutual Matches</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Publish Unlimited Reels, Posts, and Join Elite Communities</span>
          </div>
        </div>

        {/* USSD Prompt Simulation Banner */}
        {ussdStep && (
          <div className="mb-4 p-3 bg-amber-950/80 border border-amber-500 rounded-xl text-xs text-amber-200 animate-pulse flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">USSD Push Notification Sent!</div>
              <div>Check your phone to enter PIN for TZS {selectedPlan === 'daily' ? '2,000' : selectedPlan === 'monthly' ? '15,000' : '99,000'} to MIZIZI.</div>
            </div>
          </div>
        )}

        {/* PAYMENT CHECKOUT FORM */}
        <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-semibold text-white">Payment Method:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile')}
                className={`px-3 py-1 rounded-lg border text-xs cursor-pointer ${
                  paymentMethod === 'mobile'
                    ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-3 py-1 rounded-lg border text-xs cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-red-950 text-red-200 border-red-600 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                Card / Apple Pay
              </button>
            </div>
          </div>

          {paymentMethod === 'mobile' ? (
            <div className="space-y-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {(['vodacom', 'tigo', 'airtel', 'halotel'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCarrier(c)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                      carrier === c
                        ? 'bg-red-600 text-white border-red-400'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {c === 'vodacom' ? 'M-PESA' : c === 'tigo' ? 'TIGO PESA' : c === 'airtel' ? 'AIRTEL' : 'HALOPESA'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  Mobile Money Phone Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full bg-[#14141c] text-white pl-9 pr-3 py-2.5 rounded-xl border border-red-950 font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-zinc-400 mb-1">Card Number:</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  defaultValue="4111 2222 3333 4444"
                  placeholder="Card Number"
                  className="w-full bg-[#14141c] text-white pl-9 pr-3 py-2.5 rounded-xl border border-red-950 font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black py-3.5 rounded-xl shadow-xl shadow-red-950 cursor-pointer text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </span>
            ) : isSuccess ? (
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> VIP Activated! Welcome to Billionaire Club
              </span>
            ) : (
              <>
                <Crown className="w-4 h-4 fill-white" />
                <span>
                  Subscribe Now ({selectedPlan === 'daily' ? 'TZS 2,000' : selectedPlan === 'monthly' ? 'TZS 15,000' : 'TZS 99,000'})
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Tester Utilities: Instant VIP activation & Downgrade to Free Preview */}
        <div className="mt-4 pt-3 border-t border-red-950 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <button
            type="button"
            onClick={handleInstantDemoPass}
            className="w-full sm:w-auto text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-600/40 py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ 1-Click Instant Demo VIP Unlock</span>
          </button>

          {isCurrentlySubscribed && (
            <button
              type="button"
              onClick={handleSwitchToFree}
              className="w-full sm:w-auto text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Switch to Free Preview (Test Paywall)</span>
            </button>
          )}
        </div>

        <div className="mt-3 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted USSD & Mobile Money Gateway · Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};
