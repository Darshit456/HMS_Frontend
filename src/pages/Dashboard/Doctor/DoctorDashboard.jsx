// File: src/pages/Dashboard/Doctor/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import DoctorProfileSection from "../../dashboard/Doctor/DoctorProfileSection.jsx";
import TodaysAppointments from "../../dashboard/Doctor/TodaysAppointments.jsx";
import PatientRequestsSection from "../../dashboard/Doctor/PatientRequestsSection.jsx";
import ScheduleSection from "../../dashboard/Doctor/ScheduleSection.jsx";
import AllAppointmentsSection from "../../dashboard/Doctor/AllAppointmentsSection.jsx"; // New import

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
                    <AllAppointmentsSection /> {/* Changed from MyPatientsSection */}
                </div>

                <div className="lg:col-span-5 min-h-0">
                    <ScheduleSection />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;