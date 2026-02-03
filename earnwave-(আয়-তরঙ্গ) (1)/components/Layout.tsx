
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Zap, 
  Wallet, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut,
  PlaySquare,
  MessageCircle
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useApp();

  if (!user) return <>{children}</>;

  const TELEGRAM_LINK = "https://t.me/earnwavebd3";

  const navItems = [
    { id: 'dashboard', label: 'হোম', icon: <Home size={20} /> },
    { id: 'tasks', label: 'টাস্ক', icon: <PlaySquare size={20} /> },
    { id: 'vip', label: 'ভিআইপি', icon: <Zap size={20} /> },
    { id: 'wallet', label: 'ওয়ালেট', icon: <Wallet size={20} /> },
    { id: 'profile', label: 'প্রোফাইল', icon: <UserIcon size={20} /> },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', label: 'অ্যাডমিন', icon: <ShieldCheck size={20} /> });
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">EarnWave <span className="text-sm font-normal">(আয়-তরঙ্গ)</span></h1>
          <div className="flex items-center gap-3">
            <a 
              href={TELEGRAM_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors"
            >
              <MessageCircle size={18} />
            </a>
            <div className="text-right border-l border-white/20 pl-3">
              <p className="text-xs opacity-80">ব্যালেন্স</p>
              <p className="text-sm font-bold">৳ {user.balance.toLocaleString()}</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Floating Telegram Button */}
      <a 
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 bg-[#229ED9] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-40 border-4 border-white animate-bounce"
      >
        <MessageCircle size={24} fill="currentColor" />
      </a>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 shadow-lg z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-500'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
