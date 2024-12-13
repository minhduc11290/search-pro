import { Status } from "./enum/status";

export interface Product {
    id?: string,
    no: number;
    SKU: string;
    productName: string;
    keysword: string[];
    description: string;
    locationInfo: LocationPrice[];
    image: string;
    status: Status;
    attachments: Attachment[];

}

export interface Attachment {
    id?: string;
    name: string;
    url: string;
}

export interface LocationPrice {
    id?: string
    locationID: string,
    address?: string,
    state?: string;
    zipCode?: string;
    price: number,
    steName?: string,
    status?: string,
}

export interface ProductRequest {
    sku: string,
    name: string,
    keywords: string[];
    description: string;
    productLocations: {
        locationId: string,
        price: number
    }[],
    attachments: {
        name: string,
        url: string,
    }[],
    isActive: boolean
}

export interface UpdateProductRequest {
    sku: string,
    name: string,
    keywords: string[];
    description: string;
    isActive: boolean
}