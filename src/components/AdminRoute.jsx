import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if user is logged in and has the 'admin' role
    if (userInfo && userInfo.role === 'admin') {
        return <Outlet />;
    } else {
        // Redirect to login if not an authenticated admin
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
