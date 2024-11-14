import {
    TextInput,
    PasswordInput,
    Paper,
    Container,
    Button,
    Title
} from '@mantine/core';
import classes from './login.module.css';
import { useNavigate } from "react-router-dom";
import { PATH } from '../../constants/paths';
import useAuth from '../../hooks/auth';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    function handleLogin() {
        login("demo");
        navigate(PATH.PRODUCT);
    }
    return (
        <Container size={420} className='w-screen h-screen flex items-center flex-1 flex-grow flex-row align-middle justify-center' >

            <Paper withBorder shadow="md" p={30} radius="md" >
                <Title ta="center" className={`${classes.title} mb-4`} >
                    Admin system
                </Title>
                <TextInput placeholder="Enter username" required />
                <PasswordInput placeholder="Enter password" required mt="md" />

                <Button fullWidth mt="xl" onClick={handleLogin}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}