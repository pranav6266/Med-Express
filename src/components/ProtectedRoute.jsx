// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Parse the user info to access its properties
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // 2. Check that the user is logged in AND their role is 'user'
    if (userInfo && userInfo.role === 'user') {
        return <Outlet />;
    } else {
        // 3. Redirect to the login page if the conditions are not met
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;