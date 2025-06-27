// File Location: src/pages/Dashboard/Admin/UsersManagementSection.jsx
import React, { useState, useEffect } from 'react';
import { getAllDoctors, getAllPatients, getAllAdmins, deleteDoctor, deletePatient, deleteAdmin, createAdmin, updateAdmin, updateDoctor, updatePatient } from '../../../services/Admin/adminUsersApi';
import { registerDoctor } from '../../../services/Admin/doctorRegistrationApi';
import { registerPatient } from '../../../services/signupApi';

const UsersManagementSection = () => {
    const [activeUserType, setActiveUserType] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Admin modals
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [showEditAdmin, setShowEditAdmin] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [editAdminData, setEditAdminData] = useState({
        userId: null,
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Doctor modals
    const [showCreateDoctor, setShowCreateDoctor] = useState(false);
    const [showEditDoctor, setShowEditDoctor] = useState(false);
    const [doctorFormData, setDoctorFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        address: "",
        password: "",
        confirmPassword: ""
    });
    const [editDoctorData, setEditDoctorData] = useState({
        doctorID: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        address: ""
    });

    // Patient modals
    const [showCreatePatient, setShowCreatePatient] = useState(false);
    const [showEditPatient, setShowEditPatient] = useState(false);
    const [patientFormData, setPatientFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: ""
    });
    const [editPatientData, setEditPatientData] = useState({
        patientID: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [editFormErrors, setEditFormErrors] = useState({});
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

    // Admin Functions
    const validateAdminForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!adminFormData.username.trim()) {
            errors.username = "Username is required";
        } else if (adminFormData.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }

        if (!adminFormData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(adminFormData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!adminFormData.password) {
            errors.password = "Password is required";
        } else if (adminFormData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (adminFormData.password !== adminFormData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (!validateAdminForm()) return;

        try {
            const createData = {
                username: adminFormData.username,
                email: adminFormData.email,
                password: adminFormData.password
            };

            await createAdmin(createData);
            alert("Admin created successfully!");

            setShowCreateAdmin(false);
            setAdminFormData({ username: "", email: "", password: "", confirmPassword: "" });
            setFormErrors({});
            fetchUsersData();

        } catch (error) {
            console.error("Error creating admin:", error);
            alert("Failed to create admin: " + error.message);
        }
    };

    // Doctor Functions
    const validateDoctorForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!doctorFormData.firstName.trim()) errors.firstName = "First name is required";
        if (!doctorFormData.lastName.trim()) errors.lastName = "Last name is required";
        if (!doctorFormData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(doctorFormData.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!doctorFormData.phone.trim()) errors.phone = "Phone is required";
        if (!doctorFormData.specialization.trim()) errors.specialization = "Specialization is required";
        if (!doctorFormData.address.trim()) errors.address = "Address is required";
        if (!doctorFormData.password) {
            errors.password = "Password is required";
        } else if (doctorFormData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (doctorFormData.password !== doctorFormData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        if (!validateDoctorForm()) return;

        try {
            const createData = {
                firstName: doctorFormData.firstName,
                lastName: doctorFormData.lastName,
                email: doctorFormData.email,
                phone: doctorFormData.phone,
                specialization: doctorFormData.specialization,
                address: doctorFormData.address,
                password: doctorFormData.password
            };

            await registerDoctor(createData);
            alert("Doctor created successfully!");

            setShowCreateDoctor(false);
            setDoctorFormData({ firstName: "", lastName: "", email: "", phone: "", specialization: "", address: "", password: "", confirmPassword: "" });
            setFormErrors({});
            fetchUsersData();

        } catch (error) {
            console.error("Error creating doctor:", error);
            alert("Failed to create doctor: " + error.message);
        }
    };

    const handleEditDoctor = (doctor) => {
        setEditDoctorData({
            doctorID: doctor.doctorID,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            address: doctor.address
        });
        setShowEditDoctor(true);
    };

    const handleUpdateDoctor = async (e) => {
        e.preventDefault();

        try {
            await updateDoctor(editDoctorData.doctorID, editDoctorData);
            alert("Doctor updated successfully!");
            setShowEditDoctor(false);
            fetchUsersData();
        } catch (error) {
            console.error("Error updating doctor:", error);
            alert("Failed to update doctor: " + error.message);
        }
    };

    // Patient Functions
    const validatePatientForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!patientFormData.firstName.trim()) errors.firstName = "First name is required";
        if (!patientFormData.lastName.trim()) errors.lastName = "Last name is required";
        if (!patientFormData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(patientFormData.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!patientFormData.phone.trim()) errors.phone = "Phone is required";
        if (!patientFormData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!patientFormData.gender) errors.gender = "Gender is required";
        if (!patientFormData.address.trim()) errors.address = "Address is required";
        if (!patientFormData.password) {
            errors.password = "Password is required";
        } else if (patientFormData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (patientFormData.password !== patientFormData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        if (!validatePatientForm()) return;

        try {
            const createData = {
                firstName: patientFormData.firstName,
                lastName: patientFormData.lastName,
                dateOfBirth: patientFormData.dateOfBirth,
                gender: patientFormData.gender,
                phone: patientFormData.phone,
                email: patientFormData.email,
                address: patientFormData.address,
                password: patientFormData.password
            };

            await registerPatient(createData);
            alert("Patient created successfully!");

            setShowCreatePatient(false);
            setPatientFormData({ firstName: "", lastName: "", dateOfBirth: "", gender: "", phone: "", email: "", address: "", password: "", confirmPassword: "" });
            setFormErrors({});
            fetchUsersData();

        } catch (error) {
            console.error("Error creating patient:", error);
            alert("Failed to create patient: " + error.message);
        }
    };

    const handleEditPatient = (patient) => {
        setEditPatientData({
            patientID: patient.patientID,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            address: patient.address,
            dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
            gender: patient.gender
        });
        setShowEditPatient(true);
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();

        try {
            await updatePatient(editPatientData.patientID, editPatientData);
            alert("Patient updated successfully!");
            setShowEditPatient(false);
            fetchUsersData();
        } catch (error) {
            console.error("Error updating patient:", error);
            alert("Failed to update patient: " + error.message);
        }
    };

    // Delete handlers
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

    // Loading and error states
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

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {activeUserType === 'doctors' && (
                            <button
                                onClick={() => setShowCreateDoctor(true)}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                            >
                                <span className="text-lg">➕</span>
                                <span className="font-medium">Create Doctor</span>
                            </button>
                        )}

                        {activeUserType === 'patients' && (
                            <button
                                onClick={() => setShowCreatePatient(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                            >
                                <span className="text-lg">➕</span>
                                <span className="font-medium">Create Patient</span>
                            </button>
                        )}

                        {activeUserType === 'admins' && (
                            <button
                                onClick={() => setShowCreateAdmin(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                            >
                                <span className="text-lg">➕</span>
                                <span className="font-medium">Create Admin</span>
                            </button>
                        )}
                    </div>
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
                    <DoctorsList doctors={doctors} onDeleteDoctor={handleDeleteDoctor} onEditDoctor={handleEditDoctor} />
                ) : activeUserType === 'patients' ? (
                    <PatientsList patients={patients} onDeletePatient={handleDeletePatient} onEditPatient={handleEditPatient} />
                ) : (
                    <AdminsList admins={admins} onDeleteAdmin={handleDeleteAdmin} onEditAdmin={(admin) => {
                        setEditAdminData({
                            userId: admin.userID,
                            username: admin.username,
                            email: admin.email,
                            password: "",
                            confirmPassword: ""
                        });
                        setShowEditAdmin(true);
                    }} />
                )}
            </div>

            {/* Create Doctor Modal */}
            {showCreateDoctor && (
                <CreateDoctorModal
                    formData={doctorFormData}
                    setFormData={setDoctorFormData}
                    onSubmit={handleCreateDoctor}
                    onClose={() => {
                        setShowCreateDoctor(false);
                        setDoctorFormData({ firstName: "", lastName: "", email: "", phone: "", specialization: "", address: "", password: "", confirmPassword: "" });
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                />
            )}

            {/* Create Patient Modal */}
            {showCreatePatient && (
                <CreatePatientModal
                    formData={patientFormData}
                    setFormData={setPatientFormData}
                    onSubmit={handleCreatePatient}
                    onClose={() => {
                        setShowCreatePatient(false);
                        setPatientFormData({ firstName: "", lastName: "", dateOfBirth: "", gender: "", phone: "", email: "", address: "", password: "", confirmPassword: "" });
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                />
            )}

            {/* Edit Doctor Modal */}
            {showEditDoctor && (
                <EditDoctorModal
                    editData={editDoctorData}
                    setEditData={setEditDoctorData}
                    onSubmit={handleUpdateDoctor}
                    onClose={() => setShowEditDoctor(false)}
                />
            )}

            {/* Edit Patient Modal */}
            {showEditPatient && (
                <EditPatientModal
                    editData={editPatientData}
                    setEditData={setEditPatientData}
                    onSubmit={handleUpdatePatient}
                    onClose={() => setShowEditPatient(false)}
                />
            )}

            {/* Create Admin Modal (existing) */}
            {showCreateAdmin && (
                <CreateAdminModal
                    formData={adminFormData}
                    setFormData={setAdminFormData}
                    onSubmit={handleCreateAdmin}
                    onClose={() => {
                        setShowCreateAdmin(false);
                        setAdminFormData({ username: "", email: "", password: "", confirmPassword: "" });
                        setFormErrors({});
                    }}
                    errors={formErrors}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    passwordStrength={passwordStrength}
                    checkPasswordStrength={checkPasswordStrength}
                />
            )}

            {/* Edit Admin Modal (existing) */}
            {showEditAdmin && (
                <EditAdminModal
                    editData={editAdminData}
                    setEditData={setEditAdminData}
                    onSubmit={(e) => {
                        e.preventDefault();
                        // Handle admin update logic here
                    }}
                    onClose={() => setShowEditAdmin(false)}
                    errors={editFormErrors}
                />
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
            `}</style>
        </div>
    );
};

// Create Doctor Modal Component
const CreateDoctorModal = ({ formData, setFormData, onSubmit, onClose, errors, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">👨‍⚕️</span>
                Create New Doctor
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">First Name *</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Last Name *</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        placeholder="doctor@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Specialization *</label>
                        <input
                            type="text"
                            value={formData.specialization}
                            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                            placeholder="e.g. Cardiology"
                        />
                        {errors.specialization && <p className="text-red-400 text-xs mt-1">{errors.specialization}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Address *</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600 resize-none"
                        placeholder="Enter full address"
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-2.5 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password *</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-2.5 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                                placeholder="Re-enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Create Doctor
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Create Patient Modal Component
const CreatePatientModal = ({ formData, setFormData, onSubmit, onClose, errors, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                Create New Patient
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">First Name *</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Last Name *</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        placeholder="patient@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Date of Birth *</label>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                        {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Gender *</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 border-gray-600"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Address *</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 resize-none"
                        placeholder="Enter full address"
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-2.5 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password *</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-2.5 pr-10 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                                placeholder="Re-enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Create Patient
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Edit Doctor Modal Component
const EditDoctorModal = ({ editData, setEditData, onSubmit, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                Edit Doctor
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                        <input
                            type="text"
                            value={editData.firstName}
                            onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                        <input
                            type="text"
                            value={editData.lastName}
                            onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                        <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Specialization</label>
                        <input
                            type="text"
                            value={editData.specialization}
                            onChange={(e) => setEditData({...editData, specialization: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
                    <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 border-gray-600 resize-none"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Update Doctor
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Edit Patient Modal Component
const EditPatientModal = ({ editData, setEditData, onSubmit, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                Edit Patient
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                        <input
                            type="text"
                            value={editData.firstName}
                            onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                        <input
                            type="text"
                            value={editData.lastName}
                            onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                        <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Date of Birth</label>
                        <input
                            type="date"
                            value={editData.dateOfBirth}
                            onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Gender</label>
                        <select
                            value={editData.gender}
                            onChange={(e) => setEditData({...editData, gender: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 border-gray-600"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
                    <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 border-gray-600 resize-none"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Update Patient
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Create Admin Modal Component (simplified version)
const CreateAdminModal = ({ formData, setFormData, onSubmit, onClose, errors }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">👨‍💼</span>
                Create New Admin
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Username *</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                        placeholder="Enter username"
                    />
                    {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                        placeholder="admin@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Password *</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                        placeholder="Enter password"
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password *</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                        placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Create Admin
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Edit Admin Modal Component (simplified version)
const EditAdminModal = ({ editData, setEditData, onSubmit, onClose, errors }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                Edit Admin
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                    <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData({...editData, username: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Update Admin
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// Enhanced Doctors List Component with Edit functionality
const DoctorsList = ({ doctors, onDeleteDoctor, onEditDoctor }) => {
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
                                    onClick={() => onEditDoctor(doctor)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                    <span>✏️</span>
                                    Edit
                                </button>
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

// Enhanced Patients List Component with Edit functionality
const PatientsList = ({ patients, onDeletePatient, onEditPatient }) => {
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
                                    onClick={() => onEditPatient(patient)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                    <span>✏️</span>
                                    Edit
                                </button>
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

// Admins List Component (existing)
const AdminsList = ({ admins, onDeleteAdmin, onEditAdmin }) => {
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
                                <button
                                    onClick={() => onEditAdmin(admin)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                    <span>✏️</span>
                                    Edit
                                </button>
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