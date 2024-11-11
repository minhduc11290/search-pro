import { useState, useEffect, useCallback } from 'react';

// Hàm này trả về một object chứa các hàm và trạng thái xác thực
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token); // Xác thực nếu có token
    }, []);

    // Hàm login để đặt token và cập nhật trạng thái
    const login = useCallback((token: string) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    }, []);

    // Hàm logout để xóa token và cập nhật trạng thái
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    }, []);

    return { isAuthenticated, login, logout };
};

export default useAuth;