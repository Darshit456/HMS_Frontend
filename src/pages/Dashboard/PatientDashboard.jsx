// File: src/pages/dashboard/PatientDashboard.jsx
import React from "react";
import ProfileSection from "./ProfileSection";
import AppointmentsSection from "./AppointmentsSection";
import NotificationsSection from "./NotificationsSection";
import MedicalRecordsSection from "./MedicalRecordsSection";
import RequestAppointmentButton from "./RequestAppointmentButton";

const PatientDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">Welcome to Your Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileSection />
                <NotificationsSection />
                <AppointmentsSection />
                <MedicalRecordsSection />
            </div>

            <div className="flex justify-center mt-8">
                <RequestAppointmentButton />
            </div>
        </div>
    );
};

export default PatientDashboard;
