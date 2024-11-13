import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Select, ActionIcon, rem, Container } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { phoneRegex } from '../../../utils/regex';
import { useEffect, useRef } from "react";
import { Status } from "../../../@types/enum/status";
import { EditLocationProps } from "../../../@types/edit-location-props";
import { TimeInput } from '@mantine/dates';
import { IconClock } from "@tabler/icons-react";

const EditAddressPage = ({ opened, locationInfo, close }: EditLocationProps) => {
    const schema = z.object({
        address: z
            .string().trim()
            .min(1, { message: 'Required information' }),
        state: z.string().trim().min(1, { message: 'Required information' }),
        zipCode: z.string().min(5, { message: 'Required information' })

    });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            address: locationInfo.address,
            state: locationInfo.state,
            zipCode: locationInfo.state,
            openAt: locationInfo.openAt,
            closeAt: locationInfo.closeAt,
            status: locationInfo.status
        },
        validate: zodResolver(schema),

    });

    useEffect(() => {
        form.setValues({
            address: locationInfo.address,
            state: locationInfo.state,
            zipCode: locationInfo.state,
            openAt: locationInfo.openAt,
            closeAt: locationInfo.closeAt,
            status: locationInfo.status
        })
    }, [locationInfo])


    const ref = useRef<HTMLInputElement>(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    return (<Modal opened={opened} onClose={() => { }} size="md" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Edit location </Title>
        <Grid grow>
            <Grid.Col span={12} >
                <TextInput
                    label="Address"
                    placeholder="Enter address"
                    withAsterisk
                    key={form.key('address')}
                    {...form.getInputProps('address')}
                />
            </Grid.Col>
            <Grid.Col span={8} >
                <Select
                    label="State"
                    placeholder="State"
                    data={['HCM', 'NJ']}
                    key={form.key('state')}
                    {...form.getInputProps('state')}
                />
            </Grid.Col>
            <Grid.Col span={4} >
                <TextInput
                    label="Zip code"
                    placeholder="Zip code"
                    withAsterisk
                    key={form.key('zipCode')}
                    {...form.getInputProps('zipCode')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row">
                <Title order={4}>Open time</Title><Text className="text-red">*</Text>
            </Grid.Col>
            <Grid.Col span={6} className="flex flex-row items-center">
                <Text className="pr-2" >From</Text>
                <TimeInput
                    style={{ width: '100%' }}

                    key={form.key('openAt')}
                    {...form.getInputProps('openAt')}
                />
            </Grid.Col>
            <Grid.Col span={6} className="flex flex-row items-center">
                <Text className="pr-2">To</Text>

                <TimeInput
                    width={500}
                    placeholder="Opt"
                    style={{ width: '100%' }}
                    key={form.key('closeAt')}
                    {...form.getInputProps('openAt')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch>
                <Text className="ml-2 font-normal text-sm">Active/ Deactive location</Text>
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={close}>Close</Button>
            <Button onClick={() => {
                var result = form.validate();
                console.log(form.getValues());
                if (!result.hasErrors) {
                    close();

                }
            }}>Save</Button>
        </Group>

    </Modal>
    )
}
export default EditAddressPage;