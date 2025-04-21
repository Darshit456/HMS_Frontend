// File: src/pages/dashboard/MedicalRecordsSection.jsx
import React from "react";
import { FaFileMedical } from "react-icons/fa";

const medicalRecords = [
    { id: 1, title: "Blood Test Report", date: "2025-04-10", description: "Routine blood test results." },
    { id: 2, title: "X-ray Report", date: "2025-03-25", description: "Chest X-ray for persistent cough." },
];

const MedicalRecordsSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaFileMedical className="text-red-500" /> Medical Records
            </h2>
            <ul className="space-y-4">
                {medicalRecords.map((record) => (
                    <li key={record.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-lg text-gray-900 dark:text-white font-medium">{record.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{record.description}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{record.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalRecordsSection;
