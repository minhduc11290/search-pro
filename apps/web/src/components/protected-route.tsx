import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/auth';

import { ProtectedRouteProps } from '../@types/protected-route-props';
import { PATH } from '../constants/paths';
import { LoadingOverlay } from '@mantine/core';

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoading, isAuthenticated } = useAuth();

    console.log(isAuthenticated);
    // Nếu người dùng đã đăng nhập, chuyển hướng đến `redirectTo`
    return !isLoading && !isAuthenticated ? <Navigate to={PATH.LOGIN} /> : (isLoading ? <LoadingOverlay></LoadingOverlay> :
        children);
};

export default ProtectedRoute;
