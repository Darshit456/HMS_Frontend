// File: src/pages/dashboard/MedicalRecordsSection.jsx
import React from "react";
import { FaFileMedical } from "react-icons/fa";

const medicalRecords = [
    { id: 1, title: "Blood Test Report", date: "2025-04-10", description: "Routine blood test.", prescription: "Iron, Vitamin D" },
    { id: 2, title: "Chest X-ray", date: "2025-03-25", description: "Cough symptoms.", prescription: "Antibiotics" },
    { id: 3, title: "ECG Report", date: "2025-02-15", description: "Heart rhythm analysis.", prescription: "Monitor + Beta Blockers" },
    { id: 4, title: "MRI Scan", date: "2025-01-20", description: "Headache issue.", prescription: "Neurology consult" },
];

const MedicalRecordsSection = () => {
    return (
        <div className="dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaFileMedical className="text-red-500" /> Medical Records
            </h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                <ul className="space-y-4">
                    {medicalRecords.map((record) => (
                        <li key={record.id} className="border dark:border-none dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-lg font-medium">{record.title}</p>
                            <p className="text-sm dark:text-gray-300">{record.description}</p>
                            <p className="text-sm dark:text-gray-300 font-medium">Prescription: {record.prescription}</p>
                            <span className="text-xs dark:text-gray-400">{record.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MedicalRecordsSection;
