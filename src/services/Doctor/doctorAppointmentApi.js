// src/services/Doctor/doctorAppointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";
const PATIENT_API_URL = "https://localhost:7195/api/Patient";

// Helper function to get patient details
const getPatientDetails = async (patientId, token) => {
    try {
        console.log(`Fetching patient details for ID: ${patientId}`);

        const response = await axios.get(`${PATIENT_API_URL}/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Patient ${patientId} details:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to get patient ${patientId} details:`, error);
        return {
            firstName: 'Unknown',
            lastName: 'Patient',
            phone: 'N/A',
            email: 'N/A'
        };
    }
};

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

        // Your API already returns patient names! No need for separate calls
        // Just transform the data to match expected format
        const transformedAppointments = response.data.map(appointment => ({
            appointmentID: appointment.token,
            patientID: appointment.patientID || null,
            doctorID: appointment.doctorID || doctorID,
            appointmentDateTime: appointment.appointmentDateTime,
            status: appointment.status,
            reason: appointment.reason,
            // Use the patient name that's already in the response
            patientFirstName: appointment.patientName ? appointment.patientName.split(' ')[0] : 'Unknown',
            patientLastName: appointment.patientName ? appointment.patientName.split(' ').slice(1).join(' ') : 'Patient',
            patientPhone: appointment.patientPhone || 'N/A',
            patientEmail: appointment.patientEmail || 'N/A'
        }));

        console.log("Transformed appointments:", transformedAppointments);
        return transformedAppointments;

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
        // Get all appointments and filter for today in frontend
        const allAppointments = await getDoctorAppointments();

        // Filter for today's appointments
        const today = new Date().toDateString();
        const todayAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDateTime).toDateString();
            return appointmentDate === today;
        });

        console.log("Today's appointments:", todayAppointments);
        return todayAppointments;

    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        throw error;
    }
};