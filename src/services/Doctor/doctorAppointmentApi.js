// src/services/Doctor/doctorAppointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";

export const getDoctorAppointments = async () => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const doctorData = JSON.parse(userDetails);
        const doctorID = doctorData.doctorID;

        console.log("Fetching appointments for doctor ID:", doctorID);

        // Try different possible endpoints based on your backend structure
        let response;
        try {
            // First try: /api/Appointment/doctor/{doctorId}
            response = await axios.get(`${API_URL}/doctor/${doctorID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            if (error.response?.status === 404) {
                // Second try: /api/Appointment?doctorId={doctorId}
                response = await axios.get(`${API_URL}?doctorId=${doctorID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                throw error;
            }
        }

        console.log("Doctor appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        throw error;
    }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Updating appointment status:", appointmentId, "to", status);

        // Try different possible endpoints for updating appointment status
        let response;
        try {
            // First try: PUT /api/Appointment/{id}/status
            response = await axios.put(
                `${API_URL}/${appointmentId}/status`,
                { status: status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            if (error.response?.status === 404) {
                // Second try: PATCH /api/Appointment/{id}
                const patchOperations = [{
                    "operationType": 0,
                    "path": "/Status",
                    "op": "replace",
                    "value": status
                }];

                response = await axios.patch(
                    `${API_URL}/${appointmentId}`,
                    patchOperations,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json-patch+json'
                        }
                    }
                );
            } else {
                throw error;
            }
        }

        console.log("Appointment status update response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating appointment status:", error);
        throw error;
    }
};

export const getTodayAppointments = async () => {
    try {
        const token = localStorage.getItem("token");
        const userDetails = localStorage.getItem("userDetails");

        if (!userDetails) {
            throw new Error("No user details found. Please login again.");
        }

        const doctorData = JSON.parse(userDetails);
        const doctorID = doctorData.doctorID;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        console.log("Fetching today's appointments for doctor ID:", doctorID, "Date:", today);

        const response = await axios.get(`${API_URL}/doctor/${doctorID}/date/${today}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Today's appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        // Fallback to all appointments if today's endpoint doesn't exist
        return getDoctorAppointments();
    }
};