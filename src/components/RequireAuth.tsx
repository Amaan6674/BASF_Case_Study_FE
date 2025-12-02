import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
    children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const location = useLocation();
    const user = sessionStorage.getItem('user');

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
