import { LocationSearchableRequest } from "@/@types/location-searchable-props";
import { LocationInfoRequest } from "../@types/location-props";
import { Attachment } from "../@types/product-props";
import axiosInstance from "./axiosInstance";

export const apiGetStoreLocationsSearchable = (storeId: string) => axiosInstance.get(`/admin/stores/${storeId}/locations-searchable`);
export const apiPutStoreLocationSearchable = (storeId: string, locationId: string, location: LocationSearchableRequest) => axiosInstance.put(`/admin/stores/${storeId}/locations-searchable/${locationId}`, location);
export const apiPostStoreLocationSearchable = (storeId: string, location: LocationSearchableRequest) => axiosInstance.post(`/admin/stores/${storeId}/locations-searchable`, location);
export const apiDeleteStoreLocationSearchable = (storeId: string, id: string) => axiosInstance.delete(`/admin/stores/${storeId}/locations-searchable/${id}`);
