// File: src/components/TimeWidget.jsx
import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

const TimeWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-50 animate-slideInFromTop">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50 min-w-[140px] animate-glow">
                    {/* Time Display */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <FaClock className="text-blue-500 text-sm animate-tick" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">LIVE</span>
                        </div>

                        <div className="text-lg font-bold text-gray-800 dark:text-white font-mono animate-pulse-subtle">
                            {formatTime(currentTime)}
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 animate-fadeIn">
                            {formatDate(currentTime)}
                        </div>
                    </div>

                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-border-flow opacity-20"></div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes glow {
                    0%, 100% {
                        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
                    }
                    50% {
                        box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2), 0 0 20px rgba(147, 51, 234, 0.1);
                    }
                }

                @keyframes tick {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-5deg);
                    }
                    75% {
                        transform: rotate(5deg);
                    }
                }

                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.95;
                        transform: scale(1.02);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes border-flow {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .animate-slideInFromTop {
                    animation: slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .animate-glow {
                    animation: glow 4s ease-in-out infinite;
                }

                .animate-tick {
                    animation: tick 2s ease-in-out infinite;
                }

                .animate-pulse-subtle {
                    animation: pulse-subtle 3s ease-in-out infinite;
                }

                .animate-fadeIn {
                    animation: fadeIn 1s ease-out 0.5s both;
                }

                .animate-border-flow {
                    animation: border-flow 3s ease infinite;
                    background-size: 400% 400%;
                }

                /* Hover effects */
                .fixed > div:hover {
                    transform: scale(1.05);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .fixed > div:hover .animate-tick {
                    animation-duration: 0.5s;
                }
            `}</style>
        </>
    );
};

export default TimeWidget;