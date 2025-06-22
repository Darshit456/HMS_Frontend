import React, { useState } from "react";
import { registerPatient } from "../../../services/signupApi.js";

const SignupForm = () => {
    const [step, setStep] = useState(1); // Track which step the user is on
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "", // Changed from dob to match API
        gender: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    // Handle input changes for each field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate current step
    const validateStep = () => {
        switch (step) {
            case 1:
                if (!formData.firstName.trim() || !formData.lastName.trim()) {
                    alert("Please fill in both first name and last name.");
                    return false;
                }
                break;
            case 2:
                if (!formData.dateOfBirth || !formData.email.trim() || !formData.gender.trim() || !formData.phone.trim()) {
                    alert("Please fill in all fields.");
                    return false;
                }
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    alert("Please enter a valid email address.");
                    return false;
                }
                break;
            case 3:
                if (!formData.address.trim() || !formData.password || !formData.confirmPassword) {
                    alert("Please fill in all fields.");
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords do not match.");
                    return false;
                }
                if (formData.password.length < 6) {
                    alert("Password must be at least 6 characters long.");
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    };

    // Move to the next step
    const nextStep = () => {
        if (validateStep()) {
            if (step < 3) {
                setStep((prevStep) => prevStep + 1);
            }
        }
    };

    // Move to the previous step
    const prevStep = () => {
        if (step > 1) {
            setStep((prevStep) => prevStep - 1);
        }
    };

    // Handle submit for final step
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare data for API (exclude confirmPassword)
            const apiData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim().toLowerCase(),
                address: formData.address.trim(),
                password: formData.password
            };

            console.log("Submitting registration data:", apiData);

            const response = await registerPatient(apiData);

            console.log("Registration successful:", response.data);
            alert("Registration successful! You can now login with your credentials.");

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                gender: "",
                phone: "",
                email: "",
                address: "",
                password: "",
                confirmPassword: "",
            });
            setStep(1);

            // Optionally redirect to login page
            // window.location.href = '/login';

        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((stepNumber) => (
                        <React.Fragment key={stepNumber}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {stepNumber}
                            </div>
                            {stepNumber < 3 && (
                                <div className={`w-12 h-1 ${
                                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                }`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
                <>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-4">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
                <>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-4">Personal Details</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Date of Birth *</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Gender *</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </>
            )}

            {/* Step 3: Security & Address */}
            {step === 3 && (
                <>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-4">Security & Address</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street, City, State, ZIP"
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </>
            )}

            {/* Step Navigation */}
            <div className="flex justify-between items-center pt-4">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                )}

                <div className="flex-1"></div>

                {step === 3 ? (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
                    >
                        Next
                    </button>
                )}
            </div>
        </form>
    );
};

export default SignupForm;