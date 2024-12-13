import { LocationPrice } from "./product-props";

export interface ListLocationProps {
    opened: boolean;
    close: (isReload: boolean) => void;
    locationPrice: LocationPrice[],
}