// src/services/loginApi.js
import axios from "axios";

// Updated API URL with the correct port number from your Swagger UI
const API_URL = "https://localhost:7195/api/User/login";

export const loginUser = async (credentials) => {
    console.log("Attempting to login with:", credentials);
    console.log("API URL:", API_URL);

    try {
        const response = await axios.post(API_URL, credentials);
        console.log("Login response:", response);
        return response;
    } catch (error) {
        console.error("Login error details:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
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