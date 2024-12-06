import { useEffect, useState } from "react";

const useGeoRef = () => {

    const [isLoading, setIsLoading] = useState(true);
    // Kiểm tra trạng thái đăng nhập từ localStorage khi hook khởi tạo
    useEffect(() => {
        setIsLoading(false);
    }, []);

    return { isLoading };
};

export default useGeoRef;