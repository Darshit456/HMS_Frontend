// File Location: src/services/Admin/adminAppointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";
const DOCTOR_API_URL = "https://localhost:7195/api/Doctor";
const PATIENT_API_URL = "https://localhost:7195/api/Patient";

// Get all appointments (Admin access)
export const getAllAppointments = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching all appointments...");

        const response = await axios.get(`${API_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching all appointments (Admin):", error);
        throw error;
    }
};

// Get appointments by doctor ID (Admin access)
export const getAppointmentsByDoctor = async (doctorId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching appointments for doctor:", doctorId);

        const response = await axios.get(`${API_URL}/doctor/${doctorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin doctor appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching doctor appointments (Admin):", error);
        throw error;
    }
};

// Get appointments by patient ID (Admin access)
export const getAppointmentsByPatient = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching appointments for patient:", patientId);

        // Use the general endpoint with patient filter
        const response = await axios.get(`${API_URL}?patientId=${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin patient appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching patient appointments (Admin):", error);
        throw error;
    }
};

// Update appointment status (Admin access)
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin updating appointment status:", appointmentId, "to", newStatus);

        const response = await axios.put(
            `${API_URL}/${appointmentId}/UpdateStatus`,
            `"${newStatus}"`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("Admin appointment status update response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating appointment status (Admin):", error);
        throw error;
    }
};

// Delete appointment (Admin access)
export const deleteAppointment = async (appointmentId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin deleting appointment:", appointmentId);

        const response = await axios.delete(`${API_URL}/${appointmentId}/Delete`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin appointment deletion response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error deleting appointment (Admin):", error);
        throw error;
    }
};

// Get appointment statistics (Admin access)
export const getAppointmentStats = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching appointment statistics...");

        const response = await axios.get(`${API_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const appointments = response.data;

        // Calculate statistics
        const stats = {
            total: appointments.length,
            pending: appointments.filter(apt => apt.status?.toLowerCase() === 'pending').length,
            accepted: appointments.filter(apt => apt.status?.toLowerCase() === 'accepted').length,
            completed: appointments.filter(apt => apt.status?.toLowerCase() === 'completed').length,
            rejected: appointments.filter(apt => apt.status?.toLowerCase() === 'rejected').length,
            today: appointments.filter(apt => {
                const today = new Date().toDateString();
                const appointmentDate = new Date(apt.dateTime).toDateString();
                return appointmentDate === today;
            }).length
        };

        console.log("Admin appointment statistics:", stats);
        return stats;

    } catch (error) {
        console.error("Error fetching appointment statistics (Admin):", error);
        throw error;
    }
};

// Get filtered appointments (Admin access)
export const getFilteredAppointments = async (filters = {}) => {
    try {
        const token = localStorage.getItem("token");
        const { doctorId, patientId, status, date } = filters;

        console.log("Admin fetching filtered appointments with filters:", filters);

        // Build query parameters
        const params = new URLSearchParams();
        if (doctorId) params.append('doctorId', doctorId);
        if (patientId) params.append('patientId', patientId);
        if (status) params.append('status', status);
        if (date) params.append('date', date);

        const queryString = params.toString();
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin filtered appointments response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching filtered appointments (Admin):", error);
        throw error;
    }
};

// Get appointment details by ID (Admin access)
export const getAppointmentById = async (appointmentId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching appointment details:", appointmentId);

        // Since there's no direct endpoint for single appointment,
        // we'll get all appointments and filter
        const allAppointments = await getAllAppointments();
        const appointment = allAppointments.find(apt => apt.token === appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        console.log("Admin appointment details:", appointment);
        return appointment;

    } catch (error) {
        console.error("Error fetching appointment details (Admin):", error);
        throw error;
    }
};

// Helper function to get doctor name by ID
export const getDoctorName = async (doctorId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${DOCTOR_API_URL}/${doctorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const doctor = response.data;
        return `Dr. ${doctor.firstName} ${doctor.lastName}`;

    } catch (error) {
        console.error("Error fetching doctor name:", error);
        return "Unknown Doctor";
    }
};

// Helper function to get patient name by ID
export const getPatientName = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${PATIENT_API_URL}/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const patient = response.data;
        return `${patient.firstName} ${patient.lastName}`;

    } catch (error) {
        console.error("Error fetching patient name:", error);
        return "Unknown Patient";
    }
};