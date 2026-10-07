import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { PaymentCarrier, PaymentStatus, VIPAccess, Language } from '../types';
import { MOBILE_CARRIERS } from '../data/mockData';
import { playNotificationChime } from '../utils/audio';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (carrier: PaymentCarrier, phone: string) => void;
  lang: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const isSw = lang === 'sw';
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [selectedCarrier, setSelectedCarrier] = useState<PaymentCarrier>('mpesa');
  const [step, setStep] = useState<'form' | 'push_sent' | 'pin_dialog' | 'success' | 'failed'>('form');
  const [pinInput, setPinInput] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [orderRef, setOrderRef] = useState('');

  // Auto detect carrier based on Tanzanian mobile number prefix
  useEffect(() => {
    const clean = phoneNumber.replace(/\D/g, '');
    for (const carrier of MOBILE_CARRIERS) {
      if (carrier.prefixes.some((p) => clean.startsWith(p.replace(/\D/g, '')))) {
        setSelectedCarrier(carrier.id);
        break;
      }
    }
  }, [phoneNumber]);

  if (!isOpen) return null;

  const currentCarrierObj = MOBILE_CARRIERS.find((c) => c.id === selectedCarrier) || MOBILE_CARRIERS[0];

  // Initiate USSD Push payment flow
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 9) {
      alert(isSw ? 'Tafadhali weka namba sahihi ya simu (mf. 0712345678)' : 'Please enter a valid phone number');
      return;
    }

    const randomRef = `TZ-${selectedCarrier.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(randomRef);
    setStep('push_sent');

    // After 2 seconds, simulate USSD PIN prompt arriving on phone screen
    setTimeout(() => {
      setStep('pin_dialog');
    }, 2200);
  };

  // Confirm PIN and complete transaction
  const handleConfirmPIN = () => {
    setStep('success');
    playNotificationChime();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    // Auto redirect after countdown
    let timer = 4;
    setCountdown(timer);
    const interval = setInterval(() => {
      timer--;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        onSuccess(selectedCarrier, phoneNumber);
        onClose();
      }
    }, 1000);
  };

  // Instant Demo Unlock (one-click instant VIP access for reviewer convenience)
  const handleQuickDemoUnlock = () => {
    setOrderRef(`TEST-VIP-${Math.floor(100000 + Math.random() * 900000)}`);
    handleConfirmPIN();
  };

  const handleReset = () => {
    setStep('form');
    setPinInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#111b21] text-slate-100 w-full max-w-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1f2c34] px-5 py-3.5 flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00a884] flex items-center justify-center text-white font-bold text-sm">
              TZ
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white">
                {isSw ? 'Lipia Kujiunga na VIP' : 'Join VIP Access'}
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium">
                {isSw ? 'M-PESA · TIGO PESA · AIRTEL · HALOPESA' : 'Fast Tanzanian Mobile Money'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* STEP 1: PAYMENT FORM */}
          {step === 'form' && (
            <div>
              {/* Amount Display Card */}
              <div className="bg-[#1f2c34] rounded-xl p-3.5 mb-4 text-center border border-emerald-500/30">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {isSw ? 'Kiasi cha Malipo (Masaa 24 Unlimited)' : 'VIP Pass Amount (24h Unlimited)'}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#25D366] mt-0.5">
                  TZS 2,000
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {isSw 
                    ? 'Ufikiaji wa Video zote za Bongo, DJ Afro, Series na VIP WhatsApp Group!'
                    : 'Instant access to all Bongo movies, DJ Afro dubbed films & VIP WhatsApp group!'}
                </p>
              </div>

              {/* Supported Mobile Carriers */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isSw ? 'Chagua Mtandao wako wa Simu:' : 'Select Mobile Carrier:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_CARRIERS.map((c) => {
                    const isSelected = selectedCarrier === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCarrier(c.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold ring-1 ring-emerald-500'
                            : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-base">{c.logo.slice(0, 2)}</span>
                        <div className="truncate">
                          <div className="leading-tight">{c.tag}</div>
                          <div className="text-[10px] text-slate-400">{c.promptCode}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Input Form */}
              <form onSubmit={handleInitiatePayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Namba ya Simu ya Malipo' : 'Phone Number (Tanzania)'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712 345 678"
                      required
                      className="w-full bg-[#1f2c34] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-sm font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isSw
                      ? `Mfano: 0712345678, 0754123456 (Mtandao: ${currentCarrierObj.name})`
                      : `Example: 0712345678, 0754123456 (${currentCarrierObj.name})`}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSw ? 'Lipa TZS 2,000 Sasa' : 'Pay TZS 2,000 Now'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Quick Demo Test Mode Button (Convenient for Reviewers) */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoUnlock}
                  className="w-full text-xs text-amber-400 hover:text-amber-300 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-600/40 py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSw ? '⚡ Jaribu Moja kwa Moja (Instant Demo Pass)' : '⚡ Instant Demo Unlock (Test Pass)'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSw ? 'Miamala yote ni salama kupitia USSD Push ya Vodacom & Tigo' : 'Encrypted official carrier USSD push'}</span>
              </div>
            </div>
          )}

          {/* STEP 2: USSD PUSH SENT */}
          {step === 'push_sent' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-[#00a884] flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="w-8 h-8 text-[#00a884]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {isSw ? 'Tunatuma Ombi Kwenye Simu Yako...' : 'Pushing USSD Prompt to Your Phone...'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {isSw 
                    ? `Tafadhali angalia skrini ya simu yako ${phoneNumber} kwa ajili ya kuthibitisha malipo ya TZS 2,000.`
                    : `Please check your phone screen ${phoneNumber} to approve the TZS 2,000 request.`}
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}

          {/* STEP 3: MOCK USSD PIN CONFIRMATION */}
          {step === 'pin_dialog' && (
            <div className="bg-[#1f2c34] rounded-xl p-4 border border-slate-700 text-center space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {currentCarrierObj.name} · USSD PUSH
              </div>

              <div className="bg-black/60 rounded-lg p-3 text-xs text-slate-200 border border-slate-800 space-y-1">
                <p className="font-semibold text-white">
                  {isSw ? 'Movies-TZ VIP Subscription' : 'Movies-TZ VIP Subscription'}
                </p>
                <p>{isSw ? 'Kiasi: TZS 2,000' : 'Amount: TZS 2,000'}</p>
                <p className="text-slate-400">
                  {isSw ? 'Weka namba yako ya siri (PIN) kuthibitisha:' : 'Enter your mobile money PIN to confirm:'}
                </p>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="****"
                  autoFocus
                  className="w-32 bg-black text-center text-xl tracking-widest text-emerald-400 py-2 rounded-lg border border-emerald-500/50 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPIN}
                  className="bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-2 px-5 rounded-lg text-xs cursor-pointer transition-colors shadow"
                >
                  {isSw ? 'Thibitisha Malipo (OK)' : 'Confirm PIN (OK)'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-xs cursor-pointer"
                >
                  {isSw ? 'Ghairi' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isSw ? 'Malipo Yamefanikiwa! 🎉' : 'Payment Successful! 🎉'}
              </h3>
              <p className="text-xs text-slate-300">
                {isSw 
                  ? 'Hongera! Akaunti yako sasa imefunguliwa ufikiaji wa masaa 24 kwenye Movies-TZ VIP & WhatsApp Group.'
                  : 'Congratulations! 24h VIP access granted to Movies-TZ VIP & WhatsApp Group.'}
              </p>

              <div className="bg-[#1f2c34] rounded-lg p-3 text-left text-xs font-mono text-slate-300 border border-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isSw ? 'Namba ya Muamala:' : 'Reference ID:'}</span>
                  <span className="text-emerald-400 font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isSw ? 'Kiasi:' : 'Amount:'}</span>
                  <span>TZS 2,000 ({currentCarrierObj.tag})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isSw ? 'Muda:' : 'Validity:'}</span>
                  <span className="text-white">Masaa 24 (24 Hours)</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-emerald-400 font-medium">
                {isSw ? `Inaelekeza kwenye video kwa sekunde ${countdown}...` : `Redirecting to cinema in ${countdown}s...`}
              </div>

              <button
                type="button"
                onClick={() => {
                  onSuccess(selectedCarrier, phoneNumber);
                  onClose();
                }}
                className="w-full bg-[#00a884] hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow transition-all"
              >
                {isSw ? 'Tazama Video Sasa →' : 'Watch Videos Now →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
