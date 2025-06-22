import React, { useState, useEffect } from "react";
import { FaFileMedical } from "react-icons/fa";
import { getPatientMedicalRecords } from "../../../services/medicalRecordsApi.js";

const MedicalRecordsSection = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Function to format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        } catch (error) {
            console.error("Date formatting error:", error);
            return 'Invalid Date';
        }
    };

    // Function to fetch medical records
    const fetchMedicalRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const recordsData = await getPatientMedicalRecords();

            // Transform the data to match your existing UI structure
            const transformedRecords = recordsData.map(record => ({
                id: record.recordID || record.id, // Handle different ID field names
                title: record.recordType || record.title || 'Medical Record',
                date: formatDate(record.createdAt || record.recordDate || record.date),
                description: record.diagnosis || record.description || 'Medical record details',
                prescription: record.prescription || record.treatment || 'No prescription specified'
            }));

            setMedicalRecords(transformedRecords);
            console.log("Transformed medical records:", transformedRecords);

        } catch (err) {
            console.error("Failed to fetch medical records:", err);
            setError("Failed to load medical records. Please try again.");
            // Fallback to empty array to prevent crashes
            setMedicalRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch medical records on component mount
    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    // Auto-refresh every 60 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMedicalRecords();
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaFileMedical className="text-red-500" /> Medical Records
                </h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500 dark:text-gray-400">Loading medical records...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaFileMedical className="text-red-500" /> Medical Records
                </h2>
                <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-red-500">{error}</div>
                        <button
                            onClick={fetchMedicalRecords}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow-md h-full flex flex-col group">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaFileMedical className="text-red-500" /> Medical Records
            </h2>
            <div className="overflow-y-auto grow custom-scroll group-hover:scroll-visible pr-2">
                {medicalRecords.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        No medical records found
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default MedicalRecordsSection;