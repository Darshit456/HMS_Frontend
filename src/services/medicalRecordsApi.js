// src/services/medicalRecordsApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/MedicalRecords";

export const getPatientMedicalRecords = async () => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const patientData = JSON.parse(userDetails);
        const patientID = patientData.patientID;

        console.log("Fetching medical records for patient ID:", patientID);

        const response = await axios.get(`${API_URL}/patient/${patientID}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Medical records response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching medical records:", error);
        throw error;
    }
};