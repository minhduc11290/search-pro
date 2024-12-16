import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Select, rem, Container, ActionIcon, Image } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Status } from "../../../@types/enum/status";
import { TimeInput } from "@mantine/dates";
import { CreateLocationProps } from "../../../@types/create-location-props";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useGeoRef from "../../../hooks/georef";
import { GeoProps } from "../../../@types/geo-props";
import useStoreLocations from "../../../hooks/store-locations";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { phoneRegex } from "../../../utils/regex";
import { FileInfo } from "../../../@types/file-info";
import useStoreProducts from "../../../hooks/store-products";
const CreateAddressPage = ({ opened, close }: CreateLocationProps) => {
    const location = useLocation();
    const storeId = location.state.id;
    console.log("CreateAddressPage-storeId", storeId);

    const schema = z.object({
        address: z
            .string().trim()
            .min(1, { message: 'Required information' }),
        state: z.string({ required_error: "Required information" }).trim().min(1, { message: 'Required information' }),
        zipCode: z.string({ required_error: "Required information", invalid_type_error: "Required information", }).trim().min(1, { message: 'Required information' }),
        openAt: z.string().trim().min(1, { message: 'Required information' }),
        closeAt: z.string().trim().min(1, { message: 'Required information' }),
        phone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' }),

    });

    const form = useForm<{
        address: string,
        state: string,
        zipCode: string,
        openAt: string,
        closeAt: string,
        status: Status,
        images: FileWithPath[]
        phone: string,
    }>({
        mode: 'uncontrolled',
        initialValues: {
            address: '',
            state: '',
            zipCode: '',
            openAt: '',
            closeAt: '',
            status: Status.Deactive,
            images: [],
            phone: ''
        },
        validate: zodResolver(schema),

    });

    const { uploadFile } = useStoreProducts();

    const handleSubmit = async () => {
        console.log("form", form.getValues());
        const formData = form.validate();
        if (!formData.hasErrors) {
            // console.log(form.getValues());
            const geoRefId = geos.find((geo) => geo.steName == form.getValues().state && geo.zipCode == form.getValues().zipCode);
            if (geoRefId) {
                let images: FileInfo[] = [];
                if (form.getValues().images) {
                    const { data } = await uploadFile(form.getValues().images);

                    images = [...data];
                }
                const { result, errorMessage } = await createLocation(storeId, {
                    name: form.getValues().address,
                    address: form.getValues().address,
                    openTime: form.getValues().openAt,
                    closeTime: form.getValues().closeAt,
                    geoRefId: geoRefId?.id ?? "",
                    isActive: form.getValues().status == Status.Active,
                    phone: form.getValues().phone,
                    attachments: images.map((image) => {
                        return {
                            name: image.fileName,
                            url: image.fileName,
                        }
                    }),
                });
                if (result) {
                    notifications.show({
                        title: `Success`,
                        message: `Location have been created successfully`,
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

            } else {
                form.setFieldError('state', "Geo donot exsist");
            }

        }
    }

    const { getGeoRef } = useGeoRef();

    const { createLocation } = useStoreLocations();

    const [geos, setGeos] = useState<GeoProps[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const _geos = await getGeoRef();
        setGeos(_geos);
        const _states: string[] = [];
        _geos.map((geo) => {
            _states.push(geo.steName);
        });

        const uniqueStates = [...new Set(_states)];
        setStates(uniqueStates);
    }

    const onChangeStates = (stateName: string) => {
        form.setFieldValue('state', stateName);
        console.log(stateName);
        console.log(geos);
        const geoFilter = geos.filter((geo) => geo.steName == stateName);

        const _zipCodes: string[] = [];
        console.log("geoFilter", geoFilter);
        geoFilter.map((geo) => {
            _zipCodes.push(geo.zipCode);
        });
        const uniqueZipCodes = [...new Set(_zipCodes)];
        console.log("zip", uniqueZipCodes);
        setZipCodes(uniqueZipCodes);

    }



    return (<Modal opened={opened} onClose={() => { }} size="md" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Create new location </Title>
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
                    data={states}

                    key={form.key('state')}
                    {...form.getInputProps('state')}
                    onChange={(_, option) => onChangeStates(option.value)}
                />
            </Grid.Col>
            <Grid.Col span={4} >
                {/* <TextInput
                    label="Zip code"
                    placeholder="Zip code"
                    withAsterisk
                    key={form.key('zipCode')}
                    {...form.getInputProps('zipCode')}
                /> */}
                <Select
                    label="Zip code"
                    placeholder="Zip code"
                    data={zipCodes}
                    key={form.key('zipCode')}
                    {...form.getInputProps('zipCode')}
                />
            </Grid.Col>
            <Grid.Col span={12} >
                <TextInput
                    label="Phone"
                    placeholder="Enter phone"
                    key={form.key('phone')}
                    {...form.getInputProps('phone')}
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
                    {...form.getInputProps('closeAt')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch>
                <Text className="ml-2 font-normal text-sm">Active/ Deactive location</Text>
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row pt-0">
                {
                    form.getValues().images.map((file, index) =>
                        <Container className="w-20 h-20 mx-2  rounded-lg relative" key={index}>

                            <Image className="w-full h-full" radius="md" fit="contain"
                                src={URL.createObjectURL(file) ?? ''}></Image>
                            <ActionIcon style={{ top: '-12px', right: '-12px' }} className="absolute right-0 top-0 w-4 h-4 rounded-full border" variant="transparent" onClick={
                                () => {
                                    form.removeListItem('images', index);
                                }
                            }>
                                <IconX className="w-4 stroke-[#e5e7eb]"></IconX>
                            </ActionIcon>
                        </Container>
                    )

                }
                <Dropzone
                    multiple
                    onDrop={(files) => {
                        console.log(files);
                        const _files = form.getValues().images;
                        if (_files.length + files.length > 10) {
                            form.setFieldError('images', 'Only upload 10 files for every product');
                            return;
                        }

                        form.setFieldValue('images', [..._files, ...files]);
                    }}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Container className="w-20 h-20 flex items-center justify-center border rounded-lg">
                        <Group justify="center" gap="xl" mih={48} style={{ pointerEvents: 'none' }}>
                            <Dropzone.Idle>
                                <IconPlus
                                    style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-dimmed)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Idle>
                        </Group>
                    </Container>
                </Dropzone>
                {form.errors.files && (
                    <Text c="red" mt={5}>
                        {form.errors.files}
                    </Text>
                )}
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal>
    )
}
export default CreateAddressPage;