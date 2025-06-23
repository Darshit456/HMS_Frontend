// src/services/Doctor/completeAppointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";

/**
 * Mark an appointment as completed using your exact API endpoint
 * @param {string} appointmentId - The appointment ID (token)
 * @param {string} completionNotes - Optional notes from doctor about the appointment (for future use)
 * @returns {Promise} - API response
 */
export const markAppointmentComplete = async (appointmentId, completionNotes = "") => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found. Please login again.");
        }

        console.log("=== MARKING APPOINTMENT AS COMPLETE ===");
        console.log("Appointment ID:", appointmentId);
        console.log("Completion Notes:", completionNotes);
        console.log("API URL:", `${API_URL}/${appointmentId}/UpdateStatus`);

        // Use your exact API endpoint structure
        const response = await axios.put(
            `${API_URL}/${appointmentId}/UpdateStatus`,
            `"Completed"`,  // Send as JSON string exactly like your curl example
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'  // Exact content-type from your curl
                }
            }
        );

        console.log("=== APPOINTMENT COMPLETION SUCCESSFUL ===");
        console.log("Response:", response.data);
        return response.data;

    } catch (error) {
        console.error("=== ERROR MARKING APPOINTMENT AS COMPLETE ===");
        console.error("Error details:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Full error object:", error);
        throw error;
    }
};

/**
 * Mark appointment as complete with additional medical data (for future use)
 * @param {string} appointmentId - The appointment ID
 * @param {Object} medicalData - Medical completion data (for future implementation)
 * @returns {Promise} - API response
 */
export const markAppointmentCompleteWithMedicalData = async (appointmentId, medicalData) => {
    try {
        const {
            diagnosis = "",
            prescription = "",
            doctorNotes = "",
            followUpRequired = false,
            followUpDate = null,
            vitalSigns = {},
            treatmentPlan = ""
        } = medicalData;

        // For now, just mark as completed - medical data storage can be implemented later
        console.log("Medical data provided (for future use):", {
            diagnosis,
            prescription,
            doctorNotes,
            followUpRequired,
            followUpDate,
            vitalSigns,
            treatmentPlan
        });

        return await markAppointmentComplete(appointmentId, doctorNotes);

    } catch (error) {
        console.error("Error marking appointment complete with medical data:", error);
        throw error;
    }
};

/**
 * Get appointment completion history for a doctor
 * @returns {Promise} - List of completed appointments
 */
export const getCompletedAppointments = async () => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const doctorData = JSON.parse(userDetails);
        const doctorID = doctorData.doctorID;

        console.log("Fetching completed appointments for doctor:", doctorID);

        const response = await axios.get(`${API_URL}/doctor/${doctorID}/completed`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Completed appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching completed appointments:", error);

        // If specific endpoint doesn't exist, fallback to filtering all appointments
        try {
            const { getDoctorAppointments } = await import('./doctorAppointmentApi.js');
            const allAppointments = await getDoctorAppointments();

            const completedAppointments = allAppointments.filter(
                appointment => appointment.status && appointment.status.toLowerCase() === 'completed'
            );

            return completedAppointments;
        } catch (fallbackError) {
            console.error("Fallback method also failed:", fallbackError);
            throw error;
        }
    }
};

/**
 * Undo appointment completion (if needed) - using your API structure
 * @param {string} appointmentId - The appointment ID
 * @param {string} newStatus - The status to change back to (e.g., "Accepted")
 * @returns {Promise} - API response
 */
export const undoAppointmentCompletion = async (appointmentId, newStatus = "Accepted") => {
    try {
        const token = localStorage.getItem("token");

        console.log("Undoing appointment completion:", appointmentId, "New Status:", newStatus);

        const response = await axios.put(
            `${API_URL}/${appointmentId}/UpdateStatus`,
            `"${newStatus}"`,  // Send as JSON string like your API expects
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("Undo completion successful:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error undoing appointment completion:", error);
        throw error;
    }
};