// File: src/pages/dashboard/RequestAppointmentButton.jsx
import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const RequestAppointmentButton = () => {
    const handleClick = () => {
        alert("Appointment request initiated (dummy action).");
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300"
        >
            <FaPlusCircle /> Request Appointment
        </button>
    );
};

export default RequestAppointmentButton;
