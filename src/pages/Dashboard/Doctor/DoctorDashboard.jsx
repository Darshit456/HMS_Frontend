// File: src/pages/Dashboard/Doctor/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import DoctorProfileSection from "../../dashboard/Doctor/DoctorProfileSection.jsx";
import TodaysAppointments from "../../dashboard/Doctor/TodaysAppointments.jsx";
import PatientRequestsSection from "../../dashboard/Doctor/PatientRequestsSection.jsx";

// Clean Notifications Component - Compact for single view
const NotificationsSection = () => {
    const [notifications] = useState([]); // Empty by default

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm sm:text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    🔔 Notifications
                </h2>
            </div>

            <div className="overflow-y-auto flex-1 custom-scroll">
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-3xl sm:text-4xl mb-2 opacity-50">🔔</div>
                    <h3 className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">No Notifications</h3>
                    <p className="text-xs text-center">
                        New notifications will appear here
                    </p>
                </div>
            </div>
        </div>
    );
};

// Clean My Patients Component - Compact for single view
const MyPatientsSection = () => {
    const [patients] = useState([]); // Empty by default
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm sm:text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    👥 My Patients
                </h2>
            </div>

            {/* Compact Search Box */}
            <div className="mb-3">
                <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scroll">
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-3xl sm:text-4xl mb-2 opacity-50">👥</div>
                    <h3 className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">No Patients Yet</h3>
                    <p className="text-xs text-center">
                        Patients will appear here after appointments
                    </p>
                </div>
            </div>
        </div>
    );
};

// Clean Schedule Component - Compact for single view
const ScheduleSection = () => {
    const [schedule] = useState([]); // Empty by default
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddSlot, setShowAddSlot] = useState(false);

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

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm sm:text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                    📅 Schedule
                </h2>
                <button
                    onClick={() => setShowAddSlot(true)}
                    className="bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-700 transition text-xs flex items-center gap-1"
                >
                    ➕ Add
                </button>
            </div>

            {/* Compact Week Navigation */}
            <div className="mb-3">
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {weekDays.slice(0, 5).map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 p-1 rounded text-xs transition min-w-[45px] ${
                                    isSelected
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="font-medium text-xs">
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`font-bold text-xs ${isToday ? 'text-purple-500' : ''}`}>
                                        {date.getDate()}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Compact Schedule Content */}
            <div className="flex-1 overflow-y-auto custom-scroll">
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-3xl sm:text-4xl mb-2 opacity-50">📅</div>
                    <h3 className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">No Schedule Set</h3>
                    <p className="text-xs text-center mb-2">
                        Add time slots to manage your schedule
                    </p>
                    <button
                        onClick={() => setShowAddSlot(true)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition text-xs"
                    >
                        ➕ Add Slot
                    </button>
                </div>
            </div>

            {/* Compact Add Slot Modal */}
            {showAddSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            Add Time Slot
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Date
                                </label>
                                <input
                                    type="text"
                                    value={selectedDate.toLocaleDateString()}
                                    disabled
                                    className="w-full px-2 py-1 text-sm border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Type
                                </label>
                                <select className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="Available">Available</option>
                                    <option value="Break">Break</option>
                                    <option value="Meeting">Meeting</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    alert('Schedule management will be connected to backend');
                                    setShowAddSlot(false);
                                }}
                                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setShowAddSlot(false)}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm"
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

const DoctorDashboard = () => {
    const [doctorName, setDoctorName] = useState("");

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
            const userData = JSON.parse(userDetails);
            setDoctorName(userData.firstName || "Doctor");
        }
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 flex flex-col">
            <h5 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-green-600 dark:text-green-400 mb-2 sm:mb-4">
                Welcome Dr. {doctorName}! 👨‍⚕️
            </h5>

            {/* Single View Grid Layout - No Scrolling on Desktop */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 min-h-0">
                {/* Top Row - Main Content */}
                <div className="lg:col-span-3 min-h-0">
                    <div className="h-full">
                        <DoctorProfileSection />
                    </div>
                </div>

                <div className="lg:col-span-5 min-h-0">
                    <div className="h-full">
                        <TodaysAppointments />
                    </div>
                </div>

                <div className="lg:col-span-4 min-h-0">
                    <div className="h-full">
                        <PatientRequestsSection />
                    </div>
                </div>

                {/* Bottom Row - Secondary Content */}
                <div className="lg:col-span-3 min-h-0">
                    <NotificationsSection />
                </div>

                <div className="lg:col-span-4 min-h-0">
                    <MyPatientsSection />
                </div>

                <div className="lg:col-span-5 min-h-0">
                    <ScheduleSection />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;