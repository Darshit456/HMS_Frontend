// File: src/pages/dashboard/PatientDashboard.jsx
import React, { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection";
import AppointmentsSection from "./AppointmentsSection";
import NotificationsSection from "./NotificationsSection";
import MedicalRecordsSection from "./MedicalRecordsSection";
import RequestAppointmentCard from "./RequestAppointmentCard";


const PatientDashboard = () => {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
            const userData = JSON.parse(userDetails);
            setUserName(userData.firstName);
        }
    }, []);
    return (
        <div className="h-screen w-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4 space-y-4 custom-scroll pb-8">
            <h5 className="text-xl font-bold text-center text-blue-600 dark:text-blue-400">Welcome {userName}! 😊</h5>

            <div className="grid grid-cols-12 gap-4 h-[75%]">
                <div className="col-span-3">
                    <ProfileSection />
                </div>

                <div className="col-span-6 overflow-hidden">
                    <div className="h-full">
                        <AppointmentsSection />
                    </div>
                </div>

                <div className="col-span-3">
                    <NotificationsSection />
                </div>

                <div className="col-span-6 overflow-hidden">
                    <div className="h-full">
                        <MedicalRecordsSection />
                    </div>
                </div>

                <div className="col-span-6 flex flex-col">
                    <RequestAppointmentCard />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;