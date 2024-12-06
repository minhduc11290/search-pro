// import useSWR from "swr";
// import { getUser, postCreateUser, login, logout } from "@/api/users";
// import { useState } from "react";

// export const useGetUser = (params = {}) => {
//     const endpoint = "/users/me";


//     // Gắn params vào endpoint hoặc fetcher
//     const { data, error, isLoading, mutate } = useSWR(
//         [endpoint, params], // Key gồm endpoint và params
//         ([url, params]) => getUser(url) // Gọi fetcher với params
//     );

//     return {
//         data,
//         error,
//         isLoading,
//         mutate,
//     };
// };


// export const useRegistration = (params = {}) => {
//     const endpoint = "/users";

//     // Gắn params vào endpoint hoặc fetcher
//     const { data, error, isLoading, mutate } = useSWR(
//         [endpoint, params], // Key gồm endpoint và params
//         ([url, params]) => postCreateUser(url, params) // Gọi fetcher với params
//     );
//     return {
//         data,
//         error,
//         isLoading,
//         mutate,
//     };
// };

// export const useLogin = (params = {}) => {
//     const endpoint = "/users";

//     // Gắn params vào endpoint hoặc fetcher
//     const { data, error, isLoading, mutate } = useSWR(
//         [endpoint, params], // Key gồm endpoint và params
//         ([url, params]) => login(url, params) // Gọi fetcher với params
//     );
//     return {
//         data,
//         error,
//         isLoading,
//         mutate,
//     };
// };


// export const useLogout = (params = {}, shouldFetchApi = false ) => {
//     const endpoint = "/users";
   
//     // Gắn params vào endpoint hoặc fetcher
//     const { data, error, isLoading, mutate } = useSWR(
//         shouldFetchApi ? endpoint: null, // Key gồm endpoint và params
//         ([url, params]) => logout(url, params) // Gọi fetcher với params
//     );

//     return {
//         data,
//         error,
//         isLoading,
//         mutate,
//     };
// };