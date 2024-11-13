import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch } from "@mantine/core";
import { EditStoreProps } from "../../../@types/edit-store-props";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { phoneRegex } from '../../../utils/regex';
import { useEffect } from "react";
import { Status } from "../../../@types/enum/status";
const EditStorePage = ({ opened, storeInfo, close }: EditStoreProps) => {
    const schema = z.object({
        name: z
            .string({
                required_error: 'Required information',
            }).trim()
            .min(1, { message: 'Required information' }),
        email: z.string().trim().email({ message: 'Invalid email' }).min(1, { message: 'Required information' }),
        phone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' })

    });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: storeInfo.ownerstore,
            email: storeInfo.email,
            phone: storeInfo.phone,
            status: storeInfo.status
        },
        validate: zodResolver(schema),

    });

    useEffect(() => {
        console.log("vo day", storeInfo);
        console.log(storeInfo.ownerstore);

        form.setValues({
            name: storeInfo.ownerstore,
            email: storeInfo.email,
            phone: storeInfo.phone,
            status: storeInfo.status
        })
        console.log(form.getInputProps('email'));
    }, [storeInfo])

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
                    key={form.key('phone')}
                    {...form.getInputProps('phone')}
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
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch>
                <Text className="ml-2 font-normal text-sm">Active/ Deactive account</Text>
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={close}>Close</Button>
            <Button onClick={() => {
                var result = form.validate();
                if (!result.hasErrors) {
                    close();
                }
            }}>Save</Button>
        </Group>

    </Modal>
    )
}
export default EditStorePage;