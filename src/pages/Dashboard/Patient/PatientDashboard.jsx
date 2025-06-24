// File: src/pages/Dashboard/Patient/PatientDashboard.jsx
import React, { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection.jsx";
import AppointmentsSection from "./AppointmentsSection.jsx";
import NotificationsSection from "./NotificationsSection.jsx";
import MedicalRecordsSection from "./MedicalRecordsSection.jsx";
import RequestAppointmentCard from "./RequestAppointmentCard.jsx";

const PatientDashboard = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
            const userData = JSON.parse(userDetails);
            setUserName(userData.firstName || "Patient");
        }
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 flex flex-col">
            <h5 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2 sm:mb-4">
                Welcome {userName}! 😊
            </h5>

            {/* Single View Grid Layout - Same as Doctor */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 min-h-0">
                {/* Top Row - Main Content */}
                <div className="lg:col-span-3 min-h-0">
                    <div className="h-full">
                        <ProfileSection />
                    </div>
                </div>

                <div className="lg:col-span-6 min-h-0">
                    <div className="h-full">
                        <AppointmentsSection />
                    </div>
                </div>

                <div className="lg:col-span-3 min-h-0">
                    <div className="h-full">
                        <NotificationsSection />
                    </div>
                </div>

                {/* Bottom Row - Secondary Content */}
                <div className="lg:col-span-6 min-h-0">
                    <div className="h-full">
                        <MedicalRecordsSection />
                    </div>
                </div>

                <div className="lg:col-span-6 min-h-0">
                    <RequestAppointmentCard />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;