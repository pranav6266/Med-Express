// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check for user info in local storage
    const userInfo = localStorage.getItem('userInfo');

    // If user is logged in, render the child components (Outlet).
    // Otherwise, redirect to the login page.
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
