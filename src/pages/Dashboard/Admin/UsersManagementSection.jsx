// File Location: src/pages/Dashboard/Admin/UsersManagementSection.jsx
import React, { useState, useEffect } from 'react';
import { getAllDoctors, getAllPatients, deleteDoctor, deletePatient, createAdmin } from '../../../services/Admin/adminUsersApi';

const UsersManagementSection = () => {
    const [activeUserType, setActiveUserType] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            setError("");

            const [doctorsResponse, patientsResponse] = await Promise.all([
                getAllDoctors(),
                getAllPatients()
            ]);

            setDoctors(doctorsResponse);
            setPatients(patientsResponse);

        } catch (err) {
            console.error("Error fetching users data:", err);
            setError("Failed to load users data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDoctor = async (doctorId, doctorName) => {
        if (window.confirm(`Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`)) {
            try {
                await deleteDoctor(doctorId);
                setDoctors(doctors.filter(doc => doc.doctorID !== doctorId));
                alert("Doctor deleted successfully");
            } catch (error) {
                console.error("Error deleting doctor:", error);
                alert("Failed to delete doctor: " + error.message);
            }
        }
    };

    const handleDeletePatient = async (patientId, patientName) => {
        if (window.confirm(`Are you sure you want to delete ${patientName}? This action cannot be undone.`)) {
            try {
                await deletePatient(patientId);
                setPatients(patients.filter(patient => patient.patientID !== patientId));
                alert("Patient deleted successfully");
            } catch (error) {
                console.error("Error deleting patient:", error);
                alert("Failed to delete patient: " + error.message);
            }
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await createAdmin(adminFormData);
            alert("Admin created successfully!");
            setShowCreateAdmin(false);
            setAdminFormData({ username: "", email: "", password: "" });
        } catch (error) {
            console.error("Error creating admin:", error);
            alert("Failed to create admin: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
                <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-300">Loading users data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
                <div className="text-center">
                    <div className="text-red-500">{error}</div>
                    <button
                        onClick={fetchUsersData}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with tabs and actions */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Users Management</h2>
                        <p className="text-gray-600 dark:text-gray-400">Manage doctors, patients, and administrators</p>
                    </div>

                    <button
                        onClick={() => setShowCreateAdmin(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        👨‍💼 Create Admin
                    </button>
                </div>

                {/* User type tabs */}
                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => setActiveUserType('doctors')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeUserType === 'doctors'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        👨‍⚕️ Doctors ({doctors.length})
                    </button>
                    <button
                        onClick={() => setActiveUserType('patients')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeUserType === 'patients'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        🏥 Patients ({patients.length})
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
                {activeUserType === 'doctors' ? (
                    <DoctorsList doctors={doctors} onDeleteDoctor={handleDeleteDoctor} />
                ) : (
                    <PatientsList patients={patients} onDeletePatient={handleDeletePatient} />
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateAdmin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Admin</h3>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={adminFormData.username}
                                    onChange={(e) => setAdminFormData({...adminFormData, username: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={adminFormData.email}
                                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={adminFormData.password}
                                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                                >
                                    Create Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateAdmin(false)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Doctors List Component
const DoctorsList = ({ doctors, onDeleteDoctor }) => {
    if (doctors.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">No doctors found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Doctors List</h3>

            <div className="grid gap-4">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.doctorID}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 dark:text-green-300 text-lg">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h4>
                                        <p className="text-sm text-green-600 dark:text-green-400">{doctor.specialization}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><span className="font-medium">Email:</span> {doctor.email}</p>
                                    <p><span className="font-medium">Phone:</span> {doctor.phone}</p>
                                    <p><span className="font-medium">Address:</span> {doctor.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onDeleteDoctor(doctor.doctorID, `${doctor.firstName} ${doctor.lastName}`)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Patients List Component
const PatientsList = ({ patients, onDeletePatient }) => {
    if (patients.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">No patients found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Patients List</h3>

            <div className="grid gap-4">
                {patients.map((patient) => (
                    <div
                        key={patient.patientID}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-300 text-lg">🏥</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white">
                                            {patient.firstName} {patient.lastName}
                                        </h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">{patient.gender}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><span className="font-medium">Email:</span> {patient.email}</p>
                                    <p><span className="font-medium">Phone:</span> {patient.phone}</p>
                                    <p><span className="font-medium">DOB:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Address:</span> {patient.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onDeletePatient(patient.patientID, `${patient.firstName} ${patient.lastName}`)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersManagementSection;