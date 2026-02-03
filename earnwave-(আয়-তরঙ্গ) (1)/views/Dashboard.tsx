
import React from 'react';
import { useApp } from '../context/AppContext';
import { VIP_TIERS } from '../constants';
import { TrendingUp, Users, Wallet, CheckCircle, Share2, Copy, Lock, AlertTriangle, UserPlus, Share, MessageCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Fix: Use useApp hook directly to retrieve the current user and avoid typo 'userApp'
  const { user: currentUser } = useApp();
  
  if (!currentUser) return null;

  const TELEGRAM_LINK = "https://t.me/earnwavebd3";
  const currentTier = VIP_TIERS.find(t => t.level === currentUser.vipLevel);
  const hasVip = currentUser.vipLevel > 0;

  const copyReferral = () => {
    if (!hasVip) {
      alert("রেফার করতে হলে আগে একটি VIP প্যাকেজ কিনুন!");
      return;
    }
    navigator.clipboard.writeText(currentUser.referralCode);
    alert("রেফার কোড কপি করা হয়েছে!");
  };

  const handleShareLink = async () => {
    if (!hasVip) {
       alert("রেফার করতে হলে আগে একটি VIP প্যাকেজ কিনুন!");
       return;
    }
    
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const shareUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}?ref=${currentUser.referralCode}`;
    const shareText = `EarnWave এ জয়েন করুন এবং প্রতিদিন মিউজিক শুনে আয় করুন! আমার রেফার কোড: ${currentUser.referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EarnWave - অনলাইন ইনকাম',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback to copy if Web Share API is not available
      navigator.clipboard.writeText(shareUrl);
      alert("শেয়ার লিঙ্কটি কপি করা হয়েছে! এখন যেকোনো সোশ্যাল মিডিয়ায় পেস্ট করুন।");
    }
  };

  return (
    <div className="space-y-6">
      {!hasVip && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-800 shadow-sm animate-pulse">
          <AlertTriangle className="text-rose-500 shrink-0" size={20} />
          <p className="text-xs font-bold">ইনকাম শুরু করতে অবশ্যই একটি VIP প্যাকেজ একটিভ করতে হবে।</p>
        </div>
      )}

      {/* Telegram Banner */}
      <a 
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-sky-500 text-white p-4 rounded-2xl shadow-md flex items-center justify-between group active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <MessageCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm">অফিসিয়াল টেলিগ্রাম কমিউনিটি</h4>
            <p className="text-[10px] opacity-90">সব লেটেস্ট আপডেট ও পেমেন্ট প্রুফ এখানে পাবেন</p>
          </div>
        </div>
        <span className="bg-white text-sky-600 px-3 py-1 rounded-full text-[10px] font-bold">জয়েন করুন</span>
      </a>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">স্বাগতম, {currentUser.name}</h2>
            <p className="text-sm text-slate-500">{currentUser.vipLevel > 0 ? `আপনি বর্তমান ${currentTier?.name} মেম্বার` : 'কোনো VIP প্ল্যান নেই'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${currentUser.vipLevel > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
            {currentTier?.name || 'প্যাকেজ নেই'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-xs text-blue-600 font-medium mb-1">মোট ব্যালেন্স</p>
            <h3 className="text-lg font-bold text-blue-900">৳ {currentUser.balance.toFixed(2)}</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <p className="text-xs text-emerald-600 font-medium mb-1">আজকের আয়</p>
            <h3 className="text-lg font-bold text-emerald-900">৳ {(currentUser.tasksCompletedToday * (currentTier?.perTaskIncome || 0)).toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<CheckCircle className="text-indigo-500" />} label="টাস্ক সম্পন্ন" value={`${currentUser.tasksCompletedToday} / ${currentTier?.dailyTasks || 0}`} />
        <StatCard icon={<UserPlus className="text-emerald-500" />} label="মোট রেফার" value={`${currentUser.referralCount} জন`} />
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={20} />
            <h3 className="font-bold">রেফার করে ২% কমিশন পান</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">বন্ধুদের ইনভাইট করুন এবং তাদের ইনকামের ২% বোনাস পান। আপনার বর্তমান রেফার আয়: ৳{currentUser.referralEarnings.toFixed(2)}</p>
          
          {hasVip ? (
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex justify-between items-center border border-white/30">
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold opacity-70">রেফার কোড</span>
                   <code className="font-mono text-lg font-bold">{currentUser.referralCode}</code>
                </div>
                <button onClick={copyReferral} className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all shadow-sm">
                  <Copy size={16} /> কপি
                </button>
              </div>
              <button 
                onClick={handleShareLink}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl text-sm font-bold transition-all border border-blue-300 shadow-md flex items-center justify-center gap-2"
              >
                <Share size={18} /> সোশ্যাল মিডিয়ায় শেয়ার করুন
              </button>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center border border-white/10 text-center">
              <Lock className="mb-2 opacity-50" size={32} />
              <p className="font-bold text-sm">রেফারেল সিস্টেমটি লক করা আছে</p>
              <p className="text-[10px] opacity-80 mt-1">রেফার করতে হলে নূন্যতম একটি VIP মেম্বারশিপ থাকতে হবে।</p>
            </div>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <TrendingUp size={18} /> রিসেন্ট এক্টিভিটি
        </h3>
        <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
          <p className="text-slate-400 text-sm">এখনো কোনো এক্টিভিটি নেই</p>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
    <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
