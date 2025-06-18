import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { getPatientProfile, updatePatientProfile } from "../../../services/patientApi.js";

const ProfileSection = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const handleEditClick = () => {
        setEditData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
        setIsEditOpen(true);
    };

    const handleSave = async () => {
        try {
            console.log("Patient ID:", user.patientID); // Changed to patientID (uppercase)
            console.log("Edit data:", editData);

            await updatePatientProfile(user.patientID, editData); // Changed to patientID

            // Update local state (for immediate UI update)
            setUser({...user, ...editData});

            // Update localStorage so it persists
            const updatedUserDetails = {...user, ...editData};
            localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));

            setIsEditOpen(false);
            alert("Profile updated successfully!");

            // Refresh the page after successful update
            window.location.reload();
            
        } catch (error) {
            console.error("Update error:", error);
            console.error("Backend error details:", error.response?.data); // Add this line
            alert("Failed to update profile: " + error.message);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getPatientProfile();
                setUser(response.data);
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile</h2>
            <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full flex-shrink-0">
                    <FaUser className="text-3xl text-blue-600 dark:text-blue-300" />
                </div>
                <div className="text-gray-800 dark:text-gray-200 min-w-0 flex-1">
                    <p className="text-lg font-semibold truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-sm truncate">{user.email}</p>
                    <p className="text-sm truncate">{user.phone}</p>
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-medium">Gender:</span> {user.gender}</p>
                <p><span className="font-medium">Date of Birth:</span> {user.dateOfBirth}</p>
                <p><span className="font-medium">Address:</span> {user.address}</p>
            </div>
            <div className="mt-4">
                <button
                    onClick={handleEditClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Edit Profile
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
                                <input
                                    type="text"
                                    value={editData.address || ''}
                                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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