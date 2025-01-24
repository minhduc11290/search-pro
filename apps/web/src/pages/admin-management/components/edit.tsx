import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, rem } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useEffect } from "react";
import { Status } from "../../../@types/enum/status";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import useAdmin from "../../../hooks/admins";
import { EditAdminProps } from "../../../@types/edit-admin-props";
const EditAdminPage = ({ opened, userInfo, close }: EditAdminProps) => {
    const schema = z.object({
        name: z
            .string({
                required_error: 'Required information',
            }).trim()
            .min(1, { message: 'Required information' }),
        email: z.string().trim().email({ message: 'Invalid email' }).min(1, { message: 'Required information' }),
        // phone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' })

    });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: userInfo.fullName,
            email: userInfo.email,
            phone: userInfo.phone,
            status: userInfo.status
        },
        validate: zodResolver(schema),

    });

    useEffect(() => {

        form.setValues({
            name: userInfo.fullName,
            email: userInfo.email,
            phone: userInfo.phone,
            status: userInfo.status
        })
    }, [userInfo])

    const { updateAdmin } = useAdmin();

    const handleSubmit = async () => {
        const result = form.validate();
        if (!result.hasErrors) {
            const data = form.getValues()
            const { result, errorMessage } = await updateAdmin(userInfo.id ?? "", {
                // ...data,
                isActive: data.status == Status.Active ? true : false,
                // userName: data.email,
                email: data.email,
                name: data.name,
                primaryPhone: data.phone,

            });
            if (result) {
                notifications.show({
                    title: `Success`,
                    message: `Admin have been updated successfully`,
                    color: 'teal',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    position: 'top-right'
                });
                close(true);
            } else {
                console.log("errorMessage", errorMessage);
                notifications.show({
                    title: `Error`,
                    message: errorMessage,
                    color: 'red',
                    icon: <IconX />,
                    position: 'top-right'
                });
            }
            // close(true);
        }
    }

    return (<Modal opened={opened} onClose={() => { }} size="md" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Edit admin </Title>
        <Grid grow>
            <Grid.Col span={12} >
                <TextInput
                    label="Full name"
                    placeholder="Full name"
                    withAsterisk
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
            </Grid.Col>
            {/* <Grid.Col span={6} >
                <TextInput
                    label="Phone number"
                    placeholder="Enter phone number"
                    withAsterisk
                    key={form.key('phone')}
                    {...form.getInputProps('phone')}
                />
            </Grid.Col> */}
            <Grid.Col span={12} >
                <TextInput
                    label="Email"
                    placeholder="Enter email"
                    withAsterisk
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch>
                <Text className="ml-2 font-normal text-sm">Active/ Deactive account</Text>
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal>
    )
}
export default EditAdminPage;