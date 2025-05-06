import { Status } from "./enum/status";

export interface Category {
    name: string,
    id: string,
    url: string,
    productUrl: string,
}

export interface Store {
    no: number;
    id: string;
    ownerstore: string;
    userName: string;
    phone: string;
    email: string;
    status: Status;
    password?: string;
    pw?: string,
    category?: string,
    website?: string,
    createdAt?: string,
    createdBy?: string,
    type?: string

}

export interface StoreRequest {
    name: string;
    primaryPhone: string;
    password: string;
    email: string;
    isActive: boolean;
    categoryId: string;
    website: string;
    type?: string;
}

export interface UpdateStoreRequest {
    name?: string;
    primaryPhone?: string;
    email?: string;
    isActive: boolean;
    categoryId?: string;
    website?: string;
    type?: string;
}
