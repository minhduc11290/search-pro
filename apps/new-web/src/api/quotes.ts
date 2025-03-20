import axiosInstance from "./axiosInstance";

export const getQuotes = (url: string) => axiosInstance.get(url);
export const postQuotes = (url: string) => axiosInstance.post(url);
export const getQuoteByID = (url: string, id: string) => axiosInstance.get(url + `/${id}`);
