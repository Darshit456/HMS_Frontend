import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { getPatientProfile } from "../../services/patientApi";

const ProfileSection = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileSection;