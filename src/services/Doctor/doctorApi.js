// src/services/doctorApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Doctor";

export const getDoctorProfile = async () => {
    try {
        // Get doctor data from localStorage (stored during login)
        const userDetailsString = localStorage.getItem("userDetails");

        if (!userDetailsString) {
            throw new Error("No user details found. Please login again.");
        }

        // Parse the doctor data
        const doctorData = JSON.parse(userDetailsString);
        console.log("Doctor data from localStorage:", doctorData); // Debug log

        // Return the doctor data directly (similar to patient API)
        return { data: doctorData };

    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        throw error;
    }
};

export const updateDoctorProfile = async (doctorId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        // Use correct property names that match your backend model for doctors
        const patchOperations = [];

        if (updateData.firstName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/FirstName",
                "op": "replace",
                "value": updateData.firstName
            });
        }

        if (updateData.lastName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/LastName",
                "op": "replace",
                "value": updateData.lastName
            });
        }

        if (updateData.email) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Email",
                "op": "replace",
                "value": updateData.email
            });
        }

        if (updateData.phone) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Phone",
                "op": "replace",
                "value": updateData.phone
            });
        }

        if (updateData.specialization) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Specialization",
                "op": "replace",
                "value": updateData.specialization
            });
        }

        if (updateData.experience) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Experience",
                "op": "replace",
                "value": parseInt(updateData.experience)
            });
        }

        if (updateData.qualification) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Qualification",
                "op": "replace",
                "value": updateData.qualification
            });
        }

        console.log("Sending doctor patch operations:", patchOperations);

        const response = await axios.patch(`${API_URL}/update/${doctorId}`, patchOperations, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        });

        return response;
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};