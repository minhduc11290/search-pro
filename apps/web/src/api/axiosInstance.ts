
import axios from "axios";
import { PATH } from "../constants/paths";

const axiosInstance = axios.create({
    // baseURL: "http://localhost:6868/",
    baseURL: "http://192.241.159.48/", // Thay bằng URL API của bạn
    timeout: 10000, // Thời gian chờ tối đa
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để bổ sung hoặc thay đổi headers
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(config);
        const token = localStorage.getItem("authToken"); // Lấy token động từ state, context, hoặc localStorage
        if (token) {
            if (config.url != 'admin/users/login') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log("error", error);
    if (error.response && error.response.status === 401) {
        // const navigate = useNavigate();
        window.location.href = PATH.LOGIN;
        localStorage.removeItem("authToken");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default axiosInstance;