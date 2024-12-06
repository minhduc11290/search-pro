import useSWR from "swr";
import { getProduct } from "@/api/products";

export const useGetGeoRef = (params = {}) => {
    const endpoint = "/product";

    // Gắn params vào endpoint hoặc fetcher
    const { data, error, isLoading, mutate } = useSWR(
        [endpoint, params], // Key gồm endpoint và params
        ([url, params]) => getProduct(url, params) // Gọi fetcher với params
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};