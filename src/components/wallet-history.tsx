'use client';

import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  Receipt 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: string;
  previousBalance: number;
  newBalance: number;
}

interface WalletHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function WalletHistory({ transactions, isLoading }: WalletHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-[2rem] bg-zinc-900/30 border border-dashed border-white/10 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <Receipt className="h-6 w-6 text-zinc-500" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">No Transactions</h4>
        <p className="text-xs text-zinc-500 mt-1">Your wallet activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const isDebit = tx.type === 'debit';
        return (
          <div 
            key={tx.id}
            className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border",
                isDebit 
                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              )}>
                {isDebit ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-black tracking-tight",
                isDebit ? "text-white" : "text-emerald-400"
              )}>
                {isDebit ? '-' : '+'}{tx.amount.toLocaleString()} AED
              </p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                Bal: {tx.newBalance.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}