import useSWR from "swr";
import { getQuotes, getQuoteByID, postQuotes } from "@/api/quotes";

export const useGetQuotes = (params = {}) => {
    const endpoint = "/quotes";


    // Gắn params vào endpoint hoặc fetcher
    const { data, error, isLoading, mutate } = useSWR(
        [endpoint, params], // Key gồm endpoint và params
        ([url, params]) => getQuotes(url) // Gọi fetcher với params
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};


export const usePostQuote = (params = {}) => {
    const endpoint = "/quotes";

    // Gắn params vào endpoint hoặc fetcher
    const { data, error, isLoading, mutate } = useSWR(
        [endpoint, params], // Key gồm endpoint và params
        ([url, params]) => postQuotes(url, params) // Gọi fetcher với params
    );
    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export const usegetQuoteByID = (id: string) => {
    const endpoint = "/users";

    // Gắn params vào endpoint hoặc fetcher
    const { data, error, isLoading, mutate } = useSWR(
        [endpoint, id], // Key gồm endpoint và params
        ([url, id]) => getQuoteByID(url, id) // Gọi fetcher với params
    );
    return {
        data,
        error,
        isLoading,
        mutate,
    };
};
