import React from "react";

const LoginForm = () => {
    return (
        <form className="space-y-4">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Password */}
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
            </div>
        </form>
    );
};

export default LoginForm;
