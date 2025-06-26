// src/services/doctorsApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Doctor"; // Changed to HTTPS

export const getAllDoctors = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Fetching all doctors...");

        const response = await axios.get(`${API_URL}/All`, { // Added /All to the endpoint
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Doctors response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
};

// Add this new function to fetch a doctor by ID
export const getDoctorById = async (doctorId) => {
    try {
        const token = localStorage.getItem("token");

        console.log(`Fetching doctor with ID: ${doctorId}`);

        const response = await axios.get(`${API_URL}/${doctorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Doctor response:", response.data);
        return response.data;

    } catch (error) {
        console.error(`Error fetching doctor ${doctorId}:`, error);
        throw error;
    }
};