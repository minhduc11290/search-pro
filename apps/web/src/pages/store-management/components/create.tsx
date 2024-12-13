import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, PasswordInput, rem } from "@mantine/core";
import { CreateStoreProps } from "../../../@types/create-store-props";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { phoneRegex } from '../../../utils/regex';
import { Status } from "../../../@types/enum/status";
import useStore from "../../../hooks/stores";
import { notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useEffect } from "react";

const CreateStorePage = ({ opened, close }: CreateStoreProps) => {
    const schema = z.object({
        name: z
            .string({
                required_error: 'Required information',
            }).trim()
            .min(1, { message: 'Required information' }),
        email: z.string().trim().email({ message: 'Invalid email' }).min(1, { message: 'Required information' }),
        primaryPhone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' }),
        // userName: z.string().trim().min(4).min(1, { message: 'Required information' }),
        password: z.string().min(4),
        confirmPassword: z.string().min(4),

    }).refine((data) => data.password === data.confirmPassword, {
        message: "Confirm password doesn't match",
        path: ["confirmPassword"],
    });;
    const { createStore } = useStore();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            email: '',
            primaryPhone: '',
            status: Status.Deactive,
            userName: '',
            password: '',
            confirmPassword: '',
        },
        validate: zodResolver(schema),

    });

    useEffect(() => {
        if (opened) {
            form.reset();
        }
    }, [opened]);

    const handleSubmit = async () => {

        const result = form.validate();
        if (!result.hasErrors) {
            const data = form.getValues()
            const { result, errorMessage, statusCode } = await createStore({
                // ...data,
                isActive: data.status == Status.Active ? true : false,
                // userName: data.email,
                email: data.email,
                name: data.name,
                primaryPhone: data.primaryPhone,
                password: data.password
            });
            if (result) {
                notifications.show({
                    title: `Success`,
                    message: `Store have been created successfully`,
                    color: 'teal',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    position: 'top-right'
                });
                close(true);
            } else {
                if (statusCode != 409) {
                    console.log("errorMessage", errorMessage);
                    notifications.show({
                        title: `Error`,
                        message: errorMessage,
                        color: 'red',
                        icon: <IconX />,
                        position: 'top-right'
                    });
                } else {
                    // Trùng store
                    form.setFieldError('email', errorMessage);
                }
            }

        }
    }

    return (<Modal opened={opened} onClose={() => { }} size="md" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Edit store owner </Title>
        <Grid grow>
            <Grid.Col span={12} >
                <TextInput
                    label="Store owner full name"
                    placeholder="Enter store owner full name"
                    withAsterisk
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
            </Grid.Col>
            <Grid.Col span={6} >
                <TextInput
                    label="Phone number"
                    placeholder="Enter phone number"
                    withAsterisk
                    key={form.key('primaryPhone')}
                    {...form.getInputProps('primaryPhone')}
                />
            </Grid.Col>
            <Grid.Col span={6} >
                <TextInput
                    label="Email"
                    placeholder="Enter email"
                    withAsterisk
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
            </Grid.Col>
            {/* <Grid.Col span={12} >
                <TextInput
                    label="Username"
                    placeholder="Enter username"
                    withAsterisk
                    key={form.key('userName')}
                    {...form.getInputProps('userName')}
                />
            </Grid.Col> */}
            <Grid.Col span={6} >


                <PasswordInput
                    label="Password"
                    withAsterisk
                    placeholder="Enter password"
                    required
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
            </Grid.Col>
            <Grid.Col span={6} >
                <PasswordInput
                    label=" "
                    placeholder="Enter password"

                    key={form.key('confirmPassword')}
                    {...form.getInputProps('confirmPassword')}
                />

            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch> <Text>Active/ Deactive account</Text>
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal >
    )
}
export default CreateStorePage;