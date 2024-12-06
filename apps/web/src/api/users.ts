import { UserLogin } from "../@types/user-props";
import axiosInstance from "./axiosInstance";

export const apiGetUsers = () => axiosInstance.get('admin/user-management/users');
export const apiGetProfile = () => axiosInstance.get('users/me');
// export const postCreateUser = (url: string, body: any) => axiosInstance.post(url, body);
export const postlogin = (body: UserLogin) => axiosInstance.post('admin/users/login', body);
// export const postlogout = (body: any) => axiosInstance.post('admin/users/logout', body); 