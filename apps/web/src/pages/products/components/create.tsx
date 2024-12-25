import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Container, Select, TagsInput, ScrollArea, Table, ComboboxItem, rem, Image, ActionIcon, Textarea } from "@mantine/core";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Status } from "../../../@types/enum/status";
import classes from '../product-list.module.css';
import { useEffect, useState } from "react";
import cx from 'clsx';
import { IconCheck, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { LocationPrice } from "../../../@types/product-props";
import { CreateProductProps } from "../../../@types/create-product-props";
import useStoreLocations from "../../../hooks/store-locations";
import { useLocation } from "react-router-dom";
import { LocationInfo } from "../../../@types/location-props";
import useStoreProducts from "../../../hooks/store-products";
import { FileInfo } from "../../../@types/file-info";
import { notifications } from "@mantine/notifications";

const CreateProductPage = ({ opened, close }: CreateProductProps) => {

    const location = useLocation();
    const storeId = location.state.id;
    const locationSchema = z.object({
        location: z
            .string().min(1, { message: 'Required information' }),
        price: z.preprocess(
            (value) => (typeof value === 'string' && value ? Number(value) : value),
            z.number().min(0, { message: 'Price must be a positive number' })
        ), // z.number(),
    });

    const schema = z.object({
        sku: z
            .string(),
        name: z.string().trim().min(1, { message: 'Required information' }),
        // description: z.string().trim().min(1, { message: 'Required information' }),
        description: z.string().max(1000, { message: 'Only 1000 character' }),
        keywords: z.string().array(), //.min(0, { message: 'Required information' }),
        // locations: z.object({
        //     location: z
        //         .string().min(1, { message: 'Required information' }),
        //     price: z.preprocess(
        //         (value) => (typeof value === 'string' && value ? Number(value) : value),
        //         z.number().min(0, { message: 'Price must be a positive number' })
        //     ), // z.number(),
        // }).array().min(1, { message: 'Required information' }),
        locations: z
            .array(locationSchema).min(1, { message: 'Required information' }).superRefine((arr, ctx) => {
                const seen = new Map(); // Track seen IDs with their indices
                console.log("array", arr);
                for (let i = 0; i < arr.length; i++) {
                    const obj = arr[i];
                    console.log("object", obj);
                    if (seen.has(obj.location)) {
                        console.log("vo day loi", obj);
                        // Add an issue pointing to the duplicate's index
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Duplicate location`,
                            path: [i, "location"], // Point to the current duplicate's index
                        });
                        // form.setFieldError(`locations.${i}.location`, `Duplicate location`);
                        // return; // Stop on the first duplicate
                    }
                    seen.set(obj.location, obj);


                }
            })
    });



    const form = useForm<{
        sku: string,
        name: string,
        description: string,
        keywords: string[],
        locations: LocationPrice[],
        status: Status,
        images: FileWithPath[]
    }>({
        mode: 'uncontrolled',
        initialValues: {
            sku: '',
            name: '',
            description: '',
            keywords: [],
            locations: [],
            images: [],
            status: Status.Deactive
        },
        validate: zodResolver(schema),

    });

    const { getStoreLocations } = useStoreLocations();
    const { createProduct, uploadFile } = useStoreProducts();
    const [locations, setLocations] = useState<ComboboxItem[]>([]);
    const [locationsDB, setLocationsDB] = useState<LocationInfo[]>([]);

    useEffect(() => {
        // setLocations([{
        //     value: "1",
        //     label: 'store001',

        // }, {
        //     value: "2",
        //     label: 'store002'
        // }])

        init();
    }, [])

    useEffect(() => {
        if (opened) {
            form.reset();
        }
    }, [opened])

    const init = async () => {
        const _locations = await getStoreLocations(storeId);
        setLocationsDB(_locations);
        if (Array.isArray(_locations)) {
            const _locationData: ComboboxItem[] = _locations.map(location => {
                return {
                    value: location.locationID,
                    label: location.address + " (" + location.state + " " + location.zipCode + ")"
                }
            });
            setLocations(_locationData);
        }

    }
    const [scrolled, setScrolled] = useState(false);

    console.log("errors", form.errors);

    const handleSubmit = async () => {
        console.log("data", form.getValues());
        console.log("errors", form.errors);
        const formData = form.validate();
        console.log("errors", form.errors);

        if (!formData.hasErrors) {
            let images: FileInfo[] = [];
            if (form.getValues().images) {
                const { data } = await uploadFile(form.getValues().images);

                images = [...data];
            }
            // 

            const { result, errorMessage, statusCode } = await createProduct(storeId, {
                sku: form.getValues().sku,
                name: form.getValues().name,
                keywords: form.getValues().keywords,
                description: form.getValues().description,
                productLocations: form.getValues().locations.map((location) => {
                    console.log("location", location);
                    return {
                        locationId: location.locationID,
                        price: location.price
                    };
                }),
                attachments: images.map((image) => {
                    return {
                        name: image.fileName,
                        url: image.fileName,
                    }
                }),
                isActive: form.getValues().status == Status.Active
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
                if (statusCode != 409) {
                    notifications.show({
                        title: `Error`,
                        message: errorMessage,
                        color: 'red',
                        icon: <IconX />,
                        position: 'top-right'
                    });
                } else {
                    form.setFieldValue('sku', errorMessage);
                }
            }


            // create Product

            // close();
        }
    }

    return (<Modal opened={opened} onClose={() => { }} size="xl" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Create new product </Title>
        <Grid grow>

            <Grid.Col span={12} >
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    withAsterisk
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
            </Grid.Col>

            <Grid.Col span={12} >
                <Textarea
                    label="Description (1000 characters)"
                    placeholder="Enter description"
                    key={form.key('description')}
                    {...form.getInputProps('description')}
                    autosize
                    minRows={4}
                    maxRows={4}
                    maxLength={1000}
                />
            </Grid.Col>

            <Grid.Col span={12} >
                <TagsInput
                    label="Keyword"
                    placeholder="Enter keyword"
                    key={form.key('keywords')}
                    {...form.getInputProps('keywords')}
                />
            </Grid.Col>
            <Grid.Col span={12} >
                <TextInput
                    label="SKU"
                    placeholder="Enter SKU"

                    key={form.key('sku')}
                    {...form.getInputProps('sku')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row pb-0">
                <Text className="text-sm font-semibold">Select location</Text>
                {/* <Text className="ml-1 text-red-500">*</Text> */}
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row pt-0">
                <ScrollArea style={{ width: '100%' }} mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    <Table className={classes.table} withTableBorder={true}>
                        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                            <Table.Tr>
                                <Table.Th style={{ width: '70%' }}>Location ID</Table.Th>
                                {/* <Table.Th>Address</Table.Th>
                                <Table.Th>State/Zip</Table.Th> */}
                                <Table.Th>Product price</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                form.getValues().locations.map((item, index) => {
                                    return (
                                        <Table.Tr key={`${item.id ?? ""}_${item.locationID ?? ""}_location_${index}`}>
                                            <Table.Td>
                                                <Select
                                                    className="w-full"
                                                    placeholder="Location"
                                                    data={locations}
                                                    key={form.key(`locations.${index}.location`)}
                                                    {...form.getInputProps(`locations.${index}.location`)}
                                                    onChange={(_, option) => {
                                                        // ToDo:
                                                        // form.setFieldValue(`locations.${index}.address`, "91 ELM ST MANCHESTER CT 06040-8610 USA");
                                                        // form.setFieldValue(`locations.${index}.state`, "NJ 08234");
                                                        console.log("locationsDB", locationsDB);
                                                        console.log("option.value", option.value);
                                                        const location = locationsDB.find(location => location.locationID == option.value);

                                                        if (location) {
                                                            form.setFieldValue(`locations.${index}.address`, location.address);
                                                            form.setFieldValue(`locations.${index}.state`, `${location.state} ${location.zipCode}`);
                                                            form.setFieldValue(`locations.${index}.locationID`, option.value);
                                                            form.setFieldValue(`locations.${index}.location`, option.value);
                                                        }

                                                    }}
                                                />
                                            </Table.Td>
                                            {/* <Table.Td>
                                                <TextInput
                                                    disabled
                                                    placeholder="Enter address"
                                                    withAsterisk
                                                    key={form.key(`locations.${index}.address`)}
                                                    {...form.getInputProps(`locations.${index}.address`)}

                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput
                                                    disabled
                                                    placeholder="Enter state"
                                                    withAsterisk
                                                    key={form.key(`locations.${index}.state`)}
                                                    {...form.getInputProps(`locations.${index}.state`)}
                                                />
                                            </Table.Td> */}
                                            <Table.Td>
                                                <TextInput
                                                    type="number"
                                                    placeholder="Enter price"
                                                    withAsterisk
                                                    key={form.key(`locations.${index}.price`)}
                                                    // {...form.getInputProps(`locations.${index}.price`)}
                                                    {...form.getInputProps(`locations.${index}.price`)}
                                                />
                                            </Table.Td>
                                            <Table.Td>
                                                <ActionIcon variant="transparent" aria-label="IconTrash" className="mx-1" size="sm" onClick={() => {
                                                    form.removeListItem("locations", index);
                                                }}>
                                                    <IconTrash style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>);
                                })
                            }
                        </Table.Tbody>
                        <Table.Tbody className={classes.footer}>
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    <Button leftSection={<IconPlus size={14} />} variant="transparent" className="ml-2" size="sm" onClick={() => {

                                        form.insertListItem('locations', {
                                            location: '',
                                            locationID: '',
                                            address: '',
                                            state: '',
                                            zipCode: '',
                                            price: '',
                                        });

                                        // setLocatio([...locations])
                                        // form.getValues().locations.push({
                                        //     locationID: '',
                                        //     address: '',
                                        //     state: '',
                                        //     zipCode: '',
                                        //     price: 0,
                                        // });
                                    }} >Add location</Button>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

            </Grid.Col>
            {
                form.errors.locations && <Grid.Col span={12} className="flex flex-row pt-0">
                    <Text className="text-xs text-red-500"> {form.errors.locations}</Text>
                </Grid.Col>

            }
            <Grid.Col span={12} className="flex flex-row pb-0">
                <Text className="text-sm font-semibold">Images</Text>
                {/* <Text className="ml-1 text-red-500">*</Text> */}
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
            <Grid.Col span={12} className="flex flex-row items-center">
                <Switch checked={form.getValues().status == Status.Active} onChange={(event) => {
                    form.setFieldValue('status', event.currentTarget.checked ? Status.Active : Status.Deactive)
                }} ></Switch>
                <Text className="ml-2 font-normal text-sm">Active/ Deactive location</Text>
            </Grid.Col>
        </Grid>

        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button onClick={handleSubmit}>Save</Button>
        </Group>

    </Modal >
    )
}
export default CreateProductPage;