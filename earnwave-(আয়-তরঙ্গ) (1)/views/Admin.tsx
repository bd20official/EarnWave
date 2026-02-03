
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, CreditCard, ShieldAlert, Check, X, Ban, UserCheck, PlaySquare, Save, Trash2, Plus, Edit3, Search, ChevronDown, ChevronUp, UserPlus, Image as ImageIcon, Music } from 'lucide-react';
import { Task, User, VIPLevel } from '../types';

const Admin: React.FC = () => {
  const { users, transactions, tasks, approveTransaction, rejectTransaction, toggleBlockUser, updateTask, addTask, deleteTask, adminUpdateUser } = useApp();
  const [tab, setTab] = useState<'users' | 'requests' | 'tasks'>('requests');
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', imageUrl: '', audioUrl: '', reward: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const pendingRequests = transactions.filter(t => t.status === 'pending');
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  const handleAddTask = () => {
    if (!newTask.title || !newTask.imageUrl || !newTask.audioUrl) return alert("সব তথ্য দিন (শিরোনাম, ইমেজ লিঙ্ক এবং অডিও লিঙ্ক)");
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      imageUrl: newTask.imageUrl || '',
      audioUrl: newTask.audioUrl || '',
      duration: 30,
      reward: Number(newTask.reward) || 20
    };
    addTask(task);
    setNewTask({ title: '', imageUrl: '', audioUrl: '', reward: 20 });
  };

  const startEditing = (u: User) => {
    setEditingUserId(u.id);
    setEditForm({ balance: u.balance, vipLevel: u.vipLevel, name: u.name });
  };

  const saveUserChanges = (userId: string) => {
    adminUpdateUser(userId, editForm);
    setEditingUserId(null);
    alert("ইউজার তথ্য সফলভাবে আপডেট করা হয়েছে!");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setTab('requests')} 
          className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab === 'requests' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100'}`}
        >
          <CreditCard size={18} /> রিকুয়েস্ট ({pendingRequests.length})
        </button>
        <button 
          onClick={() => setTab('users')} 
          className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100'}`}
        >
          <Users size={18} /> ইউজার্স
        </button>
        <button 
          onClick={() => setTab('tasks')} 
          className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab === 'tasks' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100'}`}
        >
          <PlaySquare size={18} /> টাস্ক
        </button>
      </div>

      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100">
              <p className="text-slate-400">কোনো পেন্ডিং রিকুয়েস্ট নেই</p>
            </div>
          ) : (
            pendingRequests.map(tx => {
              const u = users.find(usr => usr.id === tx.userId);
              return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${tx.type === 'recharge' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {tx.type}
                      </span>
                      <h4 className="font-bold text-slate-800 mt-1">{u?.name} ({tx.method})</h4>
                      <p className="text-xs text-slate-500">নম্বর: {tx.accountNumber}</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">৳{tx.amount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveTransaction(tx.id)} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95 transition-all">
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => rejectTransaction(tx.id)} className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95 transition-all">
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="নাম বা মোবাইল নম্বর দিয়ে সার্চ করুন..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800">{u.name}</h4>
                      {u.role === 'admin' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">Admin</span>}
                    </div>
                    <p className="text-xs text-slate-500">{u.phone}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">৳{u.balance.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">VIP: {u.vipLevel}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><UserPlus size={8}/> {u.referralCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => editingUserId === u.id ? setEditingUserId(null) : startEditing(u)}
                      className={`p-2 rounded-lg transition-colors ${editingUserId === u.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => toggleBlockUser(u.id)}
                      className={`p-2 rounded-lg ${u.isBlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
                    >
                      {u.isBlocked ? <UserCheck size={18} /> : <Ban size={18} />}
                    </button>
                  </div>
                </div>

                {editingUserId === u.id && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ইউজার কন্ট্রোল প্যানেল</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 ml-1">ইউজারের নাম</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500"
                          value={editForm.name}
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 ml-1">ব্যালেন্স পরিবর্তন</label>
                        <input 
                          type="number" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 font-bold text-blue-600"
                          value={editForm.balance}
                          onChange={e => setEditForm({...editForm, balance: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 ml-1">VIP লেভেল সেট করুন</label>
                      <div className="grid grid-cols-5 gap-2 mt-1">
                        {[0, 1, 2, 3, 4].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setEditForm({...editForm, vipLevel: lvl})}
                            className={`py-2 rounded-lg text-xs font-bold border transition-all ${editForm.vipLevel === lvl ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}
                          >
                            VIP {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => saveUserChanges(u.id)}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      সেভ করুন
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Plus size={18}/> নতুন মিউজিক টাস্ক যোগ করুন</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="টাস্ক শিরোনাম (যেমন: অমুক গান শুনুন)" 
                className="w-full p-3 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="ইমেজ URL (কভার ফটো)" 
                  className="w-full p-3 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.imageUrl}
                  onChange={e => setNewTask({...newTask, imageUrl: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="অডিও/MP3 URL (গানের লিঙ্ক)" 
                  className="w-full p-3 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.audioUrl}
                  onChange={e => setNewTask({...newTask, audioUrl: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 ml-1">পুরস্কার (টাকা)</label>
                  <input 
                    type="number" 
                    placeholder="পুরস্কার" 
                    className="w-full p-3 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTask.reward}
                    onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})}
                  />
                </div>
                <button 
                  onClick={handleAddTask}
                  className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                >
                  যোগ করুন
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 ml-1">বর্তমান টাস্কসমূহ</h3>
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden border relative">
                      <img src={task.imageUrl} className="w-full h-full object-cover" />
                      <Music size={10} className="absolute bottom-1 right-1 text-white bg-blue-600 rounded-full p-0.5" />
                    </div>
                    <input 
                      type="text" 
                      className="font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-blue-300 focus:outline-none w-full"
                      value={task.title}
                      onChange={e => updateTask(task.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <input 
                    type="text" 
                    placeholder="ইমেজ URL"
                    className="w-full text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border-none focus:ring-1 focus:ring-blue-400 outline-none"
                    value={task.imageUrl}
                    onChange={e => updateTask(task.id, { imageUrl: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="অডিও URL"
                    className="w-full text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border-none focus:ring-1 focus:ring-blue-400 outline-none"
                    value={task.audioUrl}
                    onChange={e => updateTask(task.id, { audioUrl: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">পুরস্কার: ৳</span>
                    <input 
                      type="number" 
                      className="w-20 p-1 border-b border-slate-200 font-bold text-blue-600 focus:outline-none"
                      value={task.reward}
                      onChange={e => updateTask(task.id, { reward: Number(e.target.value) })}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">ID: {task.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
