import React from "react";

const appointments = [
    { id: 1, date: "2025-04-22", time: "10:00 AM", doctor: "Dr. Mehta", status: "Upcoming" },
    { id: 2, date: "2025-03-15", time: "2:00 PM", doctor: "Dr. Sharma", status: "Completed" },
];

const AppointmentsSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Appointments</h2>
            <div className="space-y-4">
                {appointments.map((appt) => (
                    <div key={appt.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <p className="text-gray-900 dark:text-white">
                            <strong>Date:</strong> {appt.date}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                            <strong>Time:</strong> {appt.time}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                            <strong>Doctor:</strong> {appt.doctor}
                        </p>
                        <p className={`font-semibold ${appt.status === "Upcoming" ? "text-green-600" : "text-gray-400"}`}>
                            {appt.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentsSection;
