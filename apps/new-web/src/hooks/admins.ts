import { useCallback, useEffect, useState } from "react";
import { Store } from "../@types/store-props";
import { Status } from "../@types/enum/status";
import { AxiosError } from "axios";
import { AdminRequest, UpdateAdminRequest } from "../@types/admin-props";
import { apiGetAdmin, apiPostAdmin, apiPutAdmin } from "../api/admin";

const useAdmin = () => {

    const [isLoading, setIsLoading] = useState(true);


    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);



    const getAdmin = useCallback(async (id: string): Promise<Store | null> => {
        try {
            setIsLoading(true);
            const response = await apiGetAdmin(id);

            // localStorage.setItem('authToken', token);
            const item = response.data;
            const store: Store = {
                no: 1,
                id: item.id,
                ownerstore: item.name,
                userName: item.userName,
                phone: item.primaryPhone,
                email: item.email,
                status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive,
                pw: item.pw
            }
            return store;
            // setIsAuthenticated(true);
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return null;
    }, []);




    const createAdmin = useCallback(async (store: AdminRequest) => {
        let result = false;
        let errorMessage = "";
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
            const response = await apiPostAdmin(store);
            if (response.status == 201) {
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

    const updateAdmin = useCallback(async (id: string, store: UpdateAdminRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutAdmin(id, store);
            if (response.status == 200) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);

    // const updateStatus = useCallback(async (id: string, status: boolean) => {
    //     let result = false;
    //     let errorMessage = "";
    //     try {
    //         setIsLoading(true);
    //         const response = await apiPutStore(id, store);
    //         if (response.status == 200) {
    //             result = true;
    //         }
    //     } catch (ex) {
    //         if ((ex instanceof Error)) {
    //             errorMessage = ex.message;
    //         } else if (ex instanceof AxiosError) {
    //             errorMessage = ex.message;
    //         }

    //         console.log(ex);
    //     } finally {
    //         setIsLoading(false);
    //     }
    //     return { result, errorMessage };
    // }, []);


    return { isLoading, getAdmin, createAdmin, updateAdmin };
};

export default useAdmin;