import { useCallback, useEffect, useState } from "react";
import { GeoProps } from "../@types/geo-props";
import { apiGetGeoRef } from "../api/georef";

const useGeoRef = () => {

    const [isLoading, setIsLoading] = useState(true);
    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);

    const getGeoRef = useCallback(async (): Promise<GeoProps[]> => {
        let geos: GeoProps[] = [];
        try {
            setIsLoading(true);
            const response = await apiGetGeoRef();
            console.log("response.data", response.data);
            // localStorage.setItem('authToken', token);
            if (Array.isArray(response.data)) {
                geos = response.data.map((item) => {
                    const geo: GeoProps = {
                        id: item.id,
                        zipCode: item.zipCode,
                        steName: item.steName
                    }
                    return geo;
                });
            }

            // setIsAuthenticated(true);

        } catch (ex) {
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
        console.log(geos);
        return geos;
    }, []);


    return { isLoading, getGeoRef };
};

export default useGeoRef;