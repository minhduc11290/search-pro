import { UserLogin } from "../@types/user-props";
import axiosInstance from "./axiosInstance";

// export const getUser = (url: string) => axiosInstance.get(url);
// export const postCreateUser = (url: string, body: any) => axiosInstance.post(url, body);
export const postlogin = (body: UserLogin) => axiosInstance.post('admin/users/login', body);
// export const postlogout = (body: any) => axiosInstance.post('admin/users/logout', body);