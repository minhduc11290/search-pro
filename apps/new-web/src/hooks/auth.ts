import { useState, useEffect, useCallback } from 'react';
import { apiGetProfile, postlogin } from '../api/users';
import { UserInfo, UserLogin } from '../@types/user-props';
import { cookies } from 'next/headers';
import { LoginProps } from '@/@types/login-props';

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
    const login = useCallback(async (data: UserLogin): Promise<LoginProps> => {

        try {
            const response = await postlogin(data);
            if (response.status == 200) {
                // const cookieStore = await cookies()
                // const theme = cookieStore.get('theme')
                // localStorage.setItem('authToken', response.data.accessToken);
                // cookieStore.set('authToken', response.data.accessToken);
                return {
                    status: true,
                    token: response.data.accessToken,
                };
            }
            // localStorage.setItem('authToken', token);

            // setIsAuthenticated(true);
        } catch (ex) {
            console.log(ex);
        }
        return {
            status: false,
            token: '',
        };
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
                    status: response.data.status,
                    role: response.data.role?.id,
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