import axiosInstance from "./axiosInstance";

export const getGeoRef = (url: string, body: any) => axiosInstance.get(url, body).then((res) => res.data);
export const getGeoRefByID = (url: string, id: string) => axiosInstance.get(url + id).then((res) => res.data);