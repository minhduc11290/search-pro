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
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

export default function LoginPage() {
    const schema = z.object({
        email: z
            .string().trim()
            .min(1, { message: 'Required information' }),
        password: z.string().trim().min(1, { message: 'Required information' }),
    });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
        validate: zodResolver(schema),

    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async () => {
        const result = form.validate();
        if (!result.hasErrors) {
            var logined = await login(form.getValues());
            if (logined) {
                navigate(PATH.STOREMANAGEMENT);
            } else {
                form.setErrors({ email: 'User not found!' });
            }
        }
    }


    return (
        <Container size={420} className='w-screen h-screen flex items-center flex-1 flex-grow flex-row align-middle justify-center' >

            <Paper withBorder shadow="md" p={30} radius="md" >
                <Title ta="center" className={`${classes.title} mb-4`} >
                    Admin system
                </Title>
                <TextInput placeholder="Enter email" required
                    key={form.key('email')}
                    {...form.getInputProps('email')} />
                <PasswordInput placeholder="Enter password" required mt="md"
                    key={form.key('password')}
                    {...form.getInputProps('password')} />

                <Button fullWidth mt="xl" onClick={handleLogin}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}