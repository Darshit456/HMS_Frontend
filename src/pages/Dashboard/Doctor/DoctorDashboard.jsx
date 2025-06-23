// File: src/pages/Dashboard/Doctor/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import DoctorProfileSection from "../../dashboard/Doctor/DoctorProfileSection.jsx";
import TodaysAppointments from "../../dashboard/Doctor/TodaysAppointments.jsx";
import PatientRequestsSection from "../../dashboard/Doctor/PatientRequestsSection.jsx";
import ScheduleSection from "../../dashboard/Doctor/ScheduleSection.jsx";
import AllAppointmentsSection from "../../dashboard/Doctor/AllAppointmentsSection.jsx";
import NotificationsSection from "../../dashboard/Doctor/NotificationsSection.jsx";

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
                    <AllAppointmentsSection />
                </div>

                <div className="lg:col-span-5 min-h-0">
                    <ScheduleSection />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;