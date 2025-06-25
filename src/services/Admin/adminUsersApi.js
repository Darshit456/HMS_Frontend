// File Location: src/services/Admin/adminUsersApi.js
import axios from "axios";

const DOCTOR_API_URL = "https://localhost:7195/api/Doctor";
const PATIENT_API_URL = "https://localhost:7195/api/Patient";
const USER_API_URL = "https://localhost:7195/api/User";

// Get all doctors (Admin access)
export const getAllDoctors = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching all doctors...");

        const response = await axios.get(`${DOCTOR_API_URL}/All`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin doctors response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching doctors (Admin):", error);
        throw error;
    }
};

// Get all patients (Admin access)
export const getAllPatients = async () => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin fetching all patients...");

        const response = await axios.get(`${PATIENT_API_URL}/All`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin patients response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching patients (Admin):", error);
        throw error;
    }
};

// Delete doctor (Admin only) - Using CASCADE DELETE approach
export const deleteDoctor = async (doctorId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin deleting doctor ID:", doctorId);

        // First get doctor to find UserID
        const doctor = await getDoctorById(doctorId);

        if (doctor.userID) {
            // Delete the User record - this will cascade delete everything!
            const response = await axios.delete(`${USER_API_URL}/delete/${doctor.userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Doctor user deletion response:", response.data);
            return response.data;
        } else {
            // Fallback: delete doctor record directly if no UserID found
            const response = await axios.delete(`${DOCTOR_API_URL}/Delete/${doctorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Doctor deletion response:", response.data);
            return response.data;
        }

    } catch (error) {
        console.error("Error deleting doctor:", error);
        console.error("Backend response:", error.response?.data);

        // If User delete endpoint doesn't exist, fall back to direct doctor deletion
        if (error.response?.status === 404) {
            console.log("User delete endpoint not found, using direct doctor deletion...");
            try {
                const response = await axios.delete(`${DOCTOR_API_URL}/Delete/${doctorId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (fallbackError) {
                console.error("Fallback deletion also failed:", fallbackError);
                throw fallbackError;
            }
        }

        throw error;
    }
};

// Delete patient (Admin only) - Using CASCADE DELETE approach
export const deletePatient = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Admin deleting patient ID:", patientId);

        // First get patient to find UserID
        const patient = await getPatientById(patientId);

        if (patient.userID) {
            // Delete the User record - this will cascade delete everything!
            const response = await axios.delete(`${USER_API_URL}/delete/${patient.userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Patient user deletion response:", response.data);
            return response.data;
        } else {
            // Fallback: delete patient record directly if no UserID found
            const response = await axios.delete(`${PATIENT_API_URL}/Delete/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Patient deletion response:", response.data);
            return response.data;
        }

    } catch (error) {
        console.error("Error deleting patient:", error);
        console.error("Backend response:", error.response?.data);

        // If User delete endpoint doesn't exist, fall back to direct patient deletion
        if (error.response?.status === 404) {
            console.log("User delete endpoint not found, using direct patient deletion...");
            try {
                const response = await axios.delete(`${PATIENT_API_URL}/Delete/${patientId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (fallbackError) {
                console.error("Fallback deletion also failed:", fallbackError);
                throw fallbackError;
            }
        }

        throw error;
    }
};

// Create new admin (Admin only)
export const createAdmin = async (adminData) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Creating new admin with data:", adminData);

        const response = await axios.post(`${USER_API_URL}/create-admin`, adminData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Admin creation response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error creating admin:", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};

// Get doctor by ID (Admin access)
export const getDoctorById = async (doctorId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${DOCTOR_API_URL}/${doctorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        throw error;
    }
};

// Get patient by ID (Admin access)
export const getPatientById = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${PATIENT_API_URL}/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error fetching patient by ID:", error);
        throw error;
    }
};

// Update doctor (Admin access)
export const updateDoctor = async (doctorId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        const patchOperations = [];

        if (updateData.firstName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/FirstName",
                "op": "replace",
                "value": updateData.firstName
            });
        }

        if (updateData.lastName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/LastName",
                "op": "replace",
                "value": updateData.lastName
            });
        }

        if (updateData.email) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Email",
                "op": "replace",
                "value": updateData.email
            });
        }

        if (updateData.phone) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Phone",
                "op": "replace",
                "value": updateData.phone
            });
        }

        if (updateData.specialization) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Specialization",
                "op": "replace",
                "value": updateData.specialization
            });
        }

        if (updateData.address) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Address",
                "op": "replace",
                "value": updateData.address
            });
        }

        console.log("Admin updating doctor with patch operations:", patchOperations);

        const response = await axios.patch(`${DOCTOR_API_URL}/${doctorId}`, patchOperations, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        });

        return response;

    } catch (error) {
        console.error("Error updating doctor (Admin):", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};

// Update patient (Admin access)
export const updatePatient = async (patientId, updateData) => {
    try {
        const token = localStorage.getItem("token");

        const patchOperations = [];

        if (updateData.firstName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/FirstName",
                "op": "replace",
                "value": updateData.firstName
            });
        }

        if (updateData.lastName) {
            patchOperations.push({
                "operationType": 0,
                "path": "/LastName",
                "op": "replace",
                "value": updateData.lastName
            });
        }

        if (updateData.email) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Email",
                "op": "replace",
                "value": updateData.email
            });
        }

        if (updateData.phone) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Phone",
                "op": "replace",
                "value": updateData.phone
            });
        }

        if (updateData.address) {
            patchOperations.push({
                "operationType": 0,
                "path": "/Address",
                "op": "replace",
                "value": updateData.address
            });
        }

        console.log("Admin updating patient with patch operations:", patchOperations);

        const response = await axios.patch(`${PATIENT_API_URL}/update/${patientId}`, patchOperations, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json-patch+json'
            }
        });

        return response;

    } catch (error) {
        console.error("Error updating patient (Admin):", error);
        console.error("Backend response:", error.response?.data);
        throw error;
    }
};