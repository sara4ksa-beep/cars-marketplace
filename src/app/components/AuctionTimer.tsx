'use client';

import { useState, useEffect } from 'react';

interface AuctionTimerProps {
  endDate: Date | string | null;
  onEnd?: () => void;
  className?: string;
}

export default function AuctionTimer({
  endDate,
  onEnd,
  className = '',
}: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endDate) {
      setIsEnded(true);
      return;
    }

    const end = new Date(endDate).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);

      setTimeRemaining(remaining);

      if (remaining === 0 && !isEnded) {
        setIsEnded(true);
        if (onEnd) onEnd();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, onEnd, isEnded]);

  if (isEnded || !endDate) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 space-x-reverse ${className}`}
      >
        <div className="bg-red-100 border-2 border-red-300 rounded-xl px-4 py-2">
          <span className="text-red-700 font-bold text-sm md:text-base flex items-center">
            <i className="fas fa-times-circle ml-2"></i>
            انتهى المزاد
          </span>
        </div>
      </div>
    );
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const isUrgent = timeRemaining < 3600000; // Less than 1 hour
  const isVeryUrgent = timeRemaining < 300000; // Less than 5 minutes

  return (
    <div
      className={`flex items-center justify-center space-x-2 space-x-reverse ${className}`}
    >
      <div className="flex items-center space-x-2 space-x-reverse">
        {days > 0 && (
          <div className={`flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold transition-all duration-300 ${
            isUrgent 
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
          }`}>
            <span className="text-lg md:text-xl">{days}</span>
            <span className="text-xs opacity-90">يوم</span>
          </div>
        )}
        <div className={`flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold transition-all duration-300 ${
          isUrgent 
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        } ${isVeryUrgent ? 'animate-pulse' : ''}`}>
          <span className="text-lg md:text-xl">{hours.toString().padStart(2, '0')}</span>
          <span className="text-xs opacity-90">ساعة</span>
        </div>
        <div className={`flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold transition-all duration-300 ${
          isUrgent 
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        } ${isVeryUrgent ? 'animate-pulse' : ''}`}>
          <span className="text-lg md:text-xl">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs opacity-90">دقيقة</span>
        </div>
        <div className={`flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold transition-all duration-300 ${
          isUrgent 
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        } ${isVeryUrgent ? 'animate-pulse scale-110' : ''}`}>
          <span className="text-lg md:text-xl">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs opacity-90">ثانية</span>
        </div>
      </div>
      {isUrgent && (
        <div className="mr-2">
          <i className={`fas fa-exclamation-triangle text-red-500 ${isVeryUrgent ? 'animate-pulse text-2xl' : 'text-lg'}`}></i>
        </div>
      )}
    </div>
  );
}

