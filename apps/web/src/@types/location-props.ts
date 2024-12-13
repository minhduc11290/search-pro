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

export interface LocationInfoRequest {
    name?: string;
    address?: string;
    openTime?: string;
    closeTime?: string,
    geoRefId?: string,
    isActive: boolean
}
