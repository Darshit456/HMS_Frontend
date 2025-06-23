// src/services/Doctor/patientRequestsApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Updating appointment status:", appointmentId, "to", status);

        const response = await axios.put(
            `${API_URL}/${appointmentId}/UpdateStatus`,
            `"${status}"`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("Appointment status update response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating appointment status:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};