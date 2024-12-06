import axiosInstance from "./axiosInstance";

export const getGeoRef = (url: string) => axiosInstance.get(url);
export const getGeoRefByID = (url: string, id: string) => axiosInstance.get(url + id);