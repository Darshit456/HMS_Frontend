import React, { useState } from "react";

const ScheduleSection = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddSlot, setShowAddSlot] = useState(false);

    // Generate dummy schedule data with real dates
    const generateDummySchedule = () => {
        const today = new Date();
        const scheduleData = {};

        // Generate schedule for next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateKey = date.toDateString();

            if (i === 0) {
                // TODAY - Full schedule
                scheduleData[dateKey] = [
                    { id: 1, time: '09:00', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 2, time: '09:30', type: 'Patient Consultation', duration: '45 min', status: 'booked', patient: 'Sarah Johnson' },
                    { id: 3, time: '10:15', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 4, time: '10:45', type: 'Surgery Review', duration: '60 min', status: 'booked', patient: 'Michael Chen' },
                    { id: 5, time: '11:45', type: 'Break', duration: '15 min', status: 'break' },
                    { id: 6, time: '12:00', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 7, time: '12:30', type: 'Lunch Break', duration: '60 min', status: 'break' },
                    { id: 8, time: '13:30', type: 'Follow-up', duration: '30 min', status: 'booked', patient: 'Emma Davis' }
                ];
            } else if (i === 1) {
                // TOMORROW - Moderate schedule
                scheduleData[dateKey] = [
                    { id: 11, time: '09:00', type: 'Morning Rounds', duration: '60 min', status: 'meeting' },
                    { id: 12, time: '10:00', type: 'Available', duration: '120 min', status: 'free' },
                    { id: 13, time: '12:00', type: 'Lunch Break', duration: '60 min', status: 'break' },
                    { id: 14, time: '13:00', type: 'Patient Consultation', duration: '90 min', status: 'booked', patient: 'James Wilson' }
                ];
            } else {
                // OTHER DAYS - Simple schedule
                scheduleData[dateKey] = [
                    { id: 16 + i, time: '09:00', type: 'Available', duration: '180 min', status: 'free' },
                    { id: 20 + i, time: '12:00', type: 'Lunch Break', duration: '60 min', status: 'break' },
                    { id: 24 + i, time: '13:00', type: 'Available', duration: '180 min', status: 'free' }
                ];
            }
        }

        return scheduleData;
    };

    const scheduleData = generateDummySchedule();

    // Get next 7 days for navigation
    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();
    const selectedDateSchedule = scheduleData[selectedDate.toDateString()] || [];
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    // Get status styling with enhanced gradients
    const getStatusStyle = (status) => {
        switch (status) {
            case 'free':
                return 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-green-100 dark:shadow-green-900/30';
            case 'booked':
                return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/30';
            case 'break':
                return 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-800 dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-300 border border-orange-200 dark:border-orange-700 shadow-orange-100 dark:shadow-orange-900/30';
            case 'meeting':
                return 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300 border border-purple-200 dark:border-purple-700 shadow-purple-100 dark:shadow-purple-900/30';
            case 'emergency':
                return 'bg-gradient-to-br from-red-50 to-red-100 text-red-800 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-300 border border-red-200 dark:border-red-700 shadow-red-100 dark:shadow-red-900/30';
            default:
                return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
        }
    };

    // Get status icon with enhanced visual feedback
    const getStatusIcon = (status) => {
        const iconMap = {
            'free': { icon: '🟢', pulse: 'animate-pulse' },
            'booked': { icon: '👤', pulse: '' },
            'break': { icon: '☕', pulse: '' },
            'meeting': { icon: '🤝', pulse: '' },
            'emergency': { icon: '🚨', pulse: 'animate-pulse' },
            'default': { icon: '⏰', pulse: '' }
        };
        return iconMap[status] || iconMap.default;
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col backdrop-blur-sm">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-3 p-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/50 shadow-md">
                <h2 className="text-sm font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <span className="text-lg">📅</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        My Schedule
                    </span>
                </h2>
                {isToday && (
                    <button
                        onClick={() => setShowAddSlot(true)}
                        className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-1.5 rounded-lg transition-all duration-300 ease-out flex items-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        <span className="text-xs group-hover:rotate-90 transition-transform duration-300">➕</span>
                        <span className="font-medium text-xs">Add</span>
                    </button>
                )}
            </div>

            {/* Compact Week Navigation */}
            <div className="mb-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1">
                    {weekDays.map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isTodayDate = date.toDateString() === new Date().toDateString();
                        const daySchedule = scheduleData[date.toDateString()] || [];
                        const busySlots = daySchedule.filter(slot => slot.status === 'booked').length;

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 transition-all duration-300 ease-out rounded-lg relative group overflow-hidden ${
                                    isSelected
                                        ? 'w-20 h-14 p-2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white shadow-lg transform scale-105'
                                        : 'w-14 h-12 p-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 shadow-sm hover:shadow-md transform hover:scale-105'
                                } border border-white/20 dark:border-gray-600/50 backdrop-blur-sm`}
                            >
                                <div className="relative text-center h-full flex flex-col justify-center z-10">
                                    <div className={`font-medium transition-all duration-300 ${isSelected ? 'text-xs text-purple-100' : 'text-xs'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`font-bold transition-all duration-300 ${isSelected ? 'text-sm text-white' : 'text-sm'} ${isTodayDate && !isSelected ? 'text-purple-500' : ''}`}>
                                        {date.getDate()}
                                    </div>
                                    {/* Show busy count only on selected */}
                                    {busySlots > 0 && isSelected && (
                                        <div className="text-xs text-purple-200 -mt-0.5">
                                            <span className="bg-white/20 px-1 py-0.5 rounded text-xs">
                                                {busySlots}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Compact today indicator */}
                                {isTodayDate && (
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full">
                                        <div className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Enhanced Schedule Content with stagger animations */}
            <div className="flex-1 overflow-y-auto custom-scroll min-h-0">
                {selectedDateSchedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 dark:text-gray-400 animate-fade-in p-6">
                        <div className="text-6xl mb-4 opacity-50 animate-bounce">📅</div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-600 dark:text-gray-300">No Schedule Set</h3>
                        <p className="text-sm text-center mb-6 text-gray-500 max-w-xs">
                            Add time slots to manage your schedule efficiently
                        </p>
                        {isToday && (
                            <button
                                onClick={() => setShowAddSlot(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">➕</span>
                                    <span className="font-medium">Add Time Slot</span>
                                </span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        {/* Compact date header */}
                        <div className="text-center mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-100 dark:border-purple-800 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {selectedDateSchedule.length} appointments scheduled
                            </p>
                        </div>

                        {/* Enhanced schedule slots with stagger animation */}
                        <div className="space-y-4">
                            {selectedDateSchedule.map((slot, index) => {
                                const statusInfo = getStatusIcon(slot.status);
                                return (
                                    <div
                                        key={slot.id}
                                        className={`rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] p-6 ${getStatusStyle(slot.status)} animate-fade-in-up backdrop-blur-sm`}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="text-center">
                                            {/* Enhanced icon and time section */}
                                            <div className="flex items-center justify-center gap-6 mb-6">
                                                <div className={`text-5xl ${statusInfo.pulse} transition-transform duration-300 hover:scale-110`}>
                                                    {statusInfo.icon}
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-3xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                                        {slot.time}
                                                    </div>
                                                    <div className="text-lg opacity-75 font-medium">
                                                        {slot.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Enhanced type and patient info */}
                                            <div className="space-y-4">
                                                <div className="font-bold text-2xl mb-3">
                                                    {slot.type}
                                                </div>
                                                {slot.patient && (
                                                    <div className="text-lg opacity-75 mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                                        <span className="font-medium">Patient:</span> {slot.patient}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Enhanced status badge */}
                                            <div className="mt-6">
                                                <span className="inline-flex items-center gap-2 text-lg px-8 py-3 bg-white/80 dark:bg-gray-800/80 rounded-full font-semibold shadow-lg backdrop-blur-sm border border-white/30">
                                                    <span className="text-xl">{statusInfo.icon}</span>
                                                    {slot.status === 'free' ? 'Available' :
                                                        slot.status === 'booked' ? 'Booked' :
                                                            slot.status === 'break' ? 'Break Time' :
                                                                slot.status === 'meeting' ? 'Meeting' :
                                                                    slot.status === 'emergency' ? 'Emergency' : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Compact Schedule Summary */}
                        {isToday && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md animate-fade-in backdrop-blur-sm">
                                <h4 className="text-sm font-semibold text-center mb-3 text-gray-800 dark:text-white">Today's Summary</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="font-bold text-2xl text-green-600 dark:text-green-400 mb-1">
                                            {selectedDateSchedule.filter(s => s.status === 'free').length}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 font-medium text-xs">Available</div>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-1">
                                            {selectedDateSchedule.filter(s => s.status === 'booked').length}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 font-medium text-xs">Booked</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Add Slot Modal with blur backdrop */}
            {showAddSlot && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 dark:border-gray-700/50 transform animate-scale-in">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="text-3xl animate-bounce">➕</span>
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Add Time Slot
                            </span>
                        </h3>

                        <div className="space-y-6">
                            <div className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
                                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <span className="text-lg">📅</span> Date
                                </label>
                                <input
                                    type="text"
                                    value={selectedDate.toLocaleDateString()}
                                    disabled
                                    className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-lg">⏰</span> Start Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-lg">⏱️</span> Duration
                                    </label>
                                    <select className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">60 min</option>
                                        <option value="90">90 min</option>
                                        <option value="120">120 min</option>
                                    </select>
                                </div>
                            </div>

                            <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
                                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <span className="text-lg">🏷️</span> Type
                                </label>
                                <select className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                                    <option value="Available">🟢 Available</option>
                                    <option value="Break">☕ Break</option>
                                    <option value="Meeting">🤝 Meeting</option>
                                    <option value="Emergency">🚨 Emergency Slot</option>
                                </select>
                            </div>

                            <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                                <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <span className="text-lg">📝</span> Notes (Optional)
                                </label>
                                <textarea
                                    placeholder="Add any notes or details..."
                                    rows="3"
                                    className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                            <button
                                onClick={() => {
                                    alert('🎯 Schedule management will be connected to backend when database is ready!');
                                    setShowAddSlot(false);
                                }}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            >
                                <span className="text-lg">✨</span>
                                <span>Add Slot</span>
                            </button>
                            <button
                                onClick={() => setShowAddSlot(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }

                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
                }

                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.5);
                    border-radius: 10px;
                }

                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(156, 163, 175, 0.7);
                }
            `}</style>
        </div>
    );
};

export default ScheduleSection;