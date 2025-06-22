// File: src/pages/Dashboard/Doctor/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import DoctorProfileSection from "../../dashboard/Doctor/DoctorProfileSection.jsx";
import TodaysAppointments from "../../dashboard/Doctor/TodaysAppointments.jsx";

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
        <div className="h-screen w-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4 space-y-4 custom-scroll pb-8">
            <h5 className="text-xl font-bold text-center text-green-600 dark:text-green-400">
                Welcome Dr. {doctorName}! 👨‍⚕️
            </h5>

            <div className="grid grid-cols-12 gap-4 h-[75%]">
                {/* Doctor Profile Section - Now Real Component */}
                <div className="col-span-3">
                    <DoctorProfileSection />
                </div>

                {/* Today's Appointments - Clean New Component */}
                <div className="col-span-6 overflow-hidden">
                    <div className="h-full">
                        <TodaysAppointments />
                    </div>
                </div>

                {/* Notifications - Placeholder */}
                <div className="col-span-3">
                    <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Notifications</h2>
                        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                            Notifications Coming Soon...
                        </div>
                    </div>
                </div>

                {/* My Patients - Placeholder */}
                <div className="col-span-4 overflow-hidden">
                    <div className="h-full">
                        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">My Patients</h2>
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                Patients Section Coming Soon...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Management - Placeholder */}
                <div className="col-span-4 overflow-hidden">
                    <div className="h-full">
                        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex-col">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Schedule</h2>
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                Schedule Section Coming Soon...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Requests - Placeholder */}
                <div className="col-span-4 overflow-hidden">
                    <div className="h-full">
                        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Patient Requests</h2>
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                Requests Section Coming Soon...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;