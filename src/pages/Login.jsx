import React from "react";
import LoginImage from "/src/assets/LoginPage.svg"; // Or use /assets/LoginPage.svg if in public folder

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 overflow-hidden">
            <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-lg rounded-2xl overflow-hidden max-h-screen">
                {/* Left side - Login form */}
                <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 md:p-10 overflow-y-auto">
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Davakhana</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
                        Digitizing Healthcare for a Healthier Tomorrow.
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 mb-6">
                        Welcome back! Please login to your account.
                    </p>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-1" />
                                Remember Me
                            </label>
                            <a href="#" className="hover:underline text-blue-500">Forgot Password?</a>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-black text-black dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"

                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="w-full bg-gray-800 dark:bg-black hover:opacity-90 text-black dark:text-yellow-300 font-semibold py-2 px-4 rounded-lg transition duration-300"

                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                        Or login with
                        <div className="flex justify-center mt-2 space-x-4">
                            <a href="#" className="text-blue-600 hover:underline">Facebook</a>
                            <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
                            <a href="#" className="text-blue-600 hover:underline">Google</a>
                        </div>
                    </div>
                </div>

                {/* Right side - Responsive Image */}
                <div className="hidden md:flex md:w-1/2 bg-gray-100 dark:bg-gray-700 items-center justify-center aspect-[3/4]">
                    <img
                        src="/src/assets/LoginPage.svg"
                        alt="Login Illustration"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
