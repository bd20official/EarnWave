
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { VIP_TIERS } from '../constants';
import { Music, CheckCircle2, AlertCircle, Clock, Lock, CreditCard, ChevronLeft, Music2, Volume2 } from 'lucide-react';

const Tasks: React.FC = () => {
  const { user, tasks: allTasks, completeTask, getBDDate } = useApp();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isWatching, setIsWatching] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!user) return null;
  const currentTier = VIP_TIERS.find(t => t.level === user.vipLevel);
  const isVip = user.vipLevel > 0;
  
  // Calculate specific tasks for this user based on their limit and current date
  // This ensures the task list feels "fresh" every day
  const dailyUserTasks = useMemo(() => {
    if (!isVip || !currentTier) return [];
    
    const todayStr = getBDDate();
    // Simple deterministic shuffle based on date string
    const seed = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Sort all available tasks by an ID that includes the seed
    const shuffled = [...allTasks].sort((a, b) => {
      const hashA = (parseInt(a.id) * seed) % 100;
      const hashB = (parseInt(b.id) * seed) % 100;
      return hashA - hashB;
    });

    // Return exactly the number of tasks allowed for this VIP level
    return shuffled.slice(0, currentTier.dailyTasks);
  }, [allTasks, isVip, currentTier, getBDDate]);

  const canDoMoreTasks = isVip && user.tasksCompletedToday < dailyUserTasks.length;

  const closeTask = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveTask(null);
    setIsWatching(false);
    setTimeLeft(30);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (activeTask) {
        closeTask();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTask, closeTask]);

  useEffect(() => {
    let timer: any;
    if (isWatching && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      
      if (audioRef.current && timeLeft === 30) {
        audioRef.current.play().catch(e => console.log("Auto-play blocked, interaction needed"));
      }
    } else if (timeLeft === 0 && isWatching) {
      if (window.history.state === 'task-active') {
        window.history.back();
      }
      
      completeTask(activeTask.reward || currentTier?.perTaskIncome || 0);
      closeTask();
      alert("মিউজিক টাস্ক সফলভাবে সম্পন্ন হয়েছে! আপনার ব্যালেন্সে টাকা যোগ হয়েছে।");
    }
    return () => clearInterval(timer);
  }, [isWatching, timeLeft, completeTask, currentTier, activeTask, closeTask]);

  const startTask = (task: any) => {
    if (!isVip) return alert("টাস্ক করতে হলে অবশ্যই VIP প্ল্যান থাকতে হবে!");
    if (!canDoMoreTasks) return alert("আপনার আজকের লিমিট শেষ হয়ে গেছে!");
    
    window.history.pushState('task-active', '');
    setActiveTask(task);
    setTimeLeft(30);
    setIsWatching(true);
  };

  const handleManualBack = () => {
    if (window.confirm("টাস্কটি বাতিল করতে চান? ইনকাম পাবেন না!")) {
      window.history.back();
    }
  };

  if (activeTask) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col">
        <audio ref={audioRef} src={activeTask.audioUrl} preload="auto" />

        <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center">
          <button onClick={handleManualBack} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
             <h3 className="font-bold text-slate-800 text-sm">{activeTask.title}</h3>
             <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                <Music size={10} className="animate-bounce" /> গান বাজছে...
             </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-full text-white font-mono font-bold shadow-md">
            <Clock size={16} /> 00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
          </div>

          <div className="relative w-full max-w-sm aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700/50 z-10">
            <img 
              src={activeTask.imageUrl} 
              alt="Song Cover"
              className="w-full h-full object-cover transition-transform duration-[30s] scale-110"
              style={{ transform: isWatching ? 'scale(1.3) rotate(2deg)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
               <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Music2 className="text-white animate-pulse" size={40} />
               </div>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-center gap-1 h-12 z-10">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div 
                key={i} 
                className="w-1.5 bg-blue-500 rounded-full transition-all duration-300"
                style={{ 
                  height: isWatching ? `${Math.random() * 100}%` : '10%',
                  animation: isWatching ? `music-bar 0.8s ease-in-out infinite alternate ${i * 0.1}s` : 'none'
                }}
              ></div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-white/70 text-sm font-medium z-10">
             <Volume2 size={16} /> গানটি ৩০ সেকেন্ড শুনুন
          </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-100 text-center">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner mb-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear" 
              style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs font-bold text-slate-500">টাস্ক সম্পন্ন হতে আরও {timeLeft} সেকেন্ড বাকি</p>
        </div>

        <style>{`
          @keyframes music-bar {
            0% { height: 20%; }
            100% { height: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (!isVip) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <Lock size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">টাস্ক লক করা আছে</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            আপনার কোনো একটিভ ভিআইপি প্যাকেজ নেই। <br />
            টাস্ক করে আয় করতে হলে প্রথমে রিচার্জ করে একটি প্যাকেজ কিনুন।
          </p>
        </div>
        <div className="w-full space-y-3 pt-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-left">
            <AlertCircle className="text-amber-500 shrink-0" />
            <p className="text-xs font-bold">কোনো ডেমো বা ফ্রি ইনকাম এই অ্যাপে সাপোর্ট করা হয় না।</p>
          </div>
          <button 
             onClick={() => alert("নিচের 'ওয়ালেট' মেনু থেকে রিচার্জ করুন এবং 'ভিআইপি' মেনু থেকে প্যাকেজ কিনুন।")}
             className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <CreditCard size={18} /> রিচার্জ করতে ওয়ালেটে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">আজকের মিউজিক টাস্ক</h2>
          <p className="text-sm text-slate-500">লিমিট: {user.tasksCompletedToday} / {dailyUserTasks.length}</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50">
          <span className="font-bold text-blue-600">{Math.round((user.tasksCompletedToday / (dailyUserTasks.length || 1)) * 100)}%</span>
        </div>
      </div>

      {!canDoMoreTasks && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
          <CheckCircle2 className="text-emerald-500" />
          <p className="text-sm font-bold">অভিনন্দন! আপনার আজকের সব টাস্ক সম্পন্ন হয়েছে।</p>
        </div>
      )}

      <div className="grid gap-4">
        {dailyUserTasks.map((task, idx) => {
          const isDone = idx < user.tasksCompletedToday;
          return (
            <div key={task.id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 transition-all ${isDone ? 'opacity-60 border-slate-100' : 'border-slate-100 hover:shadow-md'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border ${isDone ? 'bg-slate-100' : 'bg-blue-50'}`}>
                {isDone ? <CheckCircle2 size={24} className="text-slate-400" /> : <div className="relative w-full h-full"><img src={task.imageUrl} className="w-full h-full object-cover opacity-80" /><Music size={12} className="absolute inset-0 m-auto text-blue-600" /></div>}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                <p className="text-xs text-slate-500 font-bold">পুরস্কার: ৳ {task.reward || currentTier?.perTaskIncome || 0}</p>
              </div>
              <button
                disabled={isDone || (idx !== user.tasksCompletedToday)}
                onClick={() => startTask(task)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  isDone 
                    ? 'bg-slate-100 text-slate-400' 
                    : (idx === user.tasksCompletedToday) 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? 'শেষ' : (idx === user.tasksCompletedToday ? 'প্লে করুন' : 'অপেক্ষায়')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
