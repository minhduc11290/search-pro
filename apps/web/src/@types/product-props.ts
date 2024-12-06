import { Status } from "./enum/status";

export interface Product {
    no: number;
    SKU: string;
    productName: string;
    keysword: string;
    description: string;
    locationInfo: LocationPrice[];
    image: string;
    status: Status

}

export interface LocationPrice {
    locationID: string,
    address?: string,
    state?: string;
    zipCode?: string;
    price: string,
}