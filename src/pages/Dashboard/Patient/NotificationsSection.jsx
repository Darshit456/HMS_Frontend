// File: src/pages/Dashboard/Patient/NotificationsSection.jsx
import React from "react";
import { FaBell } from "react-icons/fa";

const notifications = [
    { id: 1, gender: "male", doctor: "Dr. Mehta", message: "Your appointment is confirmed.", date: "2025-04-20" },
    { id: 2, gender: "female", doctor: "Dr. Kapoor", message: "Lab results available.", date: "2025-04-18" },
    { id: 3, gender: "male", doctor: "Dr. Sharma", message: "Follow-up scheduled.", date: "2025-04-15" },
    { id: 4, gender: "female", doctor: "Dr. Jain", message: "Prescription uploaded.", date: "2025-04-10" },
];

const NotificationsSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full group">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                    <FaBell className="text-yellow-600 dark:text-yellow-300" />
                </div>
                Notifications
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    1
                </span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse ml-auto"></div>
                <button className="text-xs text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 ml-2">
                    Mark all read
                </button>
                <button className="text-xs text-yellow-600 hover:text-yellow-800 dark:text-yellow-400">
                    Test
                </button>
            </h2>
            <div className="overflow-y-auto max-h-60 custom-scroll group-hover:scroll-visible">
                <ul className="space-y-3 pr-2">
                    {notifications.map((note) => (
                        <li key={note.id} className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-md flex items-start gap-3">
                            <div className="w-10 h-10 bg-yellow-500 text-white flex items-center justify-center rounded-full font-bold">
                                {note.gender === "male" ? "M" : "F"}
                            </div>
                            <div>
                                <p><span className="font-bold">{note.doctor}:</span> {note.message}</p>
                                <span className="text-xs text-gray-400">{note.date}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Connection Status Footer */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Real-time notifications</span>
                    <span className="text-yellow-600">Connected</span>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSection;