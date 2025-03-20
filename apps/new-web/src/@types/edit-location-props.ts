import { LocationInfo } from "./location-props";

export interface EditLocationProps {
    opened: boolean;
    locationInfo: LocationInfo;
    close: (isReload: boolean) => void;
}