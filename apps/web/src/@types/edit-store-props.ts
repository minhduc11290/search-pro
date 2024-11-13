import { Store } from "./store-props";

export interface EditStoreProps {
    opened: boolean;
    storeInfo: Store;
    close: () => void;
}