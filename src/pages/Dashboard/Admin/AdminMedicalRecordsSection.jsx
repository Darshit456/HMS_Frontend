// File Location: src/pages/Dashboard/Admin/AdminMedicalRecordsSection.jsx
import React, { useState, useEffect } from 'react';
import {
    getAllMedicalRecords,
    createMedicalRecordAdmin,
    updateMedicalRecordAdmin,
    deleteMedicalRecordAdmin,
    getMedicalRecordsStats,
    getDoctorNameById,
    getPatientNameById,
    getFilteredMedicalRecords
} from '../../../services/Admin/adminMedicalRecordsApi';
import { getAllDoctors, getAllPatients } from '../../../services/Admin/adminUsersApi';

const AdminMedicalRecordsSection = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        doctorId: "",
        patientId: "",
        date: "",
        searchTerm: ""
    });

    // Form states
    const [createFormData, setCreateFormData] = useState({
        patientID: "",
        doctorID: "",
        appointmentID: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        recordDate: ""
    });

    const [editFormData, setEditFormData] = useState({
        recordID: null,
        diagnosis: "",
        prescription: "",
        notes: "",
        recordDate: ""
    });

    // Statistics state
    const [stats, setStats] = useState({
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        today: 0,
        uniquePatients: 0,
        uniqueDoctors: 0
    });

    const [formErrors, setFormErrors] = useState({});

    // Format date display
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Format datetime for input
    const formatDateTimeForInput = (dateString) => {
        try {
            return new Date(dateString).toISOString().slice(0, 16);
        } catch (error) {
            return '';
        }
    };

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Apply filters when filters or records change
    useEffect(() => {
        applyFilters();
    }, [medicalRecords, filters]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Loading admin medical records data...");

            const [recordsData, doctorsData, patientsData, statsData] = await Promise.all([
                getAllMedicalRecords(),
                getAllDoctors(),
                getAllPatients(),
                getMedicalRecordsStats()
            ]);

            // Enhance medical records with doctor names
            const enhancedRecords = await Promise.all(
                recordsData.map(async (record) => {
                    try {
                        const doctorName = await getDoctorNameById(record.doctorID || record.DoctorID);
                        return {
                            ...record,
                            doctorName,
                            id: record.recordID || record.RecordID
                        };
                    } catch (error) {
                        console.error("Error enhancing record:", error);
                        return {
                            ...record,
                            doctorName: "Unknown Doctor",
                            id: record.recordID || record.RecordID
                        };
                    }
                })
            );

            setMedicalRecords(enhancedRecords);
            setDoctors(doctorsData);
            setPatients(patientsData);
            setStats(statsData);

        } catch (err) {
            console.error("Error loading medical records data:", err);
            setError("Failed to load medical records data");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...medicalRecords];

        // Filter by doctor
        if (filters.doctorId) {
            filtered = filtered.filter(record =>
                (record.doctorID || record.DoctorID).toString() === filters.doctorId
            );
        }

        // Filter by patient
        if (filters.patientId) {
            filtered = filtered.filter(record =>
                (record.patientID || record.PatientID).toString() === filters.patientId
            );
        }

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.recordDate || record.RecordDate).toISOString().split('T')[0];
                return recordDate === filters.date;
            });
        }

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                (record.diagnosis || record.Diagnosis || '').toLowerCase().includes(searchLower) ||
                (record.prescription || record.Prescription || '').toLowerCase().includes(searchLower) ||
                (record.notes || record.Notes || '').toLowerCase().includes(searchLower) ||
                (record.patientName || '').toLowerCase().includes(searchLower) ||
                (record.doctorName || '').toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => {
            const dateA = new Date(a.recordDate || a.RecordDate || '1970-01-01');
            const dateB = new Date(b.recordDate || b.RecordDate || '1970-01-01');
            return dateB - dateA;
        });

        setFilteredRecords(filtered);
    };

    // Validate form data
    const validateCreateForm = () => {
        const errors = {};

        if (!createFormData.patientID) errors.patientID = "Patient is required";
        if (!createFormData.doctorID) errors.doctorID = "Doctor is required";
        if (!createFormData.diagnosis.trim()) errors.diagnosis = "Diagnosis is required";
        if (!createFormData.prescription.trim()) errors.prescription = "Prescription is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateEditForm = () => {
        const errors = {};

        if (!editFormData.diagnosis.trim()) errors.diagnosis = "Diagnosis is required";
        if (!editFormData.prescription.trim()) errors.prescription = "Prescription is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle create medical record
    const handleCreateRecord = async (e) => {
        e.preventDefault();
        if (!validateCreateForm()) return;

        try {
            setProcessing('create');

            const createData = {
                patientID: parseInt(createFormData.patientID),
                doctorID: parseInt(createFormData.doctorID),
                appointmentID: createFormData.appointmentID ? parseInt(createFormData.appointmentID) : null,
                diagnosis: createFormData.diagnosis,
                prescription: createFormData.prescription,
                notes: createFormData.notes,
                recordDate: createFormData.recordDate || new Date().toISOString()
            };

            await createMedicalRecordAdmin(createData);
            alert("Medical record created successfully!");

            setShowCreateModal(false);
            setCreateFormData({
                patientID: "",
                doctorID: "",
                appointmentID: "",
                diagnosis: "",
                prescription: "",
                notes: "",
                recordDate: ""
            });
            setFormErrors({});
            loadInitialData();

        } catch (error) {
            console.error("Error creating medical record:", error);
            alert("Failed to create medical record: " + error.message);
        } finally {
            setProcessing(null);
        }
    };

    // Handle edit medical record
    const handleEditRecord = (record) => {
        setEditFormData({
            recordID: record.recordID || record.RecordID,
            diagnosis: record.diagnosis || record.Diagnosis || "",
            prescription: record.prescription || record.Prescription || "",
            notes: record.notes || record.Notes || "",
            recordDate: formatDateTimeForInput(record.recordDate || record.RecordDate)
        });
        setShowEditModal(true);
    };

    const handleUpdateRecord = async (e) => {
        e.preventDefault();
        if (!validateEditForm()) return;

        try {
            setProcessing('edit');

            const updateData = {
                diagnosis: editFormData.diagnosis,
                prescription: editFormData.prescription,
                notes: editFormData.notes,
                recordDate: editFormData.recordDate || new Date().toISOString()
            };

            await updateMedicalRecordAdmin(editFormData.recordID, updateData);
            alert("Medical record updated successfully!");

            setShowEditModal(false);
            setFormErrors({});
            loadInitialData();

        } catch (error) {
            console.error("Error updating medical record:", error);
            alert("Failed to update medical record: " + error.message);
        } finally {
            setProcessing(null);
        }
    };

    // Handle delete medical record
    const handleDeleteRecord = async (recordId, patientName) => {
        if (window.confirm(`Are you sure you want to delete ${patientName}'s medical record? This action cannot be undone.`)) {
            try {
                setProcessing(recordId);
                await deleteMedicalRecordAdmin(recordId);

                setMedicalRecords(prev => prev.filter(record =>
                    (record.recordID || record.RecordID) !== recordId
                ));

                alert("Medical record deleted successfully!");
            } catch (error) {
                console.error("Error deleting medical record:", error);
                alert("Failed to delete medical record: " + error.message);
            } finally {
                setProcessing(null);
            }
        }
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            doctorId: "",
            patientId: "",
            date: "",
            searchTerm: ""
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 animate-pulse">
                        <span className="text-white text-2xl">📋</span>
                    </div>
                    <div className="text-gray-300 text-lg animate-pulse">Loading medical records data...</div>
                    <div className="flex justify-center space-x-1 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <div className="text-red-400 text-lg mb-4">{error}</div>
                    <button
                        onClick={loadInitialData}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-slideIn { animation: slideIn 0.6s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.6s ease-out; }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl">📋</span>
                            </div>
                            Medical Records Management
                        </h2>
                        <p className="text-gray-400 ml-15">Manage all patient medical records</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                            <span className="text-lg">➕</span>
                            <span className="font-medium">Create Record</span>
                        </button>
                        <button
                            onClick={loadInitialData}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                            <span className="text-lg">🔄</span>
                            <span className="font-medium">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
                    {[
                        { label: 'Total Records', value: stats.total, color: 'from-blue-600 to-cyan-600', icon: '📊', bg: 'bg-blue-900/20' },
                        { label: 'This Month', value: stats.thisMonth, color: 'from-emerald-600 to-green-600', icon: '📅', bg: 'bg-emerald-900/20' },
                        { label: 'This Week', value: stats.thisWeek, color: 'from-purple-600 to-indigo-600', icon: '📈', bg: 'bg-purple-900/20' },
                        { label: 'Today', value: stats.today, color: 'from-yellow-600 to-amber-600', icon: '⏰', bg: 'bg-yellow-900/20' },
                        { label: 'Patients', value: stats.uniquePatients, color: 'from-pink-600 to-rose-600', icon: '👥', bg: 'bg-pink-900/20' },
                        { label: 'Doctors', value: stats.uniqueDoctors, color: 'from-indigo-600 to-blue-600', icon: '👨‍⚕️', bg: 'bg-indigo-900/20' }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`${stat.bg} backdrop-blur-sm p-4 rounded-xl border border-gray-600 transition-all duration-300 hover:scale-105 hover:border-gray-500 animate-scaleIn`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                                <span className="text-white text-lg">{stat.icon}</span>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-xs font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600 animate-slideIn">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm">🔍</span>
                    </div>
                    Filters & Search
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Search</label>
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Patient</label>
                        <select
                            value={filters.patientId}
                            onChange={(e) => setFilters({...filters, patientId: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">All Patients</option>
                            {patients.map(patient => (
                                <option key={patient.patientID} value={patient.patientID}>
                                    {patient.firstName} {patient.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Doctor</label>
                        <select
                            value={filters.doctorId}
                            onChange={(e) => setFilters({...filters, doctorId: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map(doctor => (
                                <option key={doctor.doctorID} value={doctor.doctorID}>
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Date</label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({...filters, date: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600 transition-all duration-300"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Medical Records List */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                {filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-4xl">📋</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No medical records found</h3>
                        <p className="text-gray-400">
                            {filters.searchTerm || filters.doctorId || filters.patientId || filters.date
                                ? "Try adjusting your filters"
                                : "Medical records will appear here"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm">📑</span>
                            </div>
                            Medical Records List ({filteredRecords.length})
                        </h3>

                        <div className="grid gap-4">
                            {filteredRecords.map((record, index) => (
                                <div
                                    key={record.id}
                                    className="bg-gradient-to-br from-gray-700/50 to-gray-600/30 border border-gray-600 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white text-xl">📋</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white text-lg">
                                                        {record.patientName}
                                                    </h4>
                                                    <p className="text-sm text-gray-300">
                                                        Treated by {record.doctorName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                                                <div className="space-y-2">
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-blue-400">📅</span>
                                                        <span><strong>Date:</strong> {formatDate(record.recordDate || record.RecordDate)}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-green-400">🆔</span>
                                                        <span><strong>Record ID:</strong> {record.recordID || record.RecordID}</span>
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-purple-400">👤</span>
                                                        <span><strong>Patient ID:</strong> {record.patientID || record.PatientID}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-indigo-400">👨‍⚕️</span>
                                                        <span><strong>Doctor ID:</strong> {record.doctorID || record.DoctorID}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="bg-red-900/20 rounded-lg p-3 border border-red-800/30">
                                                    <p className="text-sm text-gray-300">
                                                        <strong className="text-red-400">Diagnosis:</strong> {(record.diagnosis || record.Diagnosis)?.slice(0, 100) + ((record.diagnosis || record.Diagnosis)?.length > 100 ? '...' : '')}
                                                    </p>
                                                </div>
                                                <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/30">
                                                    <p className="text-sm text-gray-300">
                                                        <strong className="text-green-400">Prescription:</strong> {(record.prescription || record.Prescription)?.slice(0, 100) + ((record.prescription || record.Prescription)?.length > 100 ? '...' : '')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <button
                                                onClick={() => setSelectedRecord(record)}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                                            >
                                                <span>👁️</span>
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => handleEditRecord(record)}
                                                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-medium"
                                            >
                                                <span>✏️</span>
                                                Edit Record
                                            </button>

                                            <button
                                                onClick={() => handleDeleteRecord(record.recordID || record.RecordID, record.patientName)}
                                                disabled={processing === (record.recordID || record.RecordID)}
                                                className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                            >
                                                <span>🗑️</span>
                                                {processing === (record.recordID || record.RecordID) ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Medical Record Modal */}
            {showCreateModal && (
                <CreateMedicalRecordModal
                    formData={createFormData}
                    setFormData={setCreateFormData}
                    doctors={doctors}
                    patients={patients}
                    onSubmit={handleCreateRecord}
                    onClose={() => {
                        setShowCreateModal(false);
                        setCreateFormData({
                            patientID: "",
                            doctorID: "",
                            appointmentID: "",
                            diagnosis: "",
                            prescription: "",
                            notes: "",
                            recordDate: ""
                        });
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    processing={processing === 'create'}
                />
            )}

            {/* Edit Medical Record Modal */}
            {showEditModal && (
                <EditMedicalRecordModal
                    formData={editFormData}
                    setFormData={setEditFormData}
                    onSubmit={handleUpdateRecord}
                    onClose={() => {
                        setShowEditModal(false);
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    processing={processing === 'edit'}
                />
            )}

            {/* Medical Record Details Modal */}
            {selectedRecord && (
                <MedicalRecordDetailsModal
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
};

// Create Medical Record Modal Component
const CreateMedicalRecordModal = ({ formData, setFormData, doctors, patients, onSubmit, onClose, errors, processing }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">➕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Create Medical Record</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Patient *</label>
                        <select
                            value={formData.patientID}
                            onChange={(e) => setFormData({...formData, patientID: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">Select Patient</option>
                            {patients.map(patient => (
                                <option key={patient.patientID} value={patient.patientID}>
                                    {patient.firstName} {patient.lastName} - {patient.email}
                                </option>
                            ))}
                        </select>
                        {errors.patientID && <p className="text-red-400 text-xs mt-1">{errors.patientID}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Doctor *</label>
                        <select
                            value={formData.doctorID}
                            onChange={(e) => setFormData({...formData, doctorID: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500 border-gray-600 transition-all duration-300"
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.doctorID} value={doctor.doctorID}>
                                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                        {errors.doctorID && <p className="text-red-400 text-xs mt-1">{errors.doctorID}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Appointment ID (Optional)</label>
                        <input
                            type="number"
                            value={formData.appointmentID}
                            onChange={(e) => setFormData({...formData, appointmentID: e.target.value})}
                            placeholder="Enter appointment ID if applicable"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Record Date</label>
                        <input
                            type="datetime-local"
                            value={formData.recordDate}
                            onChange={(e) => setFormData({...formData, recordDate: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600 transition-all duration-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Diagnosis *</label>
                    <textarea
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        rows="4"
                        placeholder="Enter detailed diagnosis..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                    {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Prescription & Treatment *</label>
                    <textarea
                        value={formData.prescription}
                        onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                        rows="4"
                        placeholder="Enter prescription and treatment plan..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                    {errors.prescription && <p className="text-red-400 text-xs mt-1">{errors.prescription}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Additional Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows="3"
                        placeholder="Enter any additional notes or observations..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                Create Medical Record
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Edit Medical Record Modal Component
const EditMedicalRecordModal = ({ formData, setFormData, onSubmit, onClose, errors, processing }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">✏️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Edit Medical Record</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Record Date</label>
                    <input
                        type="datetime-local"
                        value={formData.recordDate}
                        onChange={(e) => setFormData({...formData, recordDate: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 border-gray-600 transition-all duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Diagnosis *</label>
                    <textarea
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        rows="4"
                        placeholder="Enter detailed diagnosis..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                    {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Prescription & Treatment *</label>
                    <textarea
                        value={formData.prescription}
                        onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                        rows="4"
                        placeholder="Enter prescription and treatment plan..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                    {errors.prescription && <p className="text-red-400 text-xs mt-1">{errors.prescription}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Additional Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows="3"
                        placeholder="Enter any additional notes or observations..."
                        className="w-full px-4 py-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600 transition-all duration-300 resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                Update Record
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Medical Record Details Modal Component
const MedicalRecordDetailsModal = ({ record, onClose, formatDate }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Medical Record Details</h3>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <span>👤</span> Patient Information
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Name</label>
                                <p className="text-white font-semibold">{record.patientName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Patient ID</label>
                                <p className="text-white">{record.patientID || record.PatientID}</p>
                            </div>
                            {record.patientEmail && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Email</label>
                                    <p className="text-white">{record.patientEmail}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                        <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                            <span>👨‍⚕️</span> Doctor Information
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Doctor</label>
                                <p className="text-white font-semibold">{record.doctorName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Doctor ID</label>
                                <p className="text-white">{record.doctorID || record.DoctorID}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                        <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                            <span>📅</span> Record Details
                        </h4>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Record Date</label>
                                <p className="text-white font-semibold">
                                    {formatDate(record.recordDate || record.RecordDate)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Record ID</label>
                                <p className="text-gray-300 font-mono text-sm bg-gray-800 px-2 py-1 rounded">
                                    {record.recordID || record.RecordID}
                                </p>
                            </div>
                            {(record.appointmentID || record.AppointmentID) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Appointment ID</label>
                                    <p className="text-gray-300 font-mono text-sm bg-gray-800 px-2 py-1 rounded">
                                        {record.appointmentID || record.AppointmentID}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mt-6">
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-800/30">
                    <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <span>🩺</span> Diagnosis
                    </h4>
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-white whitespace-pre-wrap">{record.diagnosis || record.Diagnosis}</p>
                    </div>
                </div>

                <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/30">
                    <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <span>💊</span> Prescription & Treatment
                    </h4>
                    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-white whitespace-pre-wrap">{record.prescription || record.Prescription}</p>
                    </div>
                </div>

                {(record.notes || record.Notes) && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30">
                        <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                            <span>📝</span> Additional Notes
                        </h4>
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="text-white whitespace-pre-wrap">{record.notes || record.Notes}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

export default AdminMedicalRecordsSection;