
export interface AdminRequest {
    name: string;
    primaryPhone: string;
    password: string;
    email: string;
    isActive: boolean;
}

export interface UpdateAdminRequest {
    name?: string;
    primaryPhone?: string;
    email?: string;
    isActive: boolean;
}
