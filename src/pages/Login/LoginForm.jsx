import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/loginApi.js"; // Correct path for your file structure

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            // Make the API call to login with correct parameters
            const response = await loginUser({ email, password });

            // Handle successful response
            if (response.status === 200) {
                // Your .NET backend returns: Token, Role, DashboardUrl (or dashboardUrl), UserDetails
                // Extract values with fallbacks to handle different property naming
                const token = response.data.Token || response.data.token;
                const role = response.data.Role || response.data.role;
                const userDetails = response.data.UserDetails || response.data.userDetails;

                // Store token and other useful information
                localStorage.setItem("token", token);
                localStorage.setItem("userRole", role);

                // Store user details if available
                if (userDetails) {
                    localStorage.setItem("userDetails", JSON.stringify(userDetails));
                }

                // Always redirect to patient dashboard for now
                // Later when you add other dashboards, you can update this logic
                navigate("/patient/dashboard");
            }
        } catch (error) {
            // Handle different error scenarios
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    setErrorMessage("Invalid credentials, please try again.");
                } else {
                    setErrorMessage(error.response.data || "Login failed. Please try again.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                setErrorMessage("No response from server. Please check your internet connection.");
            } else {
                // Something happened in setting up the request
                setErrorMessage(error.message || "An unexpected error occurred.");
            }
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            {/* Display error message */}
            {errorMessage && (
                <div className="text-sm text-red-600">{errorMessage}</div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> Remember Me
                </label>
                <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;