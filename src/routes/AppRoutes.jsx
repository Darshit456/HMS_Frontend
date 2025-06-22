// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login.jsx';
import PatientDashboard from "../pages/Dashboard/Patient/PatientDashboard.jsx";
import DoctorDashboard from "../pages/Dashboard/Doctor/DoctorDashboard.jsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={< Login />} />
                <Route path="/patient/dashboard" element={<PatientDashboard />} /> {/* Patient Dashboard Route */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> {/* Doctor Dashboard Route */}
                {/* Future routes will go here */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;