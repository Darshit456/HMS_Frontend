import React, { useState } from "react";

const ScheduleSection = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddSlot, setShowAddSlot] = useState(false);

    // Beautiful dummy schedule data
    const generateDummySchedule = () => {
        const today = new Date();
        const scheduleData = {};

        // Generate schedule for next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateKey = date.toDateString();

            if (i === 0) { // Today - Full schedule
                scheduleData[dateKey] = [
                    { id: 1, time: '09:00', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 2, time: '09:30', type: 'Patient Consultation', duration: '45 min', status: 'booked', patient: 'Sarah Johnson' },
                    { id: 3, time: '10:15', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 4, time: '10:45', type: 'Surgery Review', duration: '60 min', status: 'booked', patient: 'Michael Chen' },
                    { id: 5, time: '11:45', type: 'Break', duration: '15 min', status: 'break' },
                    { id: 6, time: '12:00', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 7, time: '12:30', type: 'Lunch Break', duration: '60 min', status: 'break' },
                    { id: 8, time: '13:30', type: 'Follow-up', duration: '30 min', status: 'booked', patient: 'Emma Davis' },
                    { id: 9, time: '14:00', type: 'Available', duration: '45 min', status: 'free' },
                    { id: 10, time: '14:45', type: 'Team Meeting', duration: '30 min', status: 'meeting' },
                    { id: 11, time: '15:15', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 12, time: '15:45', type: 'Emergency Slot', duration: '60 min', status: 'emergency' }
                ];
            } else if (i === 1) { // Tomorrow - Moderate schedule
                scheduleData[dateKey] = [
                    { id: 13, time: '09:00', type: 'Morning Rounds', duration: '45 min', status: 'meeting' },
                    { id: 14, time: '09:45', type: 'Available', duration: '30 min', status: 'free' },
                    { id: 15, time: '10:15', type: 'Consultation', duration: '30 min', status: 'booked', patient: 'James Wilson' },
                    { id: 16, time: '10:45', type: 'Available', duration: '60 min', status: 'free' },
                    { id: 17, time: '11:45', type: 'Coffee Break', duration: '15 min', status: 'break' },
                    { id: 18, time: '12:00', type: 'Available', duration: '90 min', status: 'free' },
                    { id: 19, time: '13:30', type: 'Lunch', duration: '30 min', status: 'break' },
                    { id: 20, time: '14:00', type: 'Available', duration: '120 min', status: 'free' }
                ];
            } else if (i === 2) { // Day after tomorrow - Light schedule
                scheduleData[dateKey] = [
                    { id: 21, time: '09:30', type: 'Available', duration: '60 min', status: 'free' },
                    { id: 22, time: '10:30', type: 'Conference Call', duration: '30 min', status: 'meeting' },
                    { id: 23, time: '11:00', type: 'Available', duration: '120 min', status: 'free' },
                    { id: 24, time: '13:00', type: 'Lunch Meeting', duration: '60 min', status: 'meeting' },
                    { id: 25, time: '14:00', type: 'Available', duration: '180 min', status: 'free' }
                ];
            } else { // Other days - Minimal schedule
                scheduleData[dateKey] = [
                    { id: 26 + i, time: '09:00', type: 'Available', duration: '240 min', status: 'free' },
                    { id: 30 + i, time: '13:00', type: 'Lunch Break', duration: '60 min', status: 'break' },
                    { id: 34 + i, time: '14:00', type: 'Available', duration: '180 min', status: 'free' }
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

    // Get status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'free':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-l-4 border-l-green-500';
            case 'booked':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-l-4 border-l-blue-500';
            case 'break':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-l-4 border-l-orange-500';
            case 'meeting':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-l-4 border-l-purple-500';
            case 'emergency':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-l-4 border-l-red-500';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-l-4 border-l-gray-500';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'free': return '🟢';
            case 'booked': return '👤';
            case 'break': return '☕';
            case 'meeting': return '🤝';
            case 'emergency': return '🚨';
            default: return '⏰';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm sm:text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    📅 My Schedule
                </h2>
                <button
                    onClick={() => setShowAddSlot(true)}
                    className="bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-700 transition text-xs flex items-center gap-1"
                >
                    ➕ Add
                </button>
            </div>

            {/* Beautiful Week Navigation */}
            <div className="mb-3">
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {weekDays.slice(0, 7).map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const daySchedule = scheduleData[date.toDateString()] || [];
                        const busySlots = daySchedule.filter(slot => slot.status === 'booked').length;

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 p-2 rounded-lg text-xs transition min-w-[60px] relative ${
                                    isSelected
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="font-medium text-xs">
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`font-bold text-sm ${isToday ? 'text-purple-400' : ''}`}>
                                        {date.getDate()}
                                    </div>
                                    {busySlots > 0 && (
                                        <div className="text-xs opacity-75 mt-1">
                                            {busySlots} busy
                                        </div>
                                    )}
                                </div>
                                {isToday && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Beautiful Schedule Content */}
            <div className="flex-1 overflow-y-auto custom-scroll">
                {selectedDateSchedule.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-3 opacity-50">📅</div>
                        <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">No Schedule Set</h3>
                        <p className="text-xs text-center mb-3">
                            Add time slots to manage your schedule
                        </p>
                        <button
                            onClick={() => setShowAddSlot(true)}
                            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition text-xs"
                        >
                            ➕ Add Time Slot
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        {selectedDateSchedule.map((slot) => (
                            <div
                                key={slot.id}
                                className={`p-3 rounded-lg transition-all hover:shadow-md ${getStatusStyle(slot.status)}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-lg">
                                            {getStatusIcon(slot.status)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">
                                                {slot.time} - {slot.type}
                                            </div>
                                            <div className="text-xs opacity-75">
                                                {slot.duration}
                                                {slot.patient && ` • ${slot.patient}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {slot.status === 'free' && (
                                            <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                                                Available
                                            </span>
                                        )}
                                        {slot.status === 'booked' && (
                                            <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                                                Booked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Schedule Summary */}
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="text-center">
                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                        {selectedDateSchedule.filter(s => s.status === 'free').length}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">Available</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                                        {selectedDateSchedule.filter(s => s.status === 'booked').length}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">Booked</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Add Slot Modal */}
            {showAddSlot && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            ➕ Add Time Slot
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    📅 Date
                                </label>
                                <input
                                    type="text"
                                    value={selectedDate.toLocaleDateString()}
                                    disabled
                                    className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        ⏰ Start Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        ⏱️ Duration
                                    </label>
                                    <select className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500">
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">60 min</option>
                                        <option value="90">90 min</option>
                                        <option value="120">120 min</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    🏷️ Type
                                </label>
                                <select className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500">
                                    <option value="Available">🟢 Available</option>
                                    <option value="Break">☕ Break</option>
                                    <option value="Meeting">🤝 Meeting</option>
                                    <option value="Emergency">🚨 Emergency Slot</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    📝 Notes (Optional)
                                </label>
                                <textarea
                                    placeholder="Add any notes or details..."
                                    rows="2"
                                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    alert('🎯 Schedule management will be connected to backend when database is ready!');
                                    setShowAddSlot(false);
                                }}
                                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition text-sm font-medium flex items-center justify-center gap-2"
                            >
                                ✨ Add Slot
                            </button>
                            <button
                                onClick={() => setShowAddSlot(false)}
                                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleSection;