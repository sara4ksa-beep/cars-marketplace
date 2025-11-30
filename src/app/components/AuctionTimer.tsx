'use client';

import { useState, useEffect } from 'react';

interface AuctionTimerProps {
  endDate: Date | string | null;
  startDate?: Date | string | null;
  onEnd?: () => void;
  className?: string;
}

export default function AuctionTimer({
  endDate,
  startDate,
  onEnd,
  className = '',
}: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!endDate) {
      setIsEnded(false);
      setHasStarted(false);
      return;
    }

    const end = new Date(endDate).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;

    const updateTimer = () => {
      const now = Date.now();
      
      // Check if auction has started
      if (start && start > now) {
        setHasStarted(false);
        setIsEnded(false);
        // Show time until start
        const timeUntilStart = Math.max(0, start - now);
        setTimeRemaining(timeUntilStart);
        return;
      }
      
      setHasStarted(true);
      
      // Check if auction has ended
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
  }, [endDate, startDate, onEnd, isEnded]);

  if (!endDate) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 space-x-reverse ${className}`}
      >
        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-4 py-2">
          <span className="text-yellow-700 font-bold text-sm md:text-base flex items-center">
            <i className="fas fa-clock ml-2"></i>
            لم يتم تحديد تاريخ النهاية
          </span>
        </div>
      </div>
    );
  }

  if (isEnded) {
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

  if (!hasStarted && startDate) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 space-x-reverse ${className}`}
      >
        <div className="bg-blue-100 border-2 border-blue-300 rounded-xl px-4 py-2">
          <span className="text-blue-700 font-bold text-sm md:text-base flex items-center">
            <i className="fas fa-hourglass-half ml-2"></i>
            يبدأ المزاد خلال:
          </span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          {Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) > 0 && (
            <div className="flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <span className="text-lg md:text-xl">{Math.floor(timeRemaining / (1000 * 60 * 60 * 24))}</span>
              <span className="text-xs opacity-90">يوم</span>
            </div>
          )}
          <div className="flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <span className="text-lg md:text-xl">{Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')}</span>
            <span className="text-xs opacity-90">ساعة</span>
          </div>
          <div className="flex flex-col items-center px-3 py-2 rounded-xl shadow-lg font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <span className="text-lg md:text-xl">{Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')}</span>
            <span className="text-xs opacity-90">دقيقة</span>
          </div>
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
      className={`flex items-center justify-center ${className}`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {days > 0 && (
          <div className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] py-3 md:py-4 rounded-lg font-mono transition-all duration-300 ${
            isUrgent 
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' 
              : 'bg-gray-900 text-white shadow-lg'
          }`}>
            <span className="text-2xl md:text-3xl font-bold leading-none">{days.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs mt-1 opacity-80 uppercase tracking-wide">يوم</span>
          </div>
        )}
        {days > 0 && (
          <span className="text-gray-400 text-xl md:text-2xl font-bold">:</span>
        )}
        <div className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] py-3 md:py-4 rounded-lg font-mono transition-all duration-300 ${
          isUrgent 
            ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' 
            : 'bg-gray-900 text-white shadow-lg'
        } ${isVeryUrgent ? 'animate-pulse' : ''}`}>
          <span className="text-2xl md:text-3xl font-bold leading-none">{hours.toString().padStart(2, '0')}</span>
          <span className="text-[10px] md:text-xs mt-1 opacity-80 uppercase tracking-wide">ساعة</span>
        </div>
        <span className="text-gray-400 text-xl md:text-2xl font-bold">:</span>
        <div className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] py-3 md:py-4 rounded-lg font-mono transition-all duration-300 ${
          isUrgent 
            ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' 
            : 'bg-gray-900 text-white shadow-lg'
        } ${isVeryUrgent ? 'animate-pulse' : ''}`}>
          <span className="text-2xl md:text-3xl font-bold leading-none">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-[10px] md:text-xs mt-1 opacity-80 uppercase tracking-wide">دقيقة</span>
        </div>
        <span className="text-gray-400 text-xl md:text-2xl font-bold">:</span>
        <div className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] py-3 md:py-4 rounded-lg font-mono transition-all duration-300 ${
          isUrgent 
            ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' 
            : 'bg-gray-900 text-white shadow-lg'
        } ${isVeryUrgent ? 'animate-pulse scale-105' : ''}`}>
          <span className="text-2xl md:text-3xl font-bold leading-none">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-[10px] md:text-xs mt-1 opacity-80 uppercase tracking-wide">ثانية</span>
        </div>
      </div>
    </div>
  );
}







