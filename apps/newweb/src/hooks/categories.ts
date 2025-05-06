import { useState, useEffect, useCallback } from 'react';
import { apiGetUsers } from '../api/users';
import { UserInfo } from '../@types/user-props';
import { Status } from '../@types/enum/status';
import { CategoryInfo, CategoryRequest } from '@/@types/category-props';
import { apiGetCategories, apiPostCategory, apiPutCategory } from '@/api/categories';
import { AxiosError } from 'axios';

const useCategories = () => {


    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Hàm login để đặt token và cập nhật trạng thái
    const getCategories = useCallback(async (): Promise<CategoryInfo[]> => {
        try {
            setIsLoading(true);
            const response = await apiGetCategories();

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                return response.data.map((item, index) => {
                    const user: CategoryInfo = {

                        id: item.id,
                        // ownerstore: item.name,
                        // userName: '',
                        // phone: item.primaryPhone,
                        // email: item.email,
                        // status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive,
                        name: item.name,
                        url: item.url,
                        productUrl: item.productUrl
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

    const createCategory = useCallback(async (category: CategoryRequest) => {
        let result = false;
        let errorMessage = "";
        let data = null;
        let statusCode = 201;
        try {
            setIsLoading(true);
            // let storeRequest: StoreRequest = {
            //     name: store.userName,
            //     primaryPhone: store.phone,
            //     password: store.password ?? '',
            //     email: store.email,
            //     isActive: store.status == Status.Active ? true : false
            // };
            const response = await apiPostCategory(category);
            if (response.status == 201) {
                data = response.data;
                result = true;
            }
        } catch (ex) {

            if (ex instanceof AxiosError) {
                statusCode = ex.response?.status ?? 0;
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { data, result, errorMessage, statusCode };
    }, []);

    const updateCategory = useCallback(async (id: string, category: CategoryRequest) => {
        let result = false;
        let errorMessage = "";
        let statusCode = 200;
        try {
            setIsLoading(true);
            const response = await apiPutCategory(id, category);
            if (response.status == 200) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                statusCode = ex.response?.status ?? 0;
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage, statusCode };
    }, []);

    return { isLoading, getCategories, createCategory, updateCategory };
};

export default useCategories;