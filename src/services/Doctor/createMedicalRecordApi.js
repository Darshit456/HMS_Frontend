// File: src/services/Doctor/createMedicalRecordApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/MedicalRecords";

/**
 * Create a new medical record for a patient
 * @param {Object} medicalRecordData - Medical record data
 * @returns {Promise} - API response
 */
export const createMedicalRecord = async (medicalRecordData) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found. Please login again.");
        }

        console.log("=== CREATING MEDICAL RECORD ===");
        console.log("Medical record data:", medicalRecordData);

        // Prepare the payload according to your MedicalRecordDTO structure
        const payload = {
            patientID: medicalRecordData.patientID,
            doctorID: medicalRecordData.doctorID,
            appointmentID: medicalRecordData.appointmentID,
            diagnosis: medicalRecordData.diagnosis,
            prescription: medicalRecordData.prescription,
            notes: medicalRecordData.notes || "",
            recordDate: medicalRecordData.recordDate || new Date().toISOString()
        };

        console.log("API payload:", payload);

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("=== MEDICAL RECORD CREATED SUCCESSFULLY ===");
        console.log("Response:", response.data);
        return response.data;

    } catch (error) {
        console.error("=== ERROR CREATING MEDICAL RECORD ===");
        console.error("Error details:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        // Handle specific error cases
        if (error.response?.status === 400) {
            throw new Error("Invalid medical record data. Please check all required fields.");
        } else if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please login again.");
        } else if (error.response?.status === 403) {
            throw new Error("Access denied. Only doctors can create medical records.");
        } else if (error.response?.status === 404) {
            throw new Error("Patient or appointment not found.");
        } else {
            throw new Error(`Failed to create medical record: ${error.message}`);
        }
    }
};

/**
 * Get medical records for a specific patient (for doctors)
 * @param {number} patientId - Patient ID
 * @returns {Promise} - List of medical records
 */
export const getPatientMedicalRecordsForDoctor = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found. Please login again.");
        }

        console.log("Fetching medical records for patient:", patientId);

        const response = await axios.get(`${API_URL}/patient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Medical records response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching patient medical records:", error);
        throw error;
    }
};

/**
 * Update an existing medical record
 * @param {number} recordId - Medical record ID
 * @param {Object} updateData - Updated medical record data
 * @returns {Promise} - API response
 */
export const updateMedicalRecord = async (recordId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found. Please login again.");
        }

        console.log("Updating medical record:", recordId, updateData);

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

        console.log("Medical record updated successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating medical record:", error);
        throw error;
    }
};

/**
 * Delete a medical record (Admin only)
 * @param {number} recordId - Medical record ID
 * @returns {Promise} - API response
 */
export const deleteMedicalRecord = async (recordId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No authentication token found. Please login again.");
        }

        console.log("Deleting medical record:", recordId);

        const response = await axios.delete(`${API_URL}/${recordId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Medical record deleted successfully");
        return response.data;

    } catch (error) {
        console.error("Error deleting medical record:", error);
        throw error;
    }
};

/**
 * Validate medical record data before submission
 * @param {Object} medicalRecordData - Medical record data to validate
 * @returns {Object} - Validation result
 */
export const validateMedicalRecordData = (medicalRecordData) => {
    const errors = [];

    // Required fields validation
    if (!medicalRecordData.patientID) {
        errors.push("Patient ID is required");
    }

    if (!medicalRecordData.doctorID) {
        errors.push("Doctor ID is required");
    }

    if (!medicalRecordData.appointmentID) {
        errors.push("Appointment ID is required");
    }

    if (!medicalRecordData.diagnosis || medicalRecordData.diagnosis.trim() === "") {
        errors.push("Diagnosis is required");
    }

    if (!medicalRecordData.prescription || medicalRecordData.prescription.trim() === "") {
        errors.push("Prescription/Treatment is required");
    }

    // Length validations (based on your model constraints)
    if (medicalRecordData.diagnosis && medicalRecordData.diagnosis.length > 255) {
        errors.push("Diagnosis must be less than 255 characters");
    }

    if (medicalRecordData.prescription && medicalRecordData.prescription.length > 500) {
        errors.push("Prescription must be less than 500 characters");
    }

    if (medicalRecordData.notes && medicalRecordData.notes.length > 1000) {
        errors.push("Notes must be less than 1000 characters");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

export default {
    createMedicalRecord,
    getPatientMedicalRecordsForDoctor,
    updateMedicalRecord,
    deleteMedicalRecord,
    validateMedicalRecordData
};