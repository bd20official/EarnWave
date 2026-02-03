
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Mail, User, Lock, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    refCode: ''
  });
  const { login, register } = useApp();

  // Auto-detect referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !isLogin) {
      setFormData(prev => ({ ...prev, refCode: ref }));
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.phone, formData.pin);
      if (!success) {
         // Error handled inside login (wrong pin vs not found)
      }
    } else {
      if (!formData.name || !formData.phone || !formData.pin) return alert("সব তথ্য পূরণ করুন!");
      await register(formData.name, formData.phone, formData.email, formData.refCode, formData.pin);
      setIsLogin(true);
      alert("রেজিস্ট্রেশন সফল! এখন লগইন করুন।");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
            EW
          </div>
          <h1 className="text-2xl font-bold text-slate-800">EarnWave</h1>
          <p className="text-slate-500">{isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}</p>
        </div>

        {!isLogin && formData.refCode && (
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-bold mb-4 animate-in fade-in slide-in-from-top-1">
            <UserPlus size={14} /> রেফারেল কোড '{formData.refCode}' প্রয়োগ করা হয়েছে
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="পুরো নাম"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="relative">
            <Smartphone className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="tel"
              placeholder="মোবাইল নম্বর"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="ইমেইল (ঐচ্ছিক)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type={showPin ? "text" : "password"}
              placeholder="পিন (Password)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pin}
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <ArrowRight className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="রেফার কোড (যদি থাকে)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.refCode}
                onChange={(e) => setFormData({...formData, refCode: e.target.value})}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
          >
            {isLogin ? 'লগইন করুন' : 'রেজিস্ট্রেশন করুন'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? (
            <p>অ্যাকাউন্ট নেই? <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold">এখানে ক্লিক করুন</button></p>
          ) : (
            <p>ইতিমধ্যেই অ্যাকাউন্ট আছে? <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold">লগইন করুন</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
