import React from "react";

const appointments = [
    { id: 1, date: "2025-04-22", time: "10:00 AM", doctor: "Dr. Mehta", status: "Upcoming" },
    { id: 2, date: "2025-04-19", time: "2:00 PM", doctor: "Dr. Sharma", status: "Cancelled" },
    { id: 3, date: "2025-04-25", time: "1:00 PM", doctor: "Dr. Singh", status: "Pending" },
    { id: 4, date: "2025-05-01", time: "3:30 PM", doctor: "Dr. Khan", status: "Upcoming" },
    { id: 5, date: "2025-05-02", time: "11:00 AM", doctor: "Dr. Rao", status: "Upcoming" },
];

const AppointmentsSection = () => {
    return (
        <div className=" dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                <div className="space-y-4">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="border dark:border-none rounded-lg p-4 bg-white dark:bg-gray-700">
                            <p><strong>Date:</strong> {appt.date}</p>
                            <p><strong>Time:</strong> {appt.time}</p>
                            <p><strong>Doctor:</strong> {appt.doctor}</p>
                            <p className={`font-semibold ${
                                appt.status === "Upcoming"
                                    ? "text-green-400"
                                    : appt.status === "Cancelled"
                                        ? "text-red-500"
                                        : "text-yellow-400"
                            }`}>
                                {appt.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsSection;