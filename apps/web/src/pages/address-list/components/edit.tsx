import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Select, rem, Container, ActionIcon, Image } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useEffect, useState } from "react";
import { Status } from "../../../@types/enum/status";
import { EditLocationProps } from "../../../@types/edit-location-props";
import { TimeInput } from '@mantine/dates';
import useGeoRef from "../../../hooks/georef";
import { GeoProps } from "../../../@types/geo-props";
import useStoreLocations from "../../../hooks/store-locations";
import { useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Attachment } from "../../../@types/product-props";
import { getLink } from "../../../utils/image";
import { phoneRegex } from "../../../utils/regex";
import useStoreProducts from "../../../hooks/store-products";
import { FileInfo } from "../../../@types/file-info";

const EditAddressPage = ({ opened, locationInfo, close }: EditLocationProps) => {
    const location = useLocation();
    const storeId = location.state.id;
    const schema = z.object({
        address: z
            .string().trim()
            .min(1, { message: 'Required information' }),
        state: z.string().trim().min(1, { message: 'Required information' }),
        zipCode: z.string().min(5, { message: 'Required information' }),
        phone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' }),
        openAt: z.string().trim().min(1, { message: 'Required information' }),
        closeAt: z.string().trim().min(1, { message: 'Required information' }),
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
            address: locationInfo.address,
            state: locationInfo.state,
            zipCode: locationInfo.zipCode,
            openAt: locationInfo.openAt,
            closeAt: locationInfo.closeAt,
            status: locationInfo.status,
            phone: locationInfo.phone ?? '',
            images: [],

        },
        validate: zodResolver(schema),

    });

    useEffect(() => {
        console.log("locationInfo", locationInfo);
        initData();

    }, [locationInfo])

    const initData = async () => {
        await getData();
        form.setValues({
            address: locationInfo.address,
            state: locationInfo.state,
            zipCode: locationInfo.zipCode,
            openAt: locationInfo.openAt,
            closeAt: locationInfo.closeAt,
            status: locationInfo.status,
            phone: locationInfo.phone,
            images: []
        })
        setImages(locationInfo.attachments ?? []);
    }

    const { updateLocation, addLocationAttachment } = useStoreLocations();

    const { getGeoRef } = useGeoRef();

    const [geos, setGeos] = useState<GeoProps[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const [imageDelete, setImageDelete] = useState<string[]>([]);
    const [images, setImages] = useState<Attachment[]>([]);


    const getData = async () => {
        const _geos = await getGeoRef();
        setGeos(_geos);
        const _states: string[] = [];
        _geos.map((geo) => {
            _states.push(geo.steName);
        });
        const uniqueStates = [...new Set(_states)];
        setStates(uniqueStates);

        if (locationInfo.state) {
            const _zipCodes: string[] = [];
            const geoFilter = _geos.filter((geo) => geo.steName == locationInfo.state);
            geoFilter.map((geo) => {
                _zipCodes.push(geo.zipCode);
            });
            const uniqueZipCodes = [...new Set(_zipCodes)];
            setZipCodes(uniqueZipCodes);
        }
    }



    const onChangeStates = (stateName: string) => {
        form.setFieldValue('state', stateName);
        const geoFilter = geos.filter((geo) => geo.steName == stateName);

        const _zipCodes: string[] = [];
        geoFilter.map((geo) => {
            _zipCodes.push(geo.zipCode);
        });
        const uniqueZipCodes = [...new Set(_zipCodes)];
        setZipCodes(uniqueZipCodes);

    }
    const { uploadFile, deleteAttachment } = useStoreProducts();
    const handleSubmit = async () => {
        const formData = form.validate();
        if (!formData.hasErrors) {
            const geoRefId = geos.find((geo) => geo.steName == form.getValues().state && geo.zipCode == form.getValues().zipCode);
            if (geoRefId) {
                let images: FileInfo[] = [];
                if (imageDelete) {
                    for (const _image of imageDelete) {
                        await deleteAttachment(_image);
                    }
                }

                if (form.getValues().images && form.getValues().images.length > 0) {
                    const { data } = await uploadFile(form.getValues().images);

                    images = [...data];
                    // for (const _image in data) {
                    //     attachments.push({
                    //         id: "",
                    //         name: _image.fileName
                    //     });
                    // }
                    const attachments: Attachment[] = images.map((image) => {
                        return {
                            name: image.fileName,
                            url: image.fileName,
                        }
                    });
                    await addLocationAttachment(locationInfo.locationID ?? '', attachments);
                }


                const { result, errorMessage } = await updateLocation(storeId, locationInfo.locationID, {
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
                        message: `Location have been updated successfully`,
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
                    data={states}
                    key={form.key('state')}
                    {...form.getInputProps('state')}
                    onChange={(_value, option) => onChangeStates(option?.value)}
                    searchable
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
                    searchable
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
                    images && images.map((file, index) =>
                        <Container className="w-20 h-20 mx-2  rounded-lg relative" key={`image_${index}`}>

                            <Image className="w-full h-full" radius="md" fit="contain"
                                src={getLink(file.name)}></Image>
                            <ActionIcon style={{ top: '-12px', right: '-12px' }} className="absolute right-0 top-0 w-4 h-4 rounded-full border" variant="transparent" onClick={
                                () => {
                                    // form.removeListItem('images', index);
                                    // setImageDelete([...imageDelete, file.id]);
                                    // setImages([...images.slice(index)]);
                                    setImageDelete([...imageDelete, file.id!]);
                                    console.log("index", index);
                                    images.splice(index, 1);
                                    setImages([...images]);
                                }
                            }>
                                <IconX className="w-4 stroke-[#e5e7eb]"></IconX>
                            </ActionIcon>
                        </Container>
                    )
                }

                {
                    form.getValues().images.map((file, index) =>
                        <Container className="w-20 h-20 mx-2  rounded-lg relative" key={index}>

                            <Image className="w-full h-full" radius="md" fit="contain"
                                src={typeof file === "string" ? file : (URL.createObjectURL(file) ?? '')}></Image>
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

                        const _files = form.getValues().images;
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
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal>
    )
}
export default EditAddressPage;