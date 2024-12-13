import { Attachment, ProductRequest, UpdateProductRequest } from "../@types/product-props";
import axiosInstance from "./axiosInstance";

export const apiGetStoreProducts = (storeId: string) => axiosInstance.get(`/admin/stores/${storeId}/products`);
export const apiPutStoreProduct = (productId: string, product: UpdateProductRequest) => axiosInstance.put(`/admin/products/${productId}`, product);
export const apiPostStoreProduct = (storeId: string, product: ProductRequest) => axiosInstance.post(`/admin/stores/${storeId}/products`, product);
export const apiDeleteStore = (id: string) => axiosInstance.delete(`/admin/stores/${id}`);
export const apiDeleteAttachement = (attachmentId: string) => axiosInstance.delete(`/admin/attachment/${attachmentId}`);
export const apiAddAttachement = (productId: string, attachments: Attachment[]) => axiosInstance.post(`/admin/products/${productId}/attachment`, attachments);
export const apiUpdateLocation = (locationId: string, location: {
    price: number,
    id: string,
}) => axiosInstance.put(`/admin/products/locations/${locationId}`, location);
export const apiAddLocation = (productId: string, location: {
    price: number,
    id: string,
}) => axiosInstance.post(`/admin/products/${productId}/locations`, location);