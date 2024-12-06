import { useCallback, useEffect, useState } from "react";
import { apiGetStores, apiPostStore, apiPutStore } from "../api/stores";
import { Store, StoreRequest, UpdateStoreRequest } from "../@types/store-props";
import { Status } from "../@types/enum/status";
import { AxiosError } from "axios";

const useStore = () => {

    const [isLoading, setIsLoading] = useState(true);


    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);



    const getStores = useCallback(async (): Promise<Store[]> => {
        try {
            setIsLoading(true);
            const response = await apiGetStores();

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                return response.data.map((item, index) => {
                    const store: Store = {
                        no: index + 1,
                        id: item.id,
                        ownerstore: item.name,
                        userName: '',
                        phone: item.primaryPhone,
                        email: item.email,
                        status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive,
                    }
                    return store;
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


    const createStore = useCallback(async (store: StoreRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            // let storeRequest: StoreRequest = {
            //     name: store.userName,
            //     primaryPhone: store.phone,
            //     password: store.password ?? '',
            //     email: store.email,
            //     isActive: store.status == Status.Active ? true : false
            // };
            const response = await apiPostStore(store);
            if (response.status == 201) {
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

    const updateStore = useCallback(async (id: string, store: UpdateStoreRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutStore(id, store);
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


    return { isLoading, getStores, createStore, updateStore };
};

export default useStore;