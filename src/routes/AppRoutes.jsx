// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* Future routes will go here */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
