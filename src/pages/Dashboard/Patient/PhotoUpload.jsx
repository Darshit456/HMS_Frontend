import React, { useState, useRef } from "react";
import { FaCamera, FaTrash, FaUpload } from "react-icons/fa";

const PhotoUpload = ({ currentPhotoUrl, onPhotoUpload, onPhotoDelete, isUploading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, GIF, and WebP files are allowed");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Handle upload
    const handleUpload = () => {
        if (selectedFile && onPhotoUpload) {
            onPhotoUpload(selectedFile);
            setSelectedFile(null);
            setPreview(null);
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile photo?")) {
            if (onPhotoDelete) {
                onPhotoDelete();
            }
            setSelectedFile(null);
            setPreview(null);
        }
    };

    // Handle click to select file
    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    // Get display image URL
    const getDisplayImageUrl = () => {
        if (preview) return preview;
        if (currentPhotoUrl) {
            // Handle both relative and absolute URLs
            if (currentPhotoUrl.startsWith('http')) {
                return currentPhotoUrl;
            } else {
                return `https://localhost:7195${currentPhotoUrl}`;
            }
        }
        return null;
    };

    const displayImageUrl = getDisplayImageUrl();

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Current Photo Display */}
            <div className="relative">
                {displayImageUrl ? (
                    <div className="relative group">
                        <img
                            src={displayImageUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        {!preview && (
                            <button
                                onClick={handleDelete}
                                disabled={isUploading}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-gray-400"
                                title="Delete photo"
                            >
                                <FaTrash className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-blue-500">
                        <FaCamera className="text-3xl text-blue-600 dark:text-blue-300" />
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 w-full max-w-sm text-center transition-colors ${
                    dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                } ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-blue-400"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileSelector}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isUploading}
                />

                <div className="space-y-2">
                    <FaUpload className="mx-auto text-2xl text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {dragActive ? "Drop the image here" : "Click or drag & drop an image"}
                    </p>
                    <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WebP • Max 5MB
                    </p>
                </div>

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
                        <div className="text-blue-600">Uploading...</div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {selectedFile && (
                <div className="flex gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                        {isUploading ? "Uploading..." : "Upload Photo"}
                    </button>
                    <button
                        onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                        }}
                        disabled={isUploading}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;