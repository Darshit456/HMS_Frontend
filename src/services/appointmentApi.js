// src/services/appointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";

export const getPatientAppointments = async () => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const patientData = JSON.parse(userDetails);
        console.log("Fetching appointments for patient:", patientData.firstName, patientData.lastName);

        const response = await axios.get(`${API_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("API Response:", response.data);

        // Since API already returns patient-specific appointments, no need to filter
        // Just return the appointments directly
        return response.data;

    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};