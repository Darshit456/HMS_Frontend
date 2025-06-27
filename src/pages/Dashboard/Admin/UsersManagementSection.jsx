// File Location: src/pages/Dashboard/Admin/UsersManagementSection.jsx
import React, { useState, useEffect } from 'react';
import { getAllDoctors, getAllPatients, getAllAdmins, deleteDoctor, deletePatient, deleteAdmin, createAdmin } from '../../../services/Admin/adminUsersApi';

const UsersManagementSection = () => {
    const [activeUserType, setActiveUserType] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            setError("");

            const [doctorsResponse, patientsResponse, adminsResponse] = await Promise.all([
                getAllDoctors(),
                getAllPatients(),
                getAllAdmins()
            ]);

            setDoctors(doctorsResponse);
            setPatients(patientsResponse);
            setAdmins(adminsResponse);

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

    const handleDeleteAdmin = async (userId, adminName) => {
        if (window.confirm(`Are you sure you want to delete admin ${adminName}? This action cannot be undone.`)) {
            try {
                await deleteAdmin(userId);
                setAdmins(admins.filter(admin => admin.userID !== userId));
                alert("Admin deleted successfully");
            } catch (error) {
                console.error("Error deleting admin:", error);
                alert("Failed to delete admin: " + error.message);
            }
        }
    };

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        // Username validation
        if (!adminFormData.username.trim()) {
            errors.username = "Username is required";
        } else if (adminFormData.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(adminFormData.username)) {
            errors.username = "Username can only contain letters, numbers, and underscores";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!adminFormData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(adminFormData.email)) {
            errors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!adminFormData.password) {
            errors.password = "Password is required";
        } else if (adminFormData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (passwordStrength < 3) {
            errors.password = "Password is too weak. Use uppercase, lowercase, numbers, and symbols";
        }

        // Confirm password validation
        if (!adminFormData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (adminFormData.password !== adminFormData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setAdminFormData({ ...adminFormData, [field]: value });

        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: "" });
        }

        // Update password strength
        if (field === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = adminFormData;
            await createAdmin(dataToSend);
            alert("Admin created successfully!");
            setShowCreateAdmin(false);
            setAdminFormData({ username: "", email: "", password: "", confirmPassword: "" });
            setFormErrors({});
            setPasswordStrength(0);
            // Refresh the data
            fetchUsersData();
        } catch (error) {
            console.error("Error creating admin:", error);
            alert("Failed to create admin: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center">
                    <div className="text-gray-300 animate-pulse">Loading users data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="text-center">
                    <div className="text-red-400">{error}</div>
                    <button
                        onClick={fetchUsersData}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header with tabs and actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-3xl">👥</span>
                            Users Management
                        </h2>
                        <p className="text-gray-400">Manage doctors, patients, and administrators</p>
                    </div>

                    <button
                        onClick={() => setShowCreateAdmin(true)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                        <span className="text-lg">➕</span>
                        <span className="font-medium">Create Admin</span>
                    </button>
                </div>

                {/* User type tabs */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button
                        onClick={() => setActiveUserType('doctors')}
                        className={`px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                            activeUserType === 'doctors'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                    >
                        <span className="text-lg">👨‍⚕️</span>
                        <span className="font-medium">Doctors ({doctors.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveUserType('patients')}
                        className={`px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                            activeUserType === 'patients'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                    >
                        <span className="text-lg">🏥</span>
                        <span className="font-medium">Patients ({patients.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveUserType('admins')}
                        className={`px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                            activeUserType === 'admins'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                    >
                        <span className="text-lg">🛡️</span>
                        <span className="font-medium">Admins ({admins.length})</span>
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-2xl p-6 border border-gray-600">
                {activeUserType === 'doctors' ? (
                    <DoctorsList doctors={doctors} onDeleteDoctor={handleDeleteDoctor} />
                ) : activeUserType === 'patients' ? (
                    <PatientsList patients={patients} onDeletePatient={handleDeletePatient} />
                ) : (
                    <AdminsList admins={admins} onDeleteAdmin={handleDeleteAdmin} />
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateAdmin && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-600 animate-slideUp max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <span className="text-2xl">👨‍💼</span>
                            Create New Admin
                        </h3>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Username <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={adminFormData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className={`w-full px-4 py-2.5 pl-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                                            formErrors.username
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:ring-purple-500'
                                        }`}
                                        placeholder="Enter username"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400">👤</span>
                                </div>
                                {formErrors.username && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={adminFormData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-2.5 pl-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                                            formErrors.email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:ring-purple-500'
                                        }`}
                                        placeholder="admin@example.com"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400">📧</span>
                                </div>
                                {formErrors.email && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={adminFormData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`w-full px-4 py-2.5 pl-10 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                                            formErrors.password
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:ring-purple-500'
                                        }`}
                                        placeholder="Enter strong password"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                                )}

                                {/* Password Strength Indicator */}
                                {adminFormData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        level <= passwordStrength
                                                            ? passwordStrength <= 2
                                                                ? 'bg-red-500'
                                                                : passwordStrength <= 3
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-green-500'
                                                            : 'bg-gray-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                            passwordStrength <= 2
                                                ? 'text-red-400'
                                                : passwordStrength <= 3
                                                    ? 'text-yellow-400'
                                                    : 'text-green-400'
                                        }`}>
                                            Password strength: {
                                            passwordStrength === 0 ? 'Very Weak' :
                                                passwordStrength === 1 ? 'Weak' :
                                                    passwordStrength === 2 ? 'Fair' :
                                                        passwordStrength === 3 ? 'Good' :
                                                            passwordStrength === 4 ? 'Strong' :
                                                                'Very Strong'
                                        }
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Confirm Password <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={adminFormData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`w-full px-4 py-2.5 pl-10 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                                            formErrors.confirmPassword
                                                ? 'border-red-500 focus:ring-red-500'
                                                : adminFormData.confirmPassword && adminFormData.password === adminFormData.confirmPassword
                                                    ? 'border-green-500 focus:ring-green-500'
                                                    : 'border-gray-600 focus:ring-purple-500'
                                        }`}
                                        placeholder="Re-enter password"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                    {adminFormData.confirmPassword && adminFormData.password === adminFormData.confirmPassword && (
                                        <span className="absolute right-10 top-3 text-green-400">✓</span>
                                    )}
                                </div>
                                {formErrors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
                                <p className="font-medium text-gray-300 mb-1">Password Requirements:</p>
                                <ul className="space-y-1">
                                    <li className={adminFormData.password.length >= 8 ? 'text-green-400' : ''}>
                                        • At least 8 characters
                                    </li>
                                    <li className={/[a-z]/.test(adminFormData.password) && /[A-Z]/.test(adminFormData.password) ? 'text-green-400' : ''}>
                                        • Mix of uppercase and lowercase letters
                                    </li>
                                    <li className={/[0-9]/.test(adminFormData.password) ? 'text-green-400' : ''}>
                                        • At least one number
                                    </li>
                                    <li className={/[^A-Za-z0-9]/.test(adminFormData.password) ? 'text-green-400' : ''}>
                                        • At least one special character
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={Object.keys(formErrors).length > 0}
                                >
                                    Create Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateAdmin(false);
                                        setAdminFormData({ username: "", email: "", password: "", confirmPassword: "" });
                                        setFormErrors({});
                                        setPasswordStrength(0);
                                        setShowPassword(false);
                                        setShowConfirmPassword(false);
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-slideUp { animation: slideUp 0.3s ease-out; }
            `}</style>
        </div>
    );
};

// Doctors List Component
const DoctorsList = ({ doctors, onDeleteDoctor }) => {
    if (doctors.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                <div className="text-gray-400 text-lg">No doctors found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <span className="text-white text-sm">👨‍⚕️</span>
                </span>
                Doctors List
            </h3>

            <div className="grid gap-4">
                {doctors.map((doctor, index) => (
                    <div
                        key={doctor.doctorID}
                        className="bg-gradient-to-br from-gray-700 to-gray-600 p-5 rounded-xl border border-gray-600 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xl">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h4>
                                        <p className="text-sm text-emerald-400 font-medium">{doctor.specialization}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-300 space-y-1.5 pl-15">
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📧</span>
                                        {doctor.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📱</span>
                                        {doctor.phone}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📍</span>
                                        {doctor.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onDeleteDoctor(doctor.doctorID, `${doctor.firstName} ${doctor.lastName}`)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                    <span>🗑️</span>
                                    Delete
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
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏥</div>
                <div className="text-gray-400 text-lg">No patients found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white text-sm">🏥</span>
                </span>
                Patients List
            </h3>

            <div className="grid gap-4">
                {patients.map((patient, index) => (
                    <div
                        key={patient.patientID}
                        className="bg-gradient-to-br from-gray-700 to-gray-600 p-5 rounded-xl border border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xl">🏥</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg">
                                            {patient.firstName} {patient.lastName}
                                        </h4>
                                        <p className="text-sm text-blue-400 font-medium">{patient.gender}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-300 space-y-1.5 pl-15">
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📧</span>
                                        {patient.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📱</span>
                                        {patient.phone}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">🎂</span>
                                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📍</span>
                                        {patient.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onDeletePatient(patient.patientID, `${patient.firstName} ${patient.lastName}`)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                    <span>🗑️</span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Admins List Component
const AdminsList = ({ admins, onDeleteAdmin }) => {
    const currentUserId = JSON.parse(localStorage.getItem("userDetails") || "{}").userID;

    if (admins.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛡️</div>
                <div className="text-gray-400 text-lg">No administrators found</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-white text-sm">🛡️</span>
                </span>
                Administrators List
            </h3>

            <div className="grid gap-4">
                {admins.map((admin, index) => (
                    <div
                        key={admin.userID}
                        className="bg-gradient-to-br from-gray-700 to-gray-600 p-5 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xl">👨‍💼</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                                            {admin.username}
                                            {currentUserId === admin.userID && (
                                                <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-purple-400 font-medium">System Administrator</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-300 space-y-1.5 pl-15">
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">📧</span>
                                        {admin.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">🆔</span>
                                        ID: {admin.userID}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-gray-400">🛡️</span>
                                        Full System Access
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {currentUserId !== admin.userID ? (
                                    <button
                                        onClick={() => onDeleteAdmin(admin.userID, admin.username)}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                    >
                                        <span>🗑️</span>
                                        Delete
                                    </button>
                                ) : (
                                    <span className="text-gray-400 text-sm italic px-4 py-2">
                                        Cannot delete yourself
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersManagementSection;