// src/services/photoUploadApi.js
import axios from "axios";

const API_URL = "https://localhost:7195/api/Patient";

export const uploadProfilePhoto = async (patientId, photoFile) => {
    try {
        const token = localStorage.getItem("token");

        if (!photoFile) {
            throw new Error("No photo file provided");
        }

        // Validate file size (5MB)
        if (photoFile.size > 5 * 1024 * 1024) {
            throw new Error("File size must be less than 5MB");
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(photoFile.type)) {
            throw new Error("Only JPG, PNG, GIF, and WebP files are allowed");
        }

        // Create form data
        const formData = new FormData();
        formData.append('photo', photoFile);

        console.log("Uploading photo for patient:", patientId);

        const response = await axios.post(`${API_URL}/${patientId}/upload-photo`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Photo upload response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error uploading photo:", error);
        throw error;
    }
};

export const deleteProfilePhoto = async (patientId) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Deleting photo for patient:", patientId);

        const response = await axios.delete(`${API_URL}/${patientId}/delete-photo`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Photo delete response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error deleting photo:", error);
        throw error;
    }
};