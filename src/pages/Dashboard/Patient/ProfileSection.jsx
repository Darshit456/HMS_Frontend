// File: src/pages/Dashboard/Patient/ProfileSection.jsx
import React, { useState, useEffect } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { getPatientProfile, updatePatientProfile } from "../../../services/patientApi.js";

const ProfileSection = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const handleEditClick = () => {
        setEditData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            address: patient.address
        });
        setIsEditOpen(true);
    };

    const handleSave = async () => {
        try {
            console.log("Patient ID:", patient.patientID);
            console.log("Edit data:", editData);

            await updatePatientProfile(patient.patientID, editData);

            // Update local state
            setPatient({...patient, ...editData});

            // Update localStorage
            const updatedUserDetails = {...patient, ...editData};
            localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));

            setIsEditOpen(false);
            alert("Profile updated successfully!");

            // Refresh the page after successful update
            window.location.reload();

        } catch (error) {
            console.error("Update error:", error);
            console.error("Backend error details:", error.response?.data);
            alert("Failed to update profile: " + error.message);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                // Clear all stored data
                localStorage.removeItem("token");
                localStorage.removeItem("userDetails");
                localStorage.removeItem("userRole");
                sessionStorage.clear();

                // Redirect to login page
                window.location.href = "/";

            } catch (error) {
                console.error("Logout error:", error);
                window.location.href = "/";
            }
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getPatientProfile();
                setPatient(response.data);
            } catch (err) {
                setError("Failed to load profile data");
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center justify-center">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Patient Profile</h2>

            <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full flex-shrink-0">
                    <FaUser className="text-3xl text-blue-600 dark:text-blue-300" />
                </div>
                <div className="text-gray-800 dark:text-gray-200 min-w-0 flex-1">
                    <p className="text-lg font-semibold truncate">{patient.firstName} {patient.lastName}</p>
                    <p className="text-sm truncate text-blue-600 dark:text-blue-400">Patient</p>
                    <p className="text-sm truncate">{patient.email}</p>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-medium">Phone:</span> {patient.phone}</p>
                <p><span className="font-medium">Email:</span> {patient.email}</p>
                <p><span className="font-medium">Address:</span> {patient.address}</p>
            </div>

            {/* Buttons Container */}
            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleEditClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1"
                >
                    Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    title="Logout"
                >
                    <FaSignOutAlt className="text-sm" />
                    Logout
                </button>
            </div>

            {/* Edit Popup */}
            {isEditOpen && (
                <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Profile</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    value={editData.firstName || ''}
                                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    value={editData.lastName || ''}
                                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    value={editData.email || ''}
                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                                <input
                                    type="text"
                                    value={editData.phone || ''}
                                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
                                <textarea
                                    value={editData.address || ''}
                                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSection;