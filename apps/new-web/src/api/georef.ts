import axiosInstance from "./axiosInstance";

export const apiGetGeoRef = () => axiosInstance.get("/georefs");
export const apiGetGeoRefByID = (id: string) => axiosInstance.get(`/georefs/${id}`);