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