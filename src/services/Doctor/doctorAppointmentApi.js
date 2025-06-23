// src/services/Doctor/doctorAppointmentApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Appointment";
const PATIENT_API_URL = "https://localhost:7195/api/Patient";

// Get patient details by ID
const getPatientDetails = async (patientId, token) => {
    try {
        console.log(`=== FETCHING PATIENT DETAILS FOR ID: ${patientId} ===`);
        console.log(`API URL: ${PATIENT_API_URL}/${patientId}`);

        const response = await axios.get(`${PATIENT_API_URL}/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Patient ${patientId} API response:`, response.data);
        console.log(`Patient ${patientId} available keys:`, Object.keys(response.data));

        const patient = response.data;
        const result = {
            phone: patient.phone || patient.Phone || 'Phone not available',
            email: patient.email || patient.Email || 'Email not available'
        };

        console.log(`Patient ${patientId} extracted details:`, result);
        return result;

    } catch (error) {
        console.error(`=== FAILED TO GET PATIENT ${patientId} DETAILS ===`);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
        console.error('Full error:', error);

        return {
            phone: 'Phone fetch failed',
            email: 'Email fetch failed'
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

        // Get appointments
        let response;
        try {
            response = await axios.get(`${API_URL}/doctor/${doctorID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            if (error.response?.status === 404) {
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

        console.log("Appointments response:", response.data);

        // Now enhance each appointment with patient details
        const appointmentsWithPatientDetails = await Promise.all(
            response.data.map(async (appointment) => {
                console.log("Processing appointment:", appointment);

                // Get PatientID from appointment response
                const patientId = appointment.patientID;

                if (patientId) {
                    // Fetch patient details
                    const patientDetails = await getPatientDetails(patientId, token);

                    // Combine appointment with patient details
                    return {
                        ...appointment,
                        patientPhone: patientDetails.phone,
                        patientEmail: patientDetails.email
                    };
                } else {
                    console.warn("No PatientID found in appointment:", appointment);
                    return {
                        ...appointment,
                        patientPhone: 'PatientID not found',
                        patientEmail: 'PatientID not found'
                    };
                }
            })
        );

        console.log("Appointments with patient details:", appointmentsWithPatientDetails);
        return appointmentsWithPatientDetails;

    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        throw error;
    }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Updating appointment status:", appointmentId, "to", status);

        let response;
        try {
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