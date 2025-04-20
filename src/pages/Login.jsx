import React, { useState } from "react";
import LoginForm from "./LoginForm"; // Import LoginForm component
import SignupForm from "./SignupForm"; // Import SignupForm component

const Login = () => {
    const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup form

    const toggleForm = () => setIsSignup((prev) => !prev);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-12 overflow-hidden">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side */}
                <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Davakhana</h1>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Digitizing Healthcare for a Healthier Tomorrow.
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        {isSignup ? "Create a new account" : "Welcome back! Please login to your account."}
                    </p>

                    {isSignup ? (
                        <SignupForm />
                    ) : (
                        <LoginForm />
                    )}

                    {/* Toggle between Login/Signup */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        {isSignup ? (
                            <p>
                                Already have an account?{" "}
                                <button
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:underline"
                                >
                                    Login here
                                </button>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{" "}
                                <button
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign up here
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden md:flex md:w-1/2 bg-gray-100 dark:bg-gray-700 items-center justify-center">
                    <img src="/src/assets/LoginPage.svg" alt="Login" className="w-full h-auto object-contain p-4" />
                </div>
            </div>
        </div>
    );
};

export default Login;
