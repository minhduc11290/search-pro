export interface Store {
    no: number;
    ownerstore: string;
    userName: string;
    phone: string;
    email: string;
    status: Status,
    

}

export enum Status {
    Active, Deactive
}