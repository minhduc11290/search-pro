import { Status } from "./enum/status";

export interface Category {
    name: string,
    id: string
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

}

export interface StoreRequest {
    name: string;
    primaryPhone: string;
    password: string;
    email: string;
    isActive: boolean;
    categoryId: string;
}

export interface UpdateStoreRequest {
    name?: string;
    primaryPhone?: string;
    email?: string;
    isActive: boolean;
    categoryId?: string;
}
