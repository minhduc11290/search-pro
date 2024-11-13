import { Status } from "./enum/status";

export interface LocationInfo {
    no: number;
    locationID: string;
    address: string;
    state: string;
    zipCode: string;
    
    openAt: string;
    closeAt: string,
    status: Status

}
