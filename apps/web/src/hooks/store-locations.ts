import { useCallback, useEffect, useState } from "react";
import { Status } from "../@types/enum/status";
import { LocationInfo, LocationInfoRequest } from "../@types/location-props";
import { apiGetStoreLocations, apiPostStoreLocation, apiPutStoreLocation } from "../api/store-locations";
import { Store } from "../@types/store-props";
import { apiGetStoreById } from "../api/stores";
import { AxiosError } from "axios";

const useStoreLocations = () => {

    const [isLoading, setIsLoading] = useState(true);


    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);



    const getStoreLocations = useCallback(async (storeID: string): Promise<LocationInfo[]> => {
        let locations: LocationInfo[] = [];
        try {

            setIsLoading(true);
            const response = await apiGetStoreLocations(storeID);

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                locations = response.data.map((item, index) => {
                    const location: LocationInfo = {
                        no: index + 1,
                        locationID: item.id,
                        address: item.address,
                        state: item.geoRef?.steName,
                        zipCode: item.geoRef?.zipCode,
                        openAt: item.openTime,
                        closeAt: item.closeTime,
                        status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive,
                    }
                    return location;
                });
            }

        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return locations;
    }, []);


    const createLocation = useCallback(async (storeId: string, locationInfo: LocationInfoRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPostStoreLocation(storeId, locationInfo);
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


    const updateLocation = useCallback(async (storeId: string, locationId: string, locationInfo: LocationInfoRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutStoreLocation(storeId, locationId, locationInfo);
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


    const getStoreInfoById = useCallback(async (storeID: string): Promise<Store | null> => {
        let store = null;
        try {
            setIsLoading(true);
            const response = await apiGetStoreById(storeID);

            // localStorage.setItem('authToken', token);

            // setIsAuthenticated(true);
            store = {
                no: 0,
                id: response.data.id,
                ownerstore: response.data.name,
                userName: response.data.name,
                phone: response.data.phone,
                email: response.data.email,
                status: response.data.status == "ACTIVE" ? Status.Active : Status.Deactive,
            };
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return store;
    }, []);





    return { isLoading, getStoreLocations, getStoreInfoById, createLocation, updateLocation };
};

export default useStoreLocations;