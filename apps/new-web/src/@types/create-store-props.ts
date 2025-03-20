export interface CreateStoreProps {
    opened: boolean;
    close: (isReload: boolean) => void;
}