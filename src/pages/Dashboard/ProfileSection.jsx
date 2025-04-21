import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileSection = () => {
    const user = {
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        dob: "1990-01-01",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile</h2>
            <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                    <FaUser className="text-3xl text-blue-600 dark:text-blue-300" />
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                    <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm">{user.phone}</p>
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-medium">Gender:</span> {user.gender}</p>
                <p><span className="font-medium">Date of Birth:</span> {user.dob}</p>
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
