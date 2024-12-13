import { Center, Image } from "@mantine/core";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/auth';
import { PATH } from "../../constants/paths";
import { useEffect } from "react";

export default function HomePage() {
    const { isLoading, isAuthenticated, logout, getProfile } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        handleLogin();
        // logout();
        // navigate(PATH.LOGIN);
    }, [isLoading]);
    // function handleLogin() {
    //     login("demo");
    //     navigate(PATH.STOREMANAGEMENT);
    // }

    const handleLogin = async () => {
        if (!isLoading) {
            if (isAuthenticated) {
                const profile = await getProfile();
                if (profile) {
                    navigate(PATH.STOREMANAGEMENT);
                } else {
                    moveToLogin();
                }
            } else {
                moveToLogin();
            }
        }
    }

    const moveToLogin = () => {
        logout();
        navigate(PATH.LOGIN);
    }

    return <Center>
        <Image
            radius="md"
            h={48}
            src={logo}
        />
    </Center>
}