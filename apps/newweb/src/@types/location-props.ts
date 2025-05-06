import { Status } from "./enum/status";
import { Attachment } from "./product-props";
import { SearchableCities } from "./searchable-cities";

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


    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    fax?: string;
    isOpenMon: boolean;
    openTimeMon: string;
    closeTimeMon: string;

    isOpenTue: boolean;
    openTimeTue: string;
    closeTimeTue: string;

    isOpenWed: boolean;
    openTimeWed: string;
    closeTimeWed: string;

    isOpenThu: boolean;
    openTimeThu: string;
    closeTimeThu: string;

    isOpenFri: boolean;
    openTimeFri: string;
    closeTimeFri: string;

    isOpenSat: boolean;
    openTimeSat: string;
    closeTimeSat: string;

    isOpenSun: boolean;
    openTimeSun: string;
    closeTimeSun: string;

    latitude: number,
    longitude: number,
    cities?: string[];

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
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    fax?: string;
    isOpenMon: boolean;
    openTimeMon: string;
    closeTimeMon: string;

    isOpenTue: boolean;
    openTimeTue: string;
    closeTimeTue: string;

    isOpenWed: boolean;
    openTimeWed: string;
    closeTimeWed: string;

    isOpenThu: boolean;
    openTimeThu: string;
    closeTimeThu: string;

    isOpenFri: boolean;
    openTimeFri: string;
    closeTimeFri: string;

    isOpenSat: boolean;
    openTimeSat: string;
    closeTimeSat: string;

    isOpenSun: boolean;
    openTimeSun: string;
    closeTimeSun: string;

    latitude: number;
    longitude: number;
    cities?: SearchableCities[];
}
