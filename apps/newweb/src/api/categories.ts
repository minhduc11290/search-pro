import { CategoryInfo, CategoryRequest } from "@/@types/category-props";
import { UserLogin } from "../@types/user-props";
import axiosInstance from "./axiosInstance";

export const apiGetCategories = () => axiosInstance.get('admin/categories'  );
export const apiPostCategory = (category: CategoryRequest) => axiosInstance.post(`admin/categories`, category);
export const apiPutCategory = (id: string, category: CategoryRequest) => axiosInstance.put(`/admin/categories/${id}`, category);