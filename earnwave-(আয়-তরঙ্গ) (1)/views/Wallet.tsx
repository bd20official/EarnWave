
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MIN_WITHDRAWAL, WITHDRAW_OPTIONS } from '../constants';
import { 
  PlusCircle, 
  MinusCircle, 
  History, 
  Smartphone, 
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Copy
} from 'lucide-react';

const Wallet: React.FC = () => {
  const { user, transactions, requestRecharge, requestWithdraw } = useApp();
  const [view, setView] = useState<'main' | 'recharge' | 'withdraw'>('main');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [account, setAccount] = useState('');

  if (!user) return null;

  const PAYMENT_NUMBERS = {
    bKash: '01876206197',
    Nagad: '01935864750',
    Rocket: '01876206197' // Fallback or placeholder
  };

  const currentPaymentNumber = PAYMENT_NUMBERS[method];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentPaymentNumber);
    alert(`${method} নম্বরটি কপি করা হয়েছে!`);
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !account) return;
    requestRecharge(Number(amount), method, account);
    alert("রিচার্জ রিকুয়েস্ট পাঠানো হয়েছে। অ্যাডমিন অ্যাপ্রুভ করলে ব্যালেন্স যোগ হবে।");
    setView('main');
    setAmount('');
    setAccount('');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return alert("দয়া করে উত্তোলনের পরিমাণ সিলেক্ট করুন!");
    
    const amt = Number(amount);
    if (amt < MIN_WITHDRAWAL) return alert(`নূন্যতম উত্তোলন ৳${MIN_WITHDRAWAL}`);
    
    const success = requestWithdraw(amt, method, account);
    if (success) {
      alert("উত্তোলন রিকুয়েস্ট সফল হয়েছে। ২৪ ঘণ্টার মধ্যে পেমেন্ট পাবেন।");
      setView('main');
      setAmount('');
      setAccount('');
    } else {
      alert("আপনার ব্যালেন্স পর্যাপ্ত নয়!");
    }
  };

  if (view === 'recharge' || view === 'withdraw') {
    const isRecharge = view === 'recharge';
    return (
      <div className="space-y-6">
        <button onClick={() => setView('main')} className="text-blue-600 font-bold text-sm mb-4 flex items-center gap-1">← ফিরে যান</button>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6">{isRecharge ? 'টাকা জমা দিন (Recharge)' : 'টাকা উত্তোলন করুন (Withdraw)'}</h2>
          
          {isRecharge && (
            <div className="bg-blue-50 p-5 rounded-2xl mb-6 text-sm border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Smartphone size={16} /> পেমেন্ট ইন্সট্রাকশন:
              </p>
              <ol className="list-decimal ml-5 text-blue-700 space-y-2 mb-4">
                <li>নিচে আপনার পছন্দের মাধ্যম নির্বাচন করুন।</li>
                <li>নিচের নম্বরে <b>"Send Money"</b> করুন।</li>
                <li>টাকা পাঠানোর পর ট্রানজেকশন আইডি বা যে নম্বর থেকে পাঠিয়েছেন সেটি নিচে দিন।</li>
              </ol>
              
              <div className="bg-white p-4 rounded-xl border border-blue-200 flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">{method} Personal Number</p>
                  <p className="text-lg font-black text-blue-900 tracking-wider">{currentPaymentNumber}</p>
                </div>
                <button 
                  onClick={handleCopyNumber}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md flex items-center gap-2 text-xs font-bold"
                >
                  <Copy size={16} /> কপি করুন
                </button>
              </div>
            </div>
          )}

          <form onSubmit={isRecharge ? handleRecharge : handleWithdraw} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">মাধ্যম নির্বাচন করুন</label>
              <div className="grid grid-cols-3 gap-3">
                {['bKash', 'Nagad', 'Rocket'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m as any)}
                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${method === m ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                {isRecharge ? 'পরিমাণ (Amount)' : 'উত্তোলনের পরিমাণ সিলেক্ট করুন'}
              </label>
              
              {isRecharge ? (
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {WITHDRAW_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAmount(opt.toString())}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        amount === opt.toString() 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200'
                      }`}
                    >
                      ৳{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                {isRecharge ? 'ট্রানজেকশন ID অথবা প্রেরক নম্বর' : 'আপনার পার্সোনাল নম্বর'}
              </label>
              <input
                type="text"
                placeholder={isRecharge ? "TxnID / 01XXXXXXXXX" : "01XXXXXXXXX"}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={!amount || !account}
              className={`w-full py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all mt-4 ${
                (!amount || !account) ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRecharge ? 'রিচার্জ রিকুয়েস্ট সাবমিট করুন' : 'উত্তোলন রিকুয়েস্ট পাঠান'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <CreditCard className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
        <p className="text-white/70 text-sm font-medium mb-1">মোট উপলব্ধ ব্যালেন্স</p>
        <h2 className="text-4xl font-black mb-8">৳ {user.balance.toFixed(2)}</h2>
        
        <div className="flex gap-4">
          <button 
            onClick={() => { setView('recharge'); setAmount(''); }}
            className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:bg-slate-50"
          >
            <PlusCircle size={18} /> রিচার্জ
          </button>
          <button 
            onClick={() => { setView('withdraw'); setAmount(''); }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:bg-blue-700"
          >
            <MinusCircle size={18} /> উত্তোলন
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <History size={18} /> ট্রানজেকশন হিস্ট্রি
        </h3>
        {transactions.filter(t => t.userId === user.id).length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
            <p className="text-slate-400">এখনো কোনো লেনদেন নেই</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {transactions.filter(t => t.userId === user.id).map(tx => (
              <div key={tx.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'recharge' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {tx.type === 'recharge' ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{tx.type === 'recharge' ? 'রিচার্জ' : 'উত্তোলন'} ({tx.method})</p>
                    <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === 'recharge' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === 'recharge' ? '+' : '-'} ৳{tx.amount}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {tx.status === 'pending' && <><Clock size={10} className="text-amber-500" /><span className="text-[10px] text-amber-500 font-bold">পেন্ডিং</span></>}
                    {tx.status === 'approved' && <><CheckCircle2 size={10} className="text-emerald-500" /><span className="text-[10px] text-emerald-500 font-bold">সফল</span></>}
                    {tx.status === 'rejected' && <><XCircle size={10} className="text-rose-500" /><span className="text-[10px] text-rose-500 font-bold">বাতিল</span></>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
