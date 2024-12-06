import { useState, useEffect, useCallback } from 'react';
import { apiGetProfile, postlogin } from '../api/users';
import { UserInfo, UserLogin } from '../@types/user-props';

// Hàm này trả về một object chứa các hàm và trạng thái xác thực
const useAuth = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {

        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token); // Xác thực nếu có token
        setIsLoading(false);
    }, []);

    // Hàm login để đặt token và cập nhật trạng thái
    const login = useCallback(async (data: UserLogin): Promise<boolean> => {
        try {
            const response = await postlogin(data);
            if (response.status == 200) {
                localStorage.setItem('authToken', response.data.accessToken);
                return true;
            }
            // localStorage.setItem('authToken', token);

            // setIsAuthenticated(true);
        } catch (ex) {
            console.log(ex);
        }
        return false;
    }, []);

    // Hàm logout để xóa token và cập nhật trạng thái
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    }, []);


    const getProfile = useCallback(async (): Promise<UserInfo | null> => {
        try {
            const response = await apiGetProfile();
            if (response.status == 200) {
                const user: UserInfo = {
                    no: 0,
                    userID: response.data.userName,
                    userName: response.data.userName,
                    fullName: response.data.firstName + " " + response.data.lastName,
                    phone: response.data.phone,
                    email: response.data.email,
                    state: '',
                    status: response.data.status
                }
                return user;
            }
            // localStorage.setItem('authToken', token);

            // setIsAuthenticated(true);
        } catch (ex) {
            console.log(ex);
        }
        return null;
    }, []);


    return { isLoading, isAuthenticated, login, logout, getProfile };
};

export default useAuth;