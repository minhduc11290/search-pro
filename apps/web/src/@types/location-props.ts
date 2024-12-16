import { Status } from "./enum/status";
import { Attachment } from "./product-props";

export interface LocationInfo {
    no: number;
    locationID: string;
    address: string;
    state: string;
    zipCode: string;

    openAt: string;
    closeAt: string,
    status: Status
    phone?: string,
    attachments?: Attachment[];

}

export interface LocationInfoRequest {
    name?: string;
    address?: string;
    openTime?: string;
    closeTime?: string,
    geoRefId?: string,
    isActive: boolean,
    phone?: string,
    attachments?: Attachment[];
}
