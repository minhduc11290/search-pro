import axiosInstance from "./axiosInstance";

export const getQuotes = (url: string) => axiosInstance.get(url).then((res) => res.data);
export const postQuotes = (url: string, body: any) => axiosInstance.post(url, body).then((res) => res.data);
export const getQuoteByID = (url: string, id: string) => axiosInstance.get(url + `/${id}`).then((res) => res.data);
