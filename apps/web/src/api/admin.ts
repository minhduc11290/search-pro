import { AdminRequest, UpdateAdminRequest } from "../@types/admin-props";
import axiosInstance from "./axiosInstance";

export const apiGetStores = () => axiosInstance.get("/admin/stores");
export const apiGetAdmin = (id: string) => axiosInstance.get(`/admin/admin/${id}`);
export const apiPostAdmin = (store: AdminRequest) => axiosInstance.post(`/admin/admin/`, store);
//export const apiPostCreateStoreOwner = (id: string) => axiosInstance.post(`/admin/stores/${id}/owners`);
export const apiPutAdmin = (id: string, store: UpdateAdminRequest) => axiosInstance.put(`/admin/admin/${id}`, store);
export const apiPutStatusStore = (id: string, store: UpdateAdminRequest) => axiosInstance.put(`/admin/admin/${id}/status`, store);