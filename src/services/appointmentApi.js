// src/services/appointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment"; // Changed to HTTPS

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

export const createAppointment = async (appointmentData) => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const patientData = JSON.parse(userDetails);

        // FIX: Check for different possible field names
        const patientID = patientData.PatientID || patientData.patientID || patientData.patientId;

        if (!patientID) {
            console.error("Patient data structure:", patientData);
            throw new Error("Patient ID not found in user data. Please login again.");
        }

        const appointmentPayload = {
            patientID: patientID, // Now using the correct field
            doctorID: appointmentData.doctorID,
            reason: appointmentData.reason,
            appointmentDateTime: appointmentData.appointmentDateTime
        };

        console.log("Creating appointment with payload:", appointmentPayload);

        const response = await axios.post(`${API_URL}/Create`, appointmentPayload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error creating appointment:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};