
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VIP_TIERS } from '../constants';
import { Check, Star, Wallet, Loader2 } from 'lucide-react';
import { VIPTier } from '../types';

const VIP: React.FC = () => {
  const { user, buyVIP } = useApp();
  const [loadingTier, setLoadingTier] = useState<number | null>(null);

  if (!user) return null;

  const handleUpgrade = (tier: VIPTier) => {
    if (user.balance < tier.investment) {
      alert(`দুঃখিত! আপনার ব্যালেন্স পর্যাপ্ত নয়।\nদাম: ৳${tier.investment.toLocaleString()}\nআপনার ব্যালেন্স: ৳${user.balance.toLocaleString()}`);
      return;
    }

    const confirmPurchase = window.confirm(
      `আপনি কি নিশ্চিতভাবে ${tier.name} প্যাকেজটি ৳${tier.investment.toLocaleString()} দিয়ে কিনতে চান?`
    );
    
    if (confirmPurchase) {
      setLoadingTier(tier.level);
      
      // Simulate API processing delay
      setTimeout(() => {
        const result = buyVIP(tier);
        setLoadingTier(null);
        alert(result.message);
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">VIP লেভেলসমূহ</h2>
        <p className="text-sm text-slate-500">প্যাকেজ কিনুন এবং আজই ইনকাম শুরু করুন</p>
      </div>

      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl flex justify-between items-center mb-4 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider mb-1">আপনার ব্যালেন্স</p>
          <h3 className="text-3xl font-black">৳ {user.balance.toLocaleString()}</h3>
        </div>
        <div className="bg-white/20 p-4 rounded-full relative z-10">
          <Wallet size={28} />
        </div>
      </div>

      <div className="grid gap-6">
        {VIP_TIERS.map((tier) => {
          const isCurrent = user.vipLevel === tier.level;
          const isLower = user.vipLevel > tier.level;
          const isLoading = loadingTier === tier.level;

          return (
            <div 
              key={tier.level} 
              className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 ${
                isCurrent ? 'border-blue-500 shadow-xl scale-[1.02] z-10' : 'border-slate-100 shadow-sm'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-5 py-1.5 rounded-bl-2xl text-[11px] font-bold flex items-center gap-1.5 z-20">
                  <Star size={12} fill="currentColor" /> বর্তমান প্ল্যান
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{tier.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">প্যাকেজ মূল্য</p>
                    <p className="text-2xl font-black text-blue-600">৳{tier.investment.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <FeatureBox label="দৈনিক ইনকাম" value={`৳${tier.dailyIncome}`} color="bg-emerald-50 text-emerald-700" />
                  <FeatureBox label="প্রতি টাস্ক" value={`৳${tier.perTaskIncome}`} color="bg-blue-50 text-blue-700" />
                  <FeatureBox label="দৈনিক টাস্ক" value={`${tier.dailyTasks} টি`} color="bg-indigo-50 text-indigo-700" />
                  <FeatureBox label="রেফার কমিশন" value="২% লাইফটাইম" color="bg-amber-50 text-amber-700" />
                </div>

                <button
                  disabled={isCurrent || isLower || isLoading}
                  onClick={() => handleUpgrade(tier)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                    isCurrent 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : isLower
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                        : 'bg-slate-900 text-white hover:bg-black'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : isCurrent ? (
                    <><Check size={20} /> প্যাকেজটি একটিভ আছে</>
                  ) : isLower ? (
                    'ইতিমধ্যে অতিক্রম করেছেন'
                  ) : (
                    'প্ল্যান কিনুন (Buy Now)'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-6"></div>
    </div>
  );
};

const FeatureBox: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className={`${color} p-3 rounded-2xl border flex flex-col items-center text-center`}>
    <p className="text-[10px] uppercase font-bold opacity-70 mb-0.5">{label}</p>
    <p className="text-base font-black">{value}</p>
  </div>
);

export default VIP;
