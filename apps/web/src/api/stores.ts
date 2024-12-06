import { StoreRequest, UpdateStoreRequest } from "../@types/store-props";
import axiosInstance from "./axiosInstance";

export const apiGetStores = () => axiosInstance.get("/admin/stores");
export const apiGetStoreById = (id: string) => axiosInstance.get(`/admin/stores/${id}`);
export const apiPostStore = (store: StoreRequest) => axiosInstance.post(`/admin/stores/`, store);
export const apiPostCreateStoreOwner = (id: string) => axiosInstance.post(`/admin/stores/${id}/owners`);
export const apiPutStore = (id: string, store: UpdateStoreRequest) => axiosInstance.put(`/admin/stores/${id}`, store);
export const apiPutStatusStore = (id: string, store: UpdateStoreRequest) => axiosInstance.put(`/admin/stores/${id}/status`, store);
export const apiDeleteStore = (id: string) => axiosInstance.delete(`/admin/stores/${id}`);