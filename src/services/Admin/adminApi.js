// File Location: src/services/Admin/adminApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api";

export const getAdminProfile = async () => {
    try {
        // Get admin data from localStorage (stored during login)
        const userDetailsString = localStorage.getItem("userDetails");

        if (!userDetailsString) {
            throw new Error("No user details found. Please login again.");
        }

        // Parse the admin data
        const adminData = JSON.parse(userDetailsString);
        console.log("Admin data from localStorage:", adminData);

        // Return the admin data directly (similar to patient/doctor API)
        return { data: adminData };

    } catch (error) {
        console.error("Error fetching admin profile:", error);
        throw error;
    }
};

// Alternative: Get admin profile from backend (if you implement the profile endpoint)
export const getAdminProfileFromBackend = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/User/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin profile response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching admin profile from backend:", error);
        throw error;
    }
};