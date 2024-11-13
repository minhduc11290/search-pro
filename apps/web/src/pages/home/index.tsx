import { Center, Image } from "@mantine/core";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/auth';
import { PATH } from "../../constants/paths";
import { useEffect } from "react";

export default function HomePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        logout();
        navigate(PATH.LOGIN);
    }, []);
    // function handleLogin() {
    //     login("demo");
    //     navigate(PATH.STOREMANAGEMENT);
    // }

    return <Center>
        <Image
            radius="md"
            h={48}
            src={logo}
        />
    </Center>
}