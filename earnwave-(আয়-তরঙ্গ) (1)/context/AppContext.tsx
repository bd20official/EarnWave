
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, VIPLevel, Transaction, VIPTier, Task } from '../types';
import { VIP_TIERS, TASKS as INITIAL_TASKS } from '../constants';

interface AppContextType {
  user: User | null;
  users: User[];
  transactions: Transaction[];
  tasks: Task[];
  login: (phone: string, pin: string) => Promise<boolean>;
  register: (name: string, phone: string, email: string, refBy: string, pin: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  requestRecharge: (amount: number, method: any, accountNumber: string) => void;
  requestWithdraw: (amount: number, method: any, accountNumber: string) => boolean;
  completeTask: (reward: number) => void;
  buyVIP: (tier: VIPTier) => { success: boolean; message: string };
  getBDDate: () => string;
  changePin: (currentPin: string, newPin: string) => { success: boolean, message: string };
  updateProfile: (name: string, email: string) => void;
  deleteAccount: (pin: string) => { success: boolean, message: string };
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;
  toggleBlockUser: (id: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getBDDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const bdTime = new Date(utc + (3600000 * 6));
  return bdTime.toISOString().split('T')[0];
};

const INITIAL_USERS: User[] = [
  {
    id: 'admin_main',
    name: 'Main Admin',
    phone: '01786516131',
    email: 'arafat@earnwave.com',
    pin: 'arafat335',
    balance: 0,
    vipLevel: VIPLevel.VIP4,
    referralCode: 'BOSS335',
    referralEarnings: 0,
    referralCount: 0,
    tasksCompletedToday: 0,
    role: 'admin',
    isBlocked: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getSaved = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => getSaved('ew_users', INITIAL_USERS));
  const [tasks, setTasks] = useState<Task[]>(() => getSaved('ew_tasks', INITIAL_TASKS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => getSaved('ew_txs', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getSaved('ew_current_user', null));

  useEffect(() => {
    if (currentUser) {
      const today = getBDDate();
      if (currentUser.lastTaskDate !== today) {
        const updatedUser = { ...currentUser, tasksCompletedToday: 0, lastTaskDate: today };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      }
    }
  }, [currentUser?.id]); // Minimal dependency to prevent infinite loops

  useEffect(() => { localStorage.setItem('ew_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ew_txs', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ew_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ew_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ew_current_user');
    }
  }, [currentUser]);

  const login = async (phone: string, pin: string) => {
    const found = users.find(u => u.phone === phone);
    if (found) {
      if (found.pin !== pin) {
        alert("ভুল পিন নম্বর!");
        return false;
      }
      if (found.isBlocked) {
        alert("অ্যাকাউন্ট ব্লকড!");
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    alert("অ্যাকাউন্ট পাওয়া যায়নি!");
    return false;
  };

  const register = async (name: string, phone: string, email: string, refBy: string, pin: string) => {
    const exists = users.find(u => u.phone === phone);
    if (exists) { alert("নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে!"); return; }
    const referrer = refBy ? users.find(u => u.referralCode === refBy) : null;
    const newUser: User = {
      id: Date.now().toString(),
      name, phone, email, pin,
      balance: 0, vipLevel: VIPLevel.NONE,
      referralCode: Math.random().toString(36).substring(7).toUpperCase(),
      referredBy: referrer ? refBy : undefined,
      referralEarnings: 0, referralCount: 0, tasksCompletedToday: 0,
      lastTaskDate: getBDDate(), role: 'user', isBlocked: false
    };
    if (referrer) {
      setUsers(prev => prev.map(u => u.referralCode === refBy ? { ...u, referralCount: u.referralCount + 1 } : u));
    }
    setUsers(prev => [...prev, newUser]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const updateProfile = (name: string, email: string) => {
    updateUser({ name, email });
  };

  const changePin = (currentPin: string, newPin: string) => {
    if (!currentUser) return { success: false, message: "Error" };
    if (currentUser.pin !== currentPin) return { success: false, message: "বর্তমান পিনটি সঠিক নয়!" };
    updateUser({ pin: newPin });
    return { success: true, message: "পিন সফলভাবে পরিবর্তন করা হয়েছে!" };
  };

  const deleteAccount = (pin: string) => {
    if (!currentUser) return { success: false, message: "Error" };
    if (currentUser.pin !== pin) return { success: false, message: "পিনটি সঠিক নয়!" };
    const userId = currentUser.id;
    setCurrentUser(null);
    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true, message: "আপনার অ্যাকাউন্টটি ডিলিট করা হয়েছে।" };
  };

  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const requestRecharge = (amount: number, method: any, accountNumber: string) => {
    if (!currentUser) return;
    const tx: Transaction = { id: Date.now().toString(), userId: currentUser.id, amount, type: 'recharge', method, status: 'pending', date: new Date().toISOString(), accountNumber };
    setTransactions(prev => [tx, ...prev]);
  };

  const requestWithdraw = (amount: number, method: any, accountNumber: string) => {
    if (!currentUser) return false;
    
    const bal = Number(currentUser.balance);
    const amt = Number(amount);

    if (bal < amt) return false;

    // Deduct immediately
    const updatedUser = { ...currentUser, balance: bal - amt };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    const tx: Transaction = { id: Date.now().toString(), userId: currentUser.id, amount: amt, type: 'withdraw', method, status: 'pending', date: new Date().toISOString(), accountNumber };
    setTransactions(prev => [tx, ...prev]);
    return true;
  };

  const completeTask = (reward: number) => {
    if (!currentUser) return;
    const today = getBDDate();
    let tasksToday = currentUser.lastTaskDate === today ? currentUser.tasksCompletedToday : 0;
    const updatedUser = { ...currentUser, balance: currentUser.balance + reward, tasksCompletedToday: tasksToday + 1, lastTaskDate: today };
    
    if (currentUser.referredBy) {
      const commission = reward * 0.02;
      setUsers(prev => prev.map(u => u.referralCode === currentUser.referredBy ? { ...u, balance: u.balance + commission, referralEarnings: u.referralEarnings + commission } : u));
    }
    
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const buyVIP = (tier: VIPTier) => {
    if (!currentUser) return { success: false, message: "লগইন করুন!" };
    
    const bal = Number(currentUser.balance);
    const cost = Number(tier.investment);

    if (bal < cost) {
      return { success: false, message: "অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!" };
    }

    if (currentUser.vipLevel === tier.level) {
      return { success: false, message: "এই প্যাকেজটি ইতিমধ্যে একটিভ আছে।" };
    }

    const updatedUser = { ...currentUser, balance: bal - cost, vipLevel: tier.level };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    return { success: true, message: `${tier.name} সফলভাবে একটিভ করা হয়েছে!` };
  };

  const approveTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    if (tx.type === 'recharge' && tx.status === 'pending') {
      const targetUser = users.find(u => u.id === tx.userId);
      if (targetUser) {
        const updatedUser = { ...targetUser, balance: targetUser.balance + tx.amount };
        setUsers(prev => prev.map(u => u.id === tx.userId ? updatedUser : u));
        if (currentUser?.id === tx.userId) setCurrentUser(updatedUser);
      }
    }
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };

  const rejectTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || tx.status !== 'pending') return;
    
    // Refund if withdraw is rejected
    if (tx.type === 'withdraw') {
      const targetUser = users.find(u => u.id === tx.userId);
      if (targetUser) {
        const updatedUser = { ...targetUser, balance: targetUser.balance + tx.amount };
        setUsers(prev => prev.map(u => u.id === tx.userId ? updatedUser : u));
        if (currentUser?.id === tx.userId) setCurrentUser(updatedUser);
      }
    }
    
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
  };

  const toggleBlockUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <AppContext.Provider value={{ 
      user: currentUser, users, transactions, tasks, login, register, logout, 
      updateUser, requestRecharge, requestWithdraw, completeTask, buyVIP, adminUpdateUser,
      approveTransaction, rejectTransaction, toggleBlockUser, updateTask, addTask, deleteTask,
      getBDDate, updateProfile, changePin, deleteAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
