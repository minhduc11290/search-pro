import axiosInstance from "./axiosInstance";

export const getUser = (url: string) => axiosInstance.get(url).then((res) => res.data);
export const postCreateUser = (url: string, body: any) => axiosInstance.post(url, body).then((res) => res.data);
export const postlogin = (body: any) => axiosInstance.post('admin/users/login', body);
export const postlogout = (body: any) => axiosInstance.post('admin/users/logout', body);