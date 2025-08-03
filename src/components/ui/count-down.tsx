'use client'
import React, { useEffect, useState } from 'react'

interface CountDownProps {
    eventDate: string;
    eventTime: string;
}

export const CountDown: React.FC<CountDownProps> = ({ eventDate, eventTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    });

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    useEffect(() => {
        if (!eventDate || !eventTime) return;

        const calculateTimeLeft = () => {
            const targetDateTime = new Date(`${eventDate}T${eventTime}`);
            const now = new Date();
            const difference = targetDateTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    expired: true
                });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({
                days,
                hours,
                minutes,
                seconds,
                expired: false
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [eventDate, eventTime]);

    if (!eventDate && !eventTime) return null;

    return (
        <div className="text-center">
            {timeLeft.expired ? (
                <div className="text-4xl font-bold text-red-400 mb-4">
                    🎉 Event Has Started! 🎉
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold tabular-nums bg-neutral-800 rounded-lg px-3 py-2 min-w-[80px]">
                            {formatNumber(timeLeft.days)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">DAYS</div>
                    </div>
                    <div className="text-2xl">:</div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold tabular-nums bg-neutral-800 rounded-lg px-3 py-2 min-w-[80px]">
                            {formatNumber(timeLeft.hours)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">HOURS</div>
                    </div>
                    <div className="text-2xl">:</div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold tabular-nums bg-neutral-800 rounded-lg px-3 py-2 min-w-[80px]">
                            {formatNumber(timeLeft.minutes)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">MINUTES</div>
                    </div>
                    <div className="text-2xl">:</div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold tabular-nums bg-neutral-800 rounded-lg px-3 py-2 min-w-[80px]">
                            {formatNumber(timeLeft.seconds)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">SECONDS</div>
                    </div>
                </div>
            )}
        </div>
    );
};
