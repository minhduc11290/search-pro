import { useCallback, useEffect, useState } from "react";
import { Status } from "../@types/enum/status";
import { LocationInfo, LocationInfoRequest } from "../@types/location-props";
import { apiAddLocationAttachement, apiGetStoreLocations, apiPostStoreLocation, apiPutStoreLocation } from "../api/store-locations";
import { Store } from "../@types/store-props";
import { apiGetStoreById } from "../api/stores";
import { AxiosError } from "axios";
import { Attachment } from "../@types/product-props";
import { SearchableCities } from "@/@types/searchable-cities";
import { LocationSearchableRequest } from "@/@types/location-searchable-props";
import { apiDeleteStoreLocationSearchable, apiGetStoreLocationsSearchable, apiPostStoreLocationSearchable, apiPutStoreLocationSearchable } from "@/api/store-locations-searchable";

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
                        phone: item.phone,
                        attachments: item.attachments,
                        addressLine1: item.addressLine1,
                        addressLine2: item.addressLine2,
                        city: item.city,
                        fax: item.fax,
                        isOpenMon: item.isOpenMon,
                        openTimeMon: item.openTimeMon,
                        closeTimeMon: item.closeTimeMon,

                        isOpenTue: item.isOpenTue,
                        openTimeTue: item.openTimeTue,
                        closeTimeTue: item.closeTimeTue,

                        isOpenWed: item.isOpenWed,
                        openTimeWed: item.openTimeWed,
                        closeTimeWed: item.closeTimeWed,

                        isOpenThu: item.isOpenThu,
                        openTimeThu: item.openTimeThu,
                        closeTimeThu: item.closeTimeThu,

                        isOpenFri: item.isOpenFri,
                        openTimeFri: item.openTimeFri,
                        closeTimeFri: item.closeTimeFri,

                        isOpenSat: item.isOpenSat,
                        openTimeSat: item.openTimeSat,
                        closeTimeSat: item.closeTimeSat,

                        isOpenSun: item.isOpenSun,
                        openTimeSun: item.openTimeSun,
                        closeTimeSun: item.closeTimeSun,

                        latitude: item.latitude,
                        longitude: item.longitude,
                        cities: item.cities,
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
        let data = null;
        try {
            setIsLoading(true);
            const response = await apiPostStoreLocation(storeId, locationInfo);
            if (response.status == 201) {
                result = true;
                data = response.data;

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
        return { data, result, errorMessage };
    }, []);


    const updateLocation = useCallback(async (storeId: string, locationId: string, locationInfo: LocationInfoRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutStoreLocation(storeId, locationId, locationInfo);
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


    const addLocationAttachment = useCallback(async (productId: string, files: Attachment[]) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            // const strFiles: string[] = [];
            // files.forEach(file => {
            //     strFiles.push(file.name);
            // });
            const response = await apiAddLocationAttachement(productId, files);
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


    const getStoreLocationSearchable = useCallback(async (storeID: string): Promise<SearchableCities[]> => {
        let locations: SearchableCities[] = [];
        try {

            setIsLoading(true);
            const response = await apiGetStoreLocationsSearchable(storeID);

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                locations = response.data.map((item, index) => {
                    const location: SearchableCities = {
                        id: item.id,
                        state: item.state,
                        city: item.cities
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


    const createLocationSearchable = useCallback(async (storeId: string, locationInfo: LocationSearchableRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPostStoreLocationSearchable(storeId, locationInfo);
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


    const updateLocationSearchable = useCallback(async (storeId: string, locationId: string, locationInfo: LocationSearchableRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutStoreLocationSearchable(storeId, locationId, locationInfo);
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


    const deleteLocationSearchable = useCallback(async (storeId: string, locationId: string) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiDeleteStoreLocationSearchable(storeId, locationId);
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


    return { isLoading, getStoreLocations, getStoreInfoById, createLocation, updateLocation, addLocationAttachment, getStoreLocationSearchable, createLocationSearchable, updateLocationSearchable, deleteLocationSearchable };
};

export default useStoreLocations;