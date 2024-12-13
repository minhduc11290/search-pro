import { LocationInfoRequest } from "../@types/location-props";
import axiosInstance from "./axiosInstance";

export const apiGetStoreLocations = (storeId: string) => axiosInstance.get(`/admin/stores/${storeId}/locations`);
export const apiPutStoreLocation = (storeId: string, locationId: string, location: LocationInfoRequest) => axiosInstance.put(`/admin/stores/${storeId}/locations/${locationId}`, location);
export const apiPostStoreLocation = (storeId: string, location: LocationInfoRequest) => axiosInstance.post(`/admin/stores/${storeId}/locations`, location);
export const apiDeleteStore = (id: string) => axiosInstance.delete(`/admin/stores/${id}`);
