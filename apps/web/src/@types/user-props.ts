import { Status } from "./enum/status";

export interface UserInfo {
    no: number;
    userID: string;
    userName: string;
    fullName: string;
    phone: string;
    email: string;
    state: string;
    status: Status;
}

export interface UserLogin {
    email: string;
    password: string;
}

