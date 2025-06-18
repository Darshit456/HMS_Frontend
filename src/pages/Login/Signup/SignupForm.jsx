import React, { useState } from "react";

const SignupForm = () => {
    const [step, setStep] = useState(1); // Track which step the user is on
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
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

    // Move to the next step
    const nextStep = () => {
        if (step < 3) {
            setStep((prevStep) => prevStep + 1);
        }
    };

    // Handle submit for final step
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform validation here before submitting
        console.log(formData); // Example of form data being printed
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Step 1: First Name and Last Name */}
            {step === 1 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">First Name</label>
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
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Last Name</label>
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

            {/* Step 2: Date of Birth, Email */}
            {step === 2 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
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

            {/* Step 3: Password and Confirm Password */}
            {step === 3 && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Confirm Password</label>
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
            <div className="flex justify-between items-center">
                {step === 3 ? (
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-700 text-white dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Sign Up
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Next
                    </button>
                )}
            </div>
        </form>
    );
};

export default SignupForm;
