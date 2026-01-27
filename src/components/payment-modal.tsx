'use client';

import { useState } from 'react';
import { CreditCard, Loader2, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, onConfirm, amount }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      // Keep modal open or let parent handle closing after success
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          disabled={isProcessing}
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white">Confirm Payment</h3>
          <p className="text-zinc-400 text-sm mt-1">
            You are about to launch a campaign with a daily budget of <span className="text-white font-bold">{amount} AED</span>.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors ring-1 ring-blue-500/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">VISA</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">•••• 4242</p>
                <p className="text-[10px] text-zinc-500">Expires 12/25</p>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </div>
          
          <Button variant="ghost" className="w-full text-xs text-zinc-400 hover:text-white">
            + Add new payment method
          </Button>
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleConfirm} 
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
          >
            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : `Pay & Launch`}
          </Button>
        </div>
      </div>
    </div>
  );
}