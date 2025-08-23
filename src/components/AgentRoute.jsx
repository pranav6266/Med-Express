import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AgentRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if user is logged in and has the 'agent' role
    if (userInfo && userInfo.role === 'agent') {
        return <Outlet />;
    } else {
        // Redirect to login if not an authenticated agent
        return <Navigate to="/login" replace />;
    }
};

export default AgentRoute;
