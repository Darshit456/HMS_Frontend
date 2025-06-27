// src/services/doctorRegistrationApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Doctor/register";

export const registerDoctor = async (doctorData) => {
    try {
        console.log("Attempting to register doctor with:", doctorData);
        console.log("API URL:", API_URL);

        const response = await axios.post(API_URL, doctorData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Doctor registration response:", response);
        return response;

    } catch (error) {
        console.error("Doctor registration error details:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);

            // Handle specific error cases
            if (error.response.status === 400) {
                const errorMessage = error.response.data?.message || "Doctor registration failed. Please check your information.";
                if (errorMessage.toLowerCase().includes('email')) {
                    throw new Error("Email already exists. Please use a different email address.");
                }
                throw new Error(errorMessage);
            } else if (error.response.status === 409) {
                throw new Error("Email already exists. Please use a different email address.");
            }

            throw error;
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            throw new Error("Network error. No response from server.");
        } else {
            // Something happened in setting up the request
            console.error("Error message:", error.message);
            throw new Error("Error setting up request: " + error.message);
        }
    }
};