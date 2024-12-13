import { useCallback, useEffect, useState } from "react";
import { Status } from "../@types/enum/status";
import { Store } from "../@types/store-props";
import { apiGetStoreById } from "../api/stores";
import { AxiosError } from "axios";
import { Attachment, LocationPrice, Product, ProductRequest, UpdateProductRequest } from "../@types/product-props";
import { apiGetStoreProducts, apiPostStoreProduct, apiPutStoreProduct, apiUpdateLocation, apiAddAttachement, apiAddLocation, apiDeleteAttachement } from "../api/store-products";
import { apiPostFile } from "../api/file";
import { FileInfo } from "../@types/file-info";
import { getLink } from "../utils/image";
import { FileWithPath } from "@mantine/dropzone";

const useStoreProducts = () => {

    const [isLoading, setIsLoading] = useState(true);


    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);



    const getStoreProducts = useCallback(async (storeID: string): Promise<Product[]> => {
        let products: Product[] = [];
        try {
            setIsLoading(true);
            const response = await apiGetStoreProducts(storeID);

            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                products = response.data.map((item, index) => {
                    const product: Product = {
                        no: index + 1,
                        id: item.id,
                        SKU: item.sku,
                        productName: item.name,
                        keysword: item.keywords,
                        description: item.description,
                        locationInfo: Array.isArray(item.locations) ? item.locations.map((_location: any) => {
                            return {
                                id: _location.id,
                                locationID: _location.locationId,
                                address: _location.address ?? '',
                                state: _location.steName ?? '',
                                zipCode: _location.zipCode,
                                price: _location.price,
                                steName: _location.steName
                            }
                        }) : [],
                        image: Array.isArray(item.attachments) && item.attachments.length > 0 ? getLink(item.attachments[0]?.name) : getLink('no-image.png'), // toDo:
                        attachments: item.attachments,
                        status: item.status == 'ACTIVE' ? Status.Active : Status.Deactive
                    }
                    return product;
                });
            }
            // setIsAuthenticated(true);

        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return products;
    }, []);


    const createProduct = useCallback(async (storeId: string, product: ProductRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPostStoreProduct(storeId, product);
            if (response.status == 201) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);


    const uploadFile = useCallback(async (files: File[]) => {
        let result = false;
        let errorMessage = "";
        let data: FileInfo[] = [];
        try {
            setIsLoading(true);
            const response = await apiPostFile(files);
            if (response.status == 201) {
                console.log("data-uploads", response.data);
                if (Array.isArray(response.data.files)) {
                    console.log("upload - vo day");
                    data = response.data.files;
                }
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage, data };
    }, []);


    const updateProduct = useCallback(async (productId: string, product: UpdateProductRequest) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiPutStoreProduct(productId, product);
            if (response.status == 200) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);


    const getStoreInfoById = useCallback(async (storeID: string): Promise<Store | null> => {
        let store = null;
        try {
            setIsLoading(true);
            const response = await apiGetStoreById(storeID);

            // localStorage.setItem('authToken', token);

            // setIsAuthenticated(true);
            store = {
                no: 0,
                id: response.data.id,
                ownerstore: response.data.name,
                userName: response.data.name,
                phone: response.data.phone,
                email: response.data.email,
                status: response.data.status == "ACTIVE" ? Status.Active : Status.Deactive,
            };
        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return store;
    }, []);


    const deleteAttachment = useCallback(async (id: string) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiDeleteAttachement(id);
            if (response.status == 200) {
                console.log("data-uploads", response.data);
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);

    const addAttachment = useCallback(async (productId: string, files: Attachment[]) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            // const strFiles: string[] = [];
            // files.forEach(file => {
            //     strFiles.push(file.name);
            // });
            const response = await apiAddAttachement(productId, files);
            if (response.status == 201) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);

    const updateLocation = useCallback(async (location: LocationPrice) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            if (location.id ?? "" != "") {
                const response = await apiUpdateLocation(location.id ?? "", {
                    id: location.locationID,
                    price: Number(location.price)
                });
                if (response.status == 201) {
                    result = true;
                }
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);

    const addLocation = useCallback(async (productId: string, location: LocationPrice) => {
        let result = false;
        let errorMessage = "";
        try {
            setIsLoading(true);
            const response = await apiAddLocation(productId, {
                id: location.locationID,
                price: Number(location.price)
            });
            if (response.status == 201) {
                result = true;
            }
        } catch (ex) {
            if (ex instanceof AxiosError) {
                errorMessage = ex.response?.data?.message ?? ex.message;
            } else if ((ex instanceof Error)) {
                errorMessage = ex.message;
            }

            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        return { result, errorMessage };
    }, []);


    return { isLoading, getStoreProducts, getStoreInfoById, createProduct, updateProduct, uploadFile, deleteAttachment, addAttachment, updateLocation, addLocation };
};

export default useStoreProducts;