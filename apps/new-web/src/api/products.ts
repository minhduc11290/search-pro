import axiosInstance from "./axiosInstance";

export const getProduct = (url: string) => axiosInstance.get(url);
export const getProductByID = (url: string, id: string) => axiosInstance.get(url + id);