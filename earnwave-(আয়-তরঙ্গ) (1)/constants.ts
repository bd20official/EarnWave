
import { VIPLevel, VIPTier, Task } from './types';

export const VIP_TIERS: VIPTier[] = [
  {
    level: VIPLevel.VIP1,
    name: 'VIP 1',
    investment: 2000,
    dailyIncome: 80,
    dailyTasks: 4,
    perTaskIncome: 20
  },
  {
    level: VIPLevel.VIP2,
    name: 'VIP 2',
    investment: 5000,
    dailyIncome: 220,
    dailyTasks: 5,
    perTaskIncome: 44
  },
  {
    level: VIPLevel.VIP3,
    name: 'VIP 3',
    investment: 10000,
    dailyIncome: 500,
    dailyTasks: 5,
    perTaskIncome: 100
  },
  {
    level: VIPLevel.VIP4,
    name: 'VIP 4',
    investment: 25000,
    dailyIncome: 1300,
    dailyTasks: 10,
    perTaskIncome: 130
  }
];

export const TASKS: Task[] = [
  { id: '1', title: 'পপুলার মিউজিক ১', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 30, reward: 0 },
  { id: '2', title: 'লেটেস্ট হিটস ২', imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 30, reward: 0 },
  { id: '3', title: 'ক্লাসিকাল টিউন ৩', imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 30, reward: 0 },
  { id: '4', title: 'রিল্যাক্সিং মেলোডি ৪', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 30, reward: 0 },
  { id: '5', title: 'মর্নিং ভাইবস ৫', imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: 30, reward: 0 },
  { id: '6', title: 'ইভনিং স্পেশাল ৬', imageUrl: 'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: 30, reward: 0 },
  { id: '7', title: 'অ্যাকুস্টিক সেশন ৭', imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', duration: 30, reward: 0 },
  { id: '8', title: 'জ্যাজ নাইট ৮', imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', duration: 30, reward: 0 },
  { id: '9', title: 'পপ চার্টবাস্টার ৯', imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', duration: 30, reward: 0 },
  { id: '10', title: 'রক অ্যান্থেম ১০', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1000&auto=format&fit=crop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', duration: 30, reward: 0 },
];

export const MIN_WITHDRAWAL = 300;
export const WITHDRAW_OPTIONS = [300, 500, 1000, 5000, 10000, 20000];
