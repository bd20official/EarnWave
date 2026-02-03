
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import VIP from './views/VIP';
import Tasks from './views/Tasks';
import Wallet from './views/Wallet';
import Admin from './views/Admin';
import Layout from './components/Layout';
import { ChevronLeft, Save, ShieldAlert, Lock, User as UserIcon, MessageCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, changePin, deleteAccount } = useApp();
  const [subView, setSubView] = useState<'main' | 'edit' | 'password' | 'delete'>('main');
  
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pinForm, setPinForm] = useState({ current: '', new: '', confirm: '' });
  const [deletePin, setDeletePin] = useState('');

  if (!user) return null;

  const TELEGRAM_LINK = "https://t.me/earnwavebd3";

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm.name, editForm.email);
    alert("প্রোফাইল আপডেট করা হয়েছে!");
    setSubView('main');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinForm.new !== pinForm.confirm) return alert("নতুন পিন এবং কনফার্ম পিন মেলেনি!");
    if (pinForm.new.length < 4) return alert("পিন কমপক্ষে ৪ সংখ্যার হতে হবে!");
    
    const res = changePin(pinForm.current, pinForm.new);
    if (res.success) {
      alert(res.message);
      setSubView('main');
      setPinForm({ current: '', new: '', confirm: '' });
    } else {
      alert(res.message);
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টটি ডিলিট করতে চান? আপনার ব্যালেন্স ও সব তথ্য মুছে যাবে!")) return;
    
    const res = deleteAccount(deletePin);
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  if (subView === 'edit') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSubView('main')} className="flex items-center gap-1 text-blue-600 font-bold mb-6"><ChevronLeft size={18}/> ফিরে যান</button>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserIcon size={20} className="text-blue-600" /> ব্যক্তিগত তথ্য পরিবর্তন</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">আপনার নাম</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={editForm.name}
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">ইমেইল ঠিকানা</label>
            <input 
              type="email" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={editForm.email}
              onChange={e => setEditForm({...editForm, email: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Save size={18} /> আপডেট করুন
          </button>
        </form>
      </div>
    );
  }

  if (subView === 'password') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSubView('main')} className="flex items-center gap-1 text-blue-600 font-bold mb-6"><ChevronLeft size={18}/> ফিরে যান</button>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock size={20} className="text-blue-600" /> পিন (পাসওয়ার্ড) পরিবর্তন</h3>
        <form onSubmit={handleChangePin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">বর্তমান পিন</label>
            <input 
              type="password" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={pinForm.current}
              onChange={e => setPinForm({...pinForm, current: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1">নতুন পিন</label>
              <input 
                type="password" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={pinForm.new}
                onChange={e => setPinForm({...pinForm, new: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1">নিশ্চিত করুন</label>
              <input 
                type="password" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={pinForm.confirm}
                onChange={e => setPinForm({...pinForm, confirm: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Save size={18} /> পিন সেট করুন
          </button>
        </form>
      </div>
    );
  }

  if (subView === 'delete') {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSubView('main')} className="flex items-center gap-1 text-blue-600 font-bold mb-6"><ChevronLeft size={18}/> ফিরে যান</button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">অ্যাকাউন্ট ডিলিট করুন</h3>
          <p className="text-sm text-slate-500 mt-2">অ্যাকাউন্ট ডিলিট করলে আপনার ব্যালেন্স ও রেফারেল বোনাস চিরতরে হারিয়ে যাবে।</p>
        </div>
        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">অ্যাকাউন্ট পিন দিন</label>
            <input 
              type="password" 
              className="w-full p-4 bg-slate-50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-center"
              value={deletePin}
              onChange={e => setDeletePin(e.target.value)}
              placeholder="আপনার ৪ সংখ্যার পিন"
              required
            />
          </div>
          <button type="submit" className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
            স্থায়ীভাবে ডিলিট করুন
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
        {user.name.charAt(0)}
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
      <p className="text-slate-500 mb-6">{user.phone}</p>
      
      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">VIP লেভেল</p>
          <p className="font-bold text-slate-800">{user.vipLevel > 0 ? `Level ${user.vipLevel}` : 'প্যাকেজ নেই'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">অ্যাকাউন্ট টাইপ</p>
          <p className="font-bold text-slate-800 uppercase">{user.role}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
         <a 
           href={TELEGRAM_LINK}
           target="_blank"
           rel="noopener noreferrer"
           className="w-full text-left p-4 bg-blue-50 text-blue-700 rounded-xl font-bold flex justify-between items-center hover:bg-blue-100 transition-all active:scale-95"
         >
           অফিসিয়াল টেলিগ্রাম চ্যানেল <MessageCircle size={18} className="text-blue-600" />
         </a>
         <button 
           onClick={() => setSubView('edit')}
           className="w-full text-left p-4 bg-slate-50 rounded-xl font-bold flex justify-between items-center hover:bg-slate-100 transition-all active:scale-95"
         >
           ব্যক্তিগত তথ্য <span className="text-blue-600">পরিবর্তন করুন ›</span>
         </button>
         <button 
           onClick={() => setSubView('password')}
           className="w-full text-left p-4 bg-slate-50 rounded-xl font-bold flex justify-between items-center hover:bg-slate-100 transition-all active:scale-95"
         >
           পাসওয়ার্ড (পিন) <span className="text-blue-600">পরিবর্তন করুন ›</span>
         </button>
         <button 
           onClick={() => setSubView('delete')}
           className="w-full text-left p-4 bg-rose-50 text-rose-600 rounded-xl font-bold flex justify-between items-center hover:bg-rose-100 transition-all active:scale-95"
         >
           অ্যাকাউন্ট ডিলিট <span>চিরতরে মুছুন ›</span>
         </button>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useApp();
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ew_active_tab') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('ew_active_tab', activeTab);
  }, [activeTab]);

  if (!user) return <Auth />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'vip': return <VIP />;
      case 'wallet': return <Wallet />;
      case 'profile': return <Profile />;
      case 'admin': return <Admin />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderContent()}
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
