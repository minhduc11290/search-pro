import { useState, useEffect, useCallback } from 'react';
import { apiGetUsers } from '../api/users';
import { UserInfo } from '../@types/user-props';
import { Status } from '../@types/enum/status';

const useUsers = () => {


    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Hàm login để đặt token và cập nhật trạng thái
    const getUsers = useCallback(async (): Promise<UserInfo[]> => {
        try {
            setIsLoading(true);
            const response = await apiGetUsers();

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                return response.data.map((item, index) => {
                    const user: UserInfo = {
                        no: index + 1,
                        userID: item.userID,
                        // ownerstore: item.name,
                        // userName: '',
                        // phone: item.primaryPhone,
                        // email: item.email,
                        // status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive,
                        userName: item.userName,
                        fullName: item.firstName + " " + item.lastName,
                        phone: item.phone,
                        email: item.email,
                        state: "",
                        status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive
                    }
                    return user;
                });
            }
            // setIsAuthenticated(true);
            return [];
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return [];
    }, []);


    return { isLoading, getUsers };
};

export default useUsers;