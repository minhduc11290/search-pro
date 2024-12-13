import { LocationPrice } from "../@types/product-props";
import axiosInstance from "./axiosInstance";

export const apiGetFile = (filename: string) => axiosInstance.get(`/admin/files/${filename}`);
export const apiPostFile = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });
    return axiosInstance.post(`/admin/files/uploads`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
};