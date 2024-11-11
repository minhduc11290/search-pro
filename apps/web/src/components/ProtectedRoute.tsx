import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/auth';

import { ProtectedRouteProps } from '../@types/ProtectedRouteProps';

const ProtectedRoute = ({ children, redirectTo }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    // Nếu người dùng đã đăng nhập, chuyển hướng đến `redirectTo`
    return !isAuthenticated ? <Navigate to={redirectTo} /> : children;
};

export default ProtectedRoute;
