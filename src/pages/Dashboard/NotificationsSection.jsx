// File: src/pages/dashboard/NotificationsSection.jsx
import React from "react";
import { FaBell } from "react-icons/fa";

const notifications = [
    { id: 1, message: "Your appointment with Dr. Mehta is confirmed.", date: "2025-04-20" },
    { id: 2, message: "Your lab results are available.", date: "2025-04-18" },
    { id: 3, message: "You have a follow-up scheduled with Dr. Sharma.", date: "2025-04-15" },
];

const NotificationsSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaBell className="text-yellow-500" /> Notifications
            </h2>
            <ul className="space-y-3">
                {notifications.map((note) => (
                    <li key={note.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200">{note.message}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsSection;
