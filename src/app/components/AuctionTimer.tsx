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
        <span className="text-red-600 font-bold text-sm md:text-base">
          <i className="fas fa-times-circle ml-1"></i>
          انتهى المزاد
        </span>
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

  return (
    <div
      className={`flex items-center justify-center space-x-2 space-x-reverse ${className} ${
        isUrgent ? 'text-red-600' : 'text-gray-700'
      }`}
    >
      <div className="flex items-center space-x-1 space-x-reverse">
        {days > 0 && (
          <div className="flex flex-col items-center bg-white/90 px-2 py-1 rounded-lg shadow-md">
            <span className="text-xs font-bold">{days}</span>
            <span className="text-xs text-gray-600">يوم</span>
          </div>
        )}
        <div className="flex flex-col items-center bg-white/90 px-2 py-1 rounded-lg shadow-md">
          <span className="text-xs font-bold">{hours.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-600">ساعة</span>
        </div>
        <div className="flex flex-col items-center bg-white/90 px-2 py-1 rounded-lg shadow-md">
          <span className="text-xs font-bold">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-600">دقيقة</span>
        </div>
        <div className="flex flex-col items-center bg-white/90 px-2 py-1 rounded-lg shadow-md">
          <span className="text-xs font-bold">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-600">ثانية</span>
        </div>
      </div>
      {isUrgent && (
        <i className="fas fa-exclamation-triangle animate-pulse"></i>
      )}
    </div>
  );
}

