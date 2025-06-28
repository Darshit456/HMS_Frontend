// File Location: src/services/Admin/adminMedicalRecordsApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/MedicalRecords";
const DOCTOR_API_URL = "https://localhost:7195/api/Doctor";
const PATIENT_API_URL = "https://localhost:7195/api/Patient";

// Get all medical records (Admin access)
export const getAllMedicalRecords = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching all medical records...");

        // Since there's no direct "get all" endpoint, we'll need to get all patients
        // and then fetch their records
        const patientsResponse = await axios.get(`${PATIENT_API_URL}/All`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const patients = patientsResponse.data;
        let allRecords = [];

        // Fetch records for each patient
        for (const patient of patients) {
            try {
                const recordsResponse = await axios.get(`${API_URL}/patient/${patient.patientID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Add patient info to each record
                const patientRecords = recordsResponse.data.map(record => ({
                    ...record,
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    patientEmail: patient.email
                }));

                allRecords = [...allRecords, ...patientRecords];
            } catch (error) {
                console.log(`No records found for patient ${patient.patientID}`);
            }
        }

        console.log("Admin medical records response:", allRecords);
        return allRecords;

    } catch (error) {
        console.error("Error fetching all medical records (Admin):", error);
        throw error;
    }
};

// Get medical records for a specific patient (Admin access)
export const getPatientMedicalRecordsAdmin = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching medical records for patient:", patientId);

        const response = await axios.get(`${API_URL}/patient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin patient medical records response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching patient medical records (Admin):", error);
        throw error;
    }
};

// Create new medical record (Admin access)
export const createMedicalRecordAdmin = async (medicalRecordData) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin creating medical record:", medicalRecordData);

        const payload = {
            patientID: medicalRecordData.patientID,
            doctorID: medicalRecordData.doctorID,
            appointmentID: medicalRecordData.appointmentID || null,
            diagnosis: medicalRecordData.diagnosis,
            prescription: medicalRecordData.prescription,
            notes: medicalRecordData.notes || "",
            recordDate: medicalRecordData.recordDate || new Date().toISOString()
        };

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin medical record creation response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error creating medical record (Admin):", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};

// Update medical record (Admin access)
export const updateMedicalRecordAdmin = async (recordId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin updating medical record:", recordId, updateData);

        const payload = {
            diagnosis: updateData.diagnosis,
            prescription: updateData.prescription,
            notes: updateData.notes || "",
            recordDate: updateData.recordDate || new Date().toISOString()
        };

        const response = await axios.put(`${API_URL}/${recordId}`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin medical record update response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating medical record (Admin):", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};

// Delete medical record (Admin access)
export const deleteMedicalRecordAdmin = async (recordId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin deleting medical record:", recordId);

        const response = await axios.delete(`${API_URL}/${recordId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin medical record deletion response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error deleting medical record (Admin):", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};

// Get medical record by ID (Admin access)
export const getMedicalRecordByIdAdmin = async (recordId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching medical record by ID:", recordId);

        const response = await axios.get(`${API_URL}/${recordId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin medical record details:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching medical record details (Admin):", error);
        throw error;
    }
};

// Get medical records statistics (Admin access)
export const getMedicalRecordsStats = async () => {
    try {
        const allRecords = await getAllMedicalRecords();

        const stats = {
            total: allRecords.length,
            thisMonth: allRecords.filter(record => {
                const recordDate = new Date(record.recordDate || record.RecordDate);
                const now = new Date();
                return recordDate.getMonth() === now.getMonth() &&
                    recordDate.getFullYear() === now.getFullYear();
            }).length,
            thisWeek: allRecords.filter(record => {
                const recordDate = new Date(record.recordDate || record.RecordDate);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return recordDate >= weekAgo;
            }).length,
            today: allRecords.filter(record => {
                const recordDate = new Date(record.recordDate || record.RecordDate);
                const today = new Date();
                return recordDate.toDateString() === today.toDateString();
            }).length,
            uniquePatients: new Set(allRecords.map(record => record.patientID || record.PatientID)).size,
            uniqueDoctors: new Set(allRecords.map(record => record.doctorID || record.DoctorID)).size
        };

        console.log("Medical records statistics:", stats);
        return stats;

    } catch (error) {
        console.error("Error fetching medical records statistics:", error);
        return {
            total: 0,
            thisMonth: 0,
            thisWeek: 0,
            today: 0,
            uniquePatients: 0,
            uniqueDoctors: 0
        };
    }
};

// Helper function to get doctor name by ID
export const getDoctorNameById = async (doctorId) => {
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
export const getPatientNameById = async (patientId) => {
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

// Get filtered medical records (Admin access)
export const getFilteredMedicalRecords = async (filters = {}) => {
    try {
        const allRecords = await getAllMedicalRecords();
        let filtered = [...allRecords];

        // Filter by patient
        if (filters.patientId) {
            filtered = filtered.filter(record =>
                (record.patientID || record.PatientID).toString() === filters.patientId
            );
        }

        // Filter by doctor
        if (filters.doctorId) {
            filtered = filtered.filter(record =>
                (record.doctorID || record.DoctorID).toString() === filters.doctorId
            );
        }

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.recordDate || record.RecordDate);
                const filterDate = new Date(filters.date);
                return recordDate.toDateString() === filterDate.toDateString();
            });
        }

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                (record.diagnosis || record.Diagnosis || '').toLowerCase().includes(searchLower) ||
                (record.prescription || record.Prescription || '').toLowerCase().includes(searchLower) ||
                (record.notes || record.Notes || '').toLowerCase().includes(searchLower) ||
                (record.patientName || '').toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => {
            const dateA = new Date(a.recordDate || a.RecordDate || '1970-01-01');
            const dateB = new Date(b.recordDate || b.RecordDate || '1970-01-01');
            return dateB - dateA;
        });

        return filtered;

    } catch (error) {
        console.error("Error fetching filtered medical records:", error);
        throw error;
    }
};

export default {
    getAllMedicalRecords,
    getPatientMedicalRecordsAdmin,
    createMedicalRecordAdmin,
    updateMedicalRecordAdmin,
    deleteMedicalRecordAdmin,
    getMedicalRecordByIdAdmin,
    getMedicalRecordsStats,
    getDoctorNameById,
    getPatientNameById,
    getFilteredMedicalRecords
};