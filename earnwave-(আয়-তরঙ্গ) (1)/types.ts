
export enum VIPLevel {
  NONE = 0,
  VIP1 = 1,
  VIP2 = 2,
  VIP3 = 3,
  VIP4 = 4
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  pin: string;
  balance: number;
  vipLevel: VIPLevel;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  referralCount: number;
  tasksCompletedToday: number;
  lastTaskDate?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
}

export interface VIPTier {
  level: VIPLevel;
  name: string;
  investment: number;
  dailyIncome: number;
  dailyTasks: number;
  perTaskIncome: number;
}

export interface Task {
  id: string;
  title: string;
  imageUrl: string;
  audioUrl?: string; // Added for background music
  duration: number; // seconds
  reward: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'recharge' | 'withdraw';
  method: 'bKash' | 'Nagad' | 'Rocket';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  accountNumber: string;
}
