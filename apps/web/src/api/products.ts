import axiosInstance from "./axiosInstance";

export const getProduct = (url: string, body: any) => axiosInstance.get(url, body).then((res) => res.data);
export const getProductByID = (url: string, id: string) => axiosInstance.get(url + id).then((res) => res.data);