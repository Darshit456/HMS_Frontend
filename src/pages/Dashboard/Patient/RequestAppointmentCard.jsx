import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const pendingRequests = [
    { id: 1, name: "Appointment with Dr. Arora", status: "Pending" },
    { id: 2, name: "General Check-up", status: "Pending" },
    { id: 3, name: "Vaccination Follow-up", status: "Pending" },
    { id: 4, name: "Consultation with Dr. Verma", status: "Pending" },
];

const RequestAppointmentCard = () => {
    const handleRequest = () => {
        alert("Appointment request sent!");
    };

    return (
        <div className="dark:bg-gray-800 dark:text-white rounded-2xl shadow-md h-full p-4 flex flex-col justify-between">
            <div className="relative group">
                <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
                <div className="overflow-y-auto max-h-40 custom-scroll group-hover:scroll-visible">
                    <ul className="space-y-2 pr-2">
                        {pendingRequests.map((req) => (
                            <li key={req.id} className="dark:bg-gray-700 p-3 rounded-md">
                                {req.name} - <span className="text-yellow-400 font-semibold">{req.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button
                onClick={handleRequest}
                className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
            >
                <FaPlusCircle /> Request Appointment
            </button>
        </div>
    );
};

export default RequestAppointmentCard;