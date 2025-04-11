import React from "react";
import LoginImage from "/src/assets/LoginPage.svg";

const Login = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-12 overflow-hidden">


        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side */}
                <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Davakhana</h1>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Digitizing Healthcare for a Healthier Tomorrow.
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">Welcome back! Please login to your account.</p>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-1" /> Remember Me
                            </label>
                            <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="w-full bg-green-500  hover:bg-gray-900 text-white dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Or login with
                        <div className="flex justify-center mt-2 space-x-4">
                            <a href="#" className="text-blue-600 hover:underline">Facebook</a>
                            <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
                            <a href="#" className="text-blue-600 hover:underline">Google</a>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden md:flex md:w-1/2 bg-gray-100 dark:bg-gray-700 items-center justify-center">
                    <img src={LoginImage} alt="Login" className="w-full h-auto object-contain p-4" />
                </div>
            </div>
        </div>
    );
};

export default Login;
