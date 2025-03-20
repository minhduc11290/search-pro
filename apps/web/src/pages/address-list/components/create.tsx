import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Select, rem, Container, ActionIcon, Image, Checkbox } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Status } from "../../../@types/enum/status";
import { TimeInput } from "@mantine/dates";
import { CreateLocationProps } from "../../../@types/create-location-props";
import { Link, useLocation } from "react-router-dom";
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
        // address: z
        //     .string().trim()
        //     .min(1, { message: 'Required information' }),
        state: z.string({ required_error: "Required information" }).trim().min(1, { message: 'Required information' }),
        zipCode: z.string({ required_error: "Required information", invalid_type_error: "Required information", }).trim().min(1, { message: 'Required information' }),
        // openAt: z.string().trim().min(1, { message: 'Required information' }),
        // closeAt: z.string().trim().min(1, { message: 'Required information' }),
        phone: z.string().regex(phoneRegex, 'Invalid phone').min(1, { message: 'Required information' }),
        addressLine1: z.string().max(1000, { message: 'Only 1000 character' }).min(1, { message: 'Required information' }),
        addressLine2: z.string().max(1000, { message: 'Only 1000 character' }),
        city: z.string().max(1000, { message: 'Only 1000 character' }),
        fax: z.string().optional(), //.regex(phoneRegex, 'Invalid fax'),
        isOpenMon: z.boolean(),
        openTimeMon: z.string().trim().optional(),
        closeTimeMon: z.string().trim().optional(),

        isOpenTue: z.boolean(),
        openTimeTue: z.string().trim().optional(),
        closeTimeTue: z.string().trim().optional(),

        isOpenWed: z.boolean(),
        openTimeWed: z.string().trim().optional(),
        closeTimeWed: z.string().trim().optional(),

        isOpenThu: z.boolean(),
        openTimeThu: z.string().trim().optional(),
        closeTimeThu: z.string().trim().optional(),


        isOpenFri: z.boolean(),
        openTimeFri: z.string().trim().optional(),
        closeTimeFri: z.string().trim().optional(),

        isOpenSat: z.boolean(),
        openTimeSat: z.string().trim().optional(),
        closeTimeSat: z.string().trim().optional(),

        isOpenSun: z.boolean(),
        openTimeSun: z.string().trim().optional(),
        closeTimeSun: z.string().trim().optional(),

        latitude: z.preprocess(
            (value) => (typeof value === 'string' && value ? Number(value) : value),
            z.number()
        ),
        longitude: z.preprocess(
            (value) => (typeof value === 'string' && value ? Number(value) : value),
            z.number()
        ),
    }).superRefine((data, ctx) => {
        if (data.fax) {
            const result = phoneRegex.test(data.fax);
            if (!result) {
                ctx.addIssue({
                    path: ["fax"],
                    message: "Invalid fax",
                    code: "custom",
                });
            }
        }
        if (data.isOpenMon) {
            if (!data.openTimeMon) {
                ctx.addIssue({
                    path: ["openTimeMon"],
                    message: "Open time is required when Monday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeMon) {
                ctx.addIssue({
                    path: ["closeTimeMon"],
                    message: "Close time is required when Monday is open",
                    code: "custom",
                });
            }
        }

        if (data.isOpenTue) {
            if (!data.openTimeTue) {
                ctx.addIssue({
                    path: ["openTimeTue"],
                    message: "Open time is required when Tuesday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeTue) {
                ctx.addIssue({
                    path: ["closeTimeTue"],
                    message: "Close time is required when Tuesday is open",
                    code: "custom",
                });
            }
        }

        if (data.isOpenWed) {
            if (!data.openTimeWed) {
                ctx.addIssue({
                    path: ["openTimeWed"],
                    message: "Open time is required when Wednesday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeWed) {
                ctx.addIssue({
                    path: ["closeTimeWed"],
                    message: "Close time is required when Wednesday is open",
                    code: "custom",
                });
            }
        }


        if (data.isOpenThu) {
            if (!data.openTimeThu) {
                ctx.addIssue({
                    path: ["openTimeThu"],
                    message: "Open time is required when Thursday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeThu) {
                ctx.addIssue({
                    path: ["closeTimeThu"],
                    message: "Close time is required when Thursday is open",
                    code: "custom",
                });
            }
        }


        if (data.isOpenFri) {
            if (!data.openTimeFri) {
                ctx.addIssue({
                    path: ["openTimeFri"],
                    message: "Open time is required when Friday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeFri) {
                ctx.addIssue({
                    path: ["closeTimeFri"],
                    message: "Close time is required when Friday is open",
                    code: "custom",
                });
            }
        }

        if (data.isOpenSat) {
            if (!data.openTimeSat) {
                ctx.addIssue({
                    path: ["openTimeSat"],
                    message: "Open time is required when Saturday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeSat) {
                ctx.addIssue({
                    path: ["closeTimeSat"],
                    message: "Close time is required when Saturday is open",
                    code: "custom",
                });
            }
        }


        if (data.isOpenSun) {
            if (!data.openTimeSun) {
                ctx.addIssue({
                    path: ["openTimeSun"],
                    message: "Open time is required when Sunday is open",
                    code: "custom",
                });
            }
            if (!data.closeTimeSun) {
                ctx.addIssue({
                    path: ["closeTimeSun"],
                    message: "Close time is required when Sunday is open",
                    code: "custom",
                });
            }
        }

    });;

    const form = useForm<{
        // address: string,
        state: string,
        zipCode: string,
        openAt: string,
        closeAt: string,
        status: Status,
        images: FileWithPath[]
        phone: string,
        addressLine1: string,
        addressLine2: string,
        fax: string,
        city: string,
        isOpenMon: boolean,
        openTimeMon: string,
        closeTimeMon: string,

        isOpenTue: boolean,
        openTimeTue: string,
        closeTimeTue: string,

        isOpenWed: boolean,
        openTimeWed: string,
        closeTimeWed: string,

        isOpenThu: boolean,
        openTimeThu: string,
        closeTimeThu: string,

        isOpenFri: boolean,
        openTimeFri: string,
        closeTimeFri: string,

        isOpenSat: boolean,
        openTimeSat: string,
        closeTimeSat: string,

        isOpenSun: boolean,
        openTimeSun: string,
        closeTimeSun: string,

        latitude: number | undefined,
        longitude: number | undefined,

    }>({
        mode: 'uncontrolled',
        initialValues: {
            // address: '',
            state: '',
            zipCode: '',
            openAt: '',
            closeAt: '',
            status: Status.Deactive,
            images: [],
            phone: '',

            addressLine1: '',
            addressLine2: '',
            fax: '',
            city: '',
            // isOpenMon: false,
            // openTimeMon: '',
            // closeTimeMon: '',

            // isOpenTue: false,
            // openTimeTue: '',
            // closeTimeTue: '',

            // isOpenWed: false,
            // openTimeWed: '',
            // closeTimeWed: '',

            // isOpenThu: false,
            // openTimeThu: '',
            // closeTimeThu: '',

            // isOpenFri: false,
            // openTimeFri: '',
            // closeTimeFri: '',

            // isOpenSat: false,
            // openTimeSat: '',
            // closeTimeSat: '',

            // isOpenSun: false,
            // openTimeSun: '',
            // closeTimeSun: '',

            isOpenMon: true,
            openTimeMon: '09:00',
            closeTimeMon: '17:00',

            isOpenTue: true,
            openTimeTue: '09:00',
            closeTimeTue: '17:00',

            isOpenWed: true,
            openTimeWed: '09:00',
            closeTimeWed: '17:00',

            isOpenThu: true,
            openTimeThu: '09:00',
            closeTimeThu: '17:00',

            isOpenFri: true,
            openTimeFri: '09:00',
            closeTimeFri: '17:00',

            isOpenSat: true,
            openTimeSat: '09:00',
            closeTimeSat: '17:00',

            isOpenSun: true,
            openTimeSun: '09:00',
            closeTimeSun: '17:00',

            latitude: undefined,
            longitude: undefined
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
                    // name: form.getValues().address,
                    name: (form.getValues().addressLine1 ?? '') + (form.getValues().addressLine2 ?? '') + (form.getValues().city ?? ''),
                    address: (form.getValues().addressLine1 ?? '') + (form.getValues().addressLine2 ?? '') + (form.getValues().city ?? ''),
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
                    addressLine1: form.getValues().addressLine1,
                    addressLine2: form.getValues().addressLine2,
                    city: form.getValues().city,
                    fax: form.getValues().fax,
                    isOpenMon: form.getValues().isOpenMon,
                    openTimeMon: form.getValues().openTimeMon,
                    closeTimeMon: form.getValues().closeTimeMon,

                    isOpenTue: form.getValues().isOpenTue,
                    openTimeTue: form.getValues().openTimeTue,
                    closeTimeTue: form.getValues().closeTimeTue,

                    isOpenWed: form.getValues().isOpenWed,
                    openTimeWed: form.getValues().openTimeWed,
                    closeTimeWed: form.getValues().closeTimeWed,

                    isOpenThu: form.getValues().isOpenThu,
                    openTimeThu: form.getValues().openTimeThu,
                    closeTimeThu: form.getValues().closeTimeThu,

                    isOpenFri: form.getValues().isOpenFri,
                    openTimeFri: form.getValues().openTimeFri,
                    closeTimeFri: form.getValues().closeTimeFri,

                    isOpenSat: form.getValues().isOpenSat,
                    openTimeSat: form.getValues().openTimeSat,
                    closeTimeSat: form.getValues().closeTimeSat,

                    isOpenSun: form.getValues().isOpenSun,
                    openTimeSun: form.getValues().openTimeSun,
                    closeTimeSun: form.getValues().closeTimeSun,
                    latitude: Number(form.getValues().latitude) ?? 0,
                    longitude: Number(form.getValues().longitude) ?? 0,
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
    // const [allZipCodes, setAllZipCodes] = useState<string[]>([]);
    useEffect(() => {
        // getData();
    }, []);

    useEffect(() => {
        if (opened) {
            form.reset();
            getData();
        }
    }, [opened]);

    const getData = async () => {
        const _geos = await getGeoRef();
        setGeos(_geos);
        const _states: string[] = [];
        // const _zips: string[] = [];
        _geos.map((geo) => {
            _states.push(geo.steName);
            // _zips.push(geo.zipCode);
        });
        const uniqueStates = [...new Set(_states)];
        setStates(uniqueStates);
        // setAllZipCodes(_zips);
    }

    const onChangeStates = (stateName: string) => {
        form.setFieldValue('state', stateName);
        console.log(stateName);
        console.log(geos);
        const geoFilter = geos.filter((geo) => geo.steName == stateName);

        const _zipCodes: string[] = [];
        geoFilter.map((geo) => {
            _zipCodes.push(geo.zipCode);
        });
        const uniqueZipCodes = [...new Set(_zipCodes)];
        setZipCodes(uniqueZipCodes);

    }

    return (<Modal opened={opened} onClose={() => { }} size="2xl" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Create new location </Title>
        <Grid grow>
            <Grid.Col span={6}>
                <Grid grow>
                    <Grid.Col span={12} >
                        <TextInput
                            label="Address Line 1"
                            placeholder="Enter address line 1"
                            withAsterisk
                            key={form.key('addressLine1')}
                            {...form.getInputProps('addressLine1')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12} >
                        <TextInput
                            label="Address Line 2"
                            placeholder="Enter address line 2"

                            key={form.key('addressLine2')}
                            {...form.getInputProps('addressLine2')}
                        />
                    </Grid.Col>
                    <Grid.Col span={4} >
                        <TextInput
                            label="City"
                            placeholder="Enter city"
                            withAsterisk
                            key={form.key('city')}
                            {...form.getInputProps('city')}
                        />
                    </Grid.Col>
                    <Grid.Col span={4} >
                        <Select
                            label="State"
                            placeholder="State"
                            data={states}
                            withAsterisk
                            searchable
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
                            withAsterisk
                            key={form.key('zipCode')}
                            {...form.getInputProps('zipCode')}
                            searchable
                        />
                    </Grid.Col>
                    <Grid.Col span={6} >
                        <TextInput
                            label="Phone"
                            placeholder="Enter phone"
                            key={form.key('phone')}
                            {...form.getInputProps('phone')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6} >
                        <TextInput
                            label="Fax"
                            placeholder="Enter fax"
                            key={form.key('fax')}
                            {...form.getInputProps('fax')}
                        />
                    </Grid.Col>

                    <Grid.Col span={6} className="flex flex-col" >
                        <Link to="https://www.latlong.net/convert-address-to-lat-long.html" target="blank" className="text-sm leading-[21.7px] text-blue-500">Latitude <label className="text-red-500">*</label>
                        </Link>
                        <TextInput
                            placeholder="Latitude"
                            withAsterisk
                            key={form.key('latitude')}
                            {...form.getInputProps('latitude')}
                        />
                        {/* <TextInput
                    label="Zip code"
                    placeholder="Zip code"
                    withAsterisk
                    key={form.key('zipCode')}
                    {...form.getInputProps('zipCode')}
                /> */}
                        {/* <MultiSelect
                    multiple
                    searchable
                    label="User can search at zipCode"
                    placeholder="User can search at zipCode"
                    limit={20}
                    data={allZipCodes}
                /> */}
                    </Grid.Col>
                    <Grid.Col span={6} className="flex flex-col" >
                        <Link to="https://www.latlong.net/convert-address-to-lat-long.html" target="blank" className="text-sm leading-[21.7px] text-blue-500" >Longitude <label className="text-red-500">*</label></Link>
                        <TextInput
                            placeholder="Longitude"
                            withAsterisk
                            key={form.key('longitude')}
                            {...form.getInputProps('longitude')}
                        />
                    </Grid.Col>
                </Grid>
            </Grid.Col>

            <Grid.Col span={6}>
                <Grid grow>
                    <Grid.Col span={12} className="flex flex-row h-4">
                        <Title order={4}>Open time</Title><Text className="text-red">*</Text>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Grid grow>
                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Monday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"

                                        key={form.key('isOpenMon')}
                                        {...form.getInputProps('isOpenMon')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeMon')}
                                        {...form.getInputProps('openTimeMon')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeMon')}
                                        {...form.getInputProps('closeTimeMon')}
                                    />
                                </Container>
                            </Grid.Col>

                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Tuesday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"

                                        key={form.key('isOpenTue')}
                                        {...form.getInputProps('isOpenTue')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeTue')}
                                        {...form.getInputProps('openTimeTue')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeTue')}
                                        {...form.getInputProps('closeTimeTue')}
                                    />
                                </Container>
                            </Grid.Col>

                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Wednesday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"

                                        key={form.key('isOpenWed')}
                                        {...form.getInputProps('isOpenWed')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeWed')}
                                        {...form.getInputProps('openTimeWed')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeWed')}
                                        {...form.getInputProps('closeTimeWed')}
                                    />
                                </Container>
                            </Grid.Col>

                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Thursday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"
                                        key={form.key('isOpenThu')}
                                        {...form.getInputProps('isOpenThu')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeThu')}
                                        {...form.getInputProps('openTimeThu')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeThu')}
                                        {...form.getInputProps('closeTimeThu')}
                                    />
                                </Container>
                            </Grid.Col>


                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Friday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"
                                        key={form.key('isOpenFri')}
                                        {...form.getInputProps('isOpenFri')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeFri')}
                                        {...form.getInputProps('openTimeFri')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeFri')}
                                        {...form.getInputProps('closeTimeFri')}
                                    />
                                </Container>
                            </Grid.Col>


                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Saturday</Text>
                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"
                                        key={form.key('isOpenSat')}
                                        {...form.getInputProps('isOpenSat')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeSat')}
                                        {...form.getInputProps('openTimeSat')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeSat')}
                                        {...form.getInputProps('closeTimeSat')}
                                    />
                                </Container>
                            </Grid.Col>

                            <Grid.Col span={12} className="px-2 flex flex-row items-center justify-between">
                                <Text className="px-2 w-[94px]">Sunday</Text>

                                <Container className="flex flex-1 items-center flex-row">
                                    <Checkbox
                                        className="pr-2"
                                        key={form.key('isOpenSun')}
                                        {...form.getInputProps('isOpenSun')}
                                    />
                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('openTimeSun')}
                                        {...form.getInputProps('openTimeSun')}
                                    />

                                    <Text className="px-2"> ~ </Text>

                                    <TimeInput
                                        style={{ width: '100%' }}

                                        key={form.key('closeTimeSun')}
                                        {...form.getInputProps('closeTimeSun')}
                                    />
                                </Container>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Grid grow>
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
                    </Grid.Col>
                </Grid>
            </Grid.Col>





        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal >
    )
}
export default CreateAddressPage;