// src/services/patientApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Patient";

export const getPatientProfile = async () => {
    try {
        // Get patient data from localStorage (stored during login)
        const userDetailsString = localStorage.getItem("userDetails");

        if (!userDetailsString) {
            throw new Error("No user details found. Please login again.");
        }

        // Parse the patient data
        const patientData = JSON.parse(userDetailsString);
        console.log("Patient data from localStorage:", patientData); // Debug log

        // Return the patient data directly
        return { data: patientData };

    } catch (error) {
        console.error("Error fetching patient profile:", error);
        throw error;
    }
};

export const updatePatientProfile = async (patientId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        // Create JSON Patch operations array
        const patchOperations = [];

        if (updateData.firstName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/firstName",
                "op": "replace",
                "value": updateData.firstName
            });
        }

        if (updateData.lastName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/lastName",
                "op": "replace",
                "value": updateData.lastName
            });
        }

        if (updateData.email) {
            patchOperations.push({
                "operationType": 0,
                "path": "/email",
                "op": "replace",
                "value": updateData.email
            });
        }

        if (updateData.phone) {
            patchOperations.push({
                "operationType": 0,
                "path": "/phone",
                "op": "replace",
                "value": updateData.phone
            });
        }

        if (updateData.address) {
            patchOperations.push({
                "operationType": 0,
                "path": "/address",
                "op": "replace",
                "value": updateData.address
            });
        }

        const response = await axios.patch(`${API_URL}/update/${patientId}`, patchOperations, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        });

        return response;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};