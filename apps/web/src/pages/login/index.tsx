import {
    TextInput,
    PasswordInput,
    // Paper,
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
import { useState } from 'react';

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
    const [pressed, setPressed] = useState(false);
    const handleLogin = async () => {
        if (!pressed) {
            setPressed(true);
            const result = form.validate();
            if (!result.hasErrors) {
                const { status, token } = await login(form.getValues());
                if (logined) {
                    navigate(PATH.STOREMANAGEMENT);
                } else {
                    form.setErrors({ email: 'User not found!' });

                }
                setPressed(false);
            }

        }


    }


    return (
        <Container fluid className='w-screen h-screen flex items-center flex-1 flex-grow flex-row align-middle justify-center px-0' >
            <Container className={`${classes.backgroundLeft} h-full hidden sm:flex sm:w-8/12 relative px-0`} >
                <Container className={`w-full h-full flex items-center flex-1 justify-center px-0`}>
                    <img src="/home.svg" height="500" width="500"></img>
                </Container>
            </Container>
            <Container className='w-full flex flex-col md:w-4/12'>
                {/* <Paper withBorder shadow="md" p={30} radius="md" > */}
                <Title className={`${classes.title} mb-1`} >
                    Welcome to DBS
                </Title>
                <Title className={`${classes.subtitle} mb-4`} >
                    Your Admin Dashboard
                </Title>
                <TextInput placeholder="Enter email" required
                    label={<span className={`${classes.labelInput}`}>Email</span>}
                    withAsterisk={false}
                    key={form.key('email')}
                    styles={{ input: { height: 44, borderRadius: 7 } }}
                    {...form.getInputProps('email')} />
                <PasswordInput placeholder="Enter password" required mt="md"
                    label={<span className={`${classes.labelInput}`}>Password</span>}
                    withAsterisk={false}
                    key={form.key('password')}
                    styles={{ input: { height: 44, borderRadius: 7 } }}
                    {...form.getInputProps('password')} />

                <Button fullWidth mt="xl" onClick={handleLogin} className='h-10 rounded-lg bg-[#5D87FF] hover:bg-[#4570EA]'>
                    Sign In
                </Button>
                {/* </Paper> */}
            </Container>


        </Container>
    );
}