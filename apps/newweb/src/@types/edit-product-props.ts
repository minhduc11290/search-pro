import { Product } from "./product-props";

export interface EditProductProps {
    opened: boolean;
    productInfo: Product;
    close: (isReload: boolean) => void;
}