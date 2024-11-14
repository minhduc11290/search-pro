import { Modal, Text, Group, TextInput, Grid, Title, Button, Switch, Container, Select, TagsInput, ScrollArea, Table, ComboboxItem, rem, Image, ActionIcon } from "@mantine/core";
import { CreateStoreProps } from "../../../@types/create-store-props";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Status } from "../../../@types/enum/status";
import classes from '../product-list.module.css';
import { useEffect, useState } from "react";
import cx from 'clsx';
import { IconPlus, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { LocationPrice } from "../../../@types/product-props";

const CreateProductPage = ({ opened, close }: CreateStoreProps) => {
    const schema = z.object({
        sku: z
            .string().trim()
            .min(1, { message: 'Required information' }),
        name: z.string().trim().min(1, { message: 'Required information' }),
        description: z.string().trim().min(1, { message: 'Required information' }),
        keywords: z.string().array().min(0, { message: 'Required information' }),
        locations: z.object({
            location: z
                .string(),
            price: z.number(),
        }).array(),

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

    const [locations, setLocations] = useState<ComboboxItem[]>([]);
    useEffect(() => {
        setLocations([{
            value: "1",
            label: 'store001',

        }, {
            value: "2",
            label: 'store002'
        }])
    }, [])
    const [scrolled, setScrolled] = useState(false);
    return (<Modal opened={opened} onClose={() => { }} size="lg" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Create new product </Title>
        <Grid grow>
            <Grid.Col span={6} >
                <TextInput
                    label="SKU"
                    placeholder="Enter SKU"
                    withAsterisk
                    key={form.key('sku')}
                    {...form.getInputProps('sku')}
                />
            </Grid.Col>
            <Grid.Col span={6} >
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    withAsterisk
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
            </Grid.Col>

            <Grid.Col span={12} >
                <TextInput
                    label="Description"
                    placeholder="Enter description"
                    withAsterisk
                    key={form.key('description')}
                    {...form.getInputProps('description')}
                />
            </Grid.Col>

            <Grid.Col span={12} >
                <TagsInput
                    label="Keyword"
                    placeholder="Enter keyword"
                    withAsterisk
                    key={form.key('keywords')}
                    {...form.getInputProps('keywords')}
                />
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row pb-0">
                <Text className="text-sm font-semibold">Select location</Text><Text className="ml-1 text-red-500">*</Text>
            </Grid.Col>
            <Grid.Col span={12} className="flex flex-row pt-0">
                <ScrollArea style={{ width: '100%' }} mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    <Table className={classes.table} withTableBorder={true}>
                        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                            <Table.Tr>
                                <Table.Th>Location ID</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>State/Zip</Table.Th>
                                <Table.Th>Product price</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                form.getValues().locations.map((locationProduct, index) => {
                                    return (
                                        <Table.Tr>
                                            <Table.Td>
                                                <Select
                                                    className="w-32"
                                                    placeholder="Location"
                                                    data={locations}
                                                    key={form.key(`locations.${index}.location`)}
                                                    {...form.getInputProps(`locations.${index}.location`)}
                                                    onChange={() => {
                                                        // ToDo:
                                                        form.setFieldValue(`locations.${index}.address`, "91 ELM ST MANCHESTER CT 06040-8610 USA");
                                                        form.setFieldValue(`locations.${index}.state`, "NJ 08234");
                                                    }}
                                                />
                                            </Table.Td>
                                            <Table.Td>
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
                                            </Table.Td>
                                            <Table.Th>
                                                <TextInput
                                                    placeholder="Enter price"
                                                    withAsterisk
                                                    key={form.key(`locations.${index}.price`)}
                                                    {...form.getInputProps(`locations.${index}.price`)}
                                                />
                                            </Table.Th>
                                        </Table.Tr>);
                                })
                            }
                        </Table.Tbody>
                        <Table.Tbody className={classes.footer}>
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    <Button leftSection={<IconPlus size={14} />} variant="transparent" className="ml-2" size="sm" onClick={() => {

                                        form.insertListItem('locations', {
                                            locationID: '',
                                            address: '',
                                            state: '',
                                            zipCode: '',
                                            price: 0,
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
            <Grid.Col span={12} className="flex flex-row pb-0">
                <Text className="text-sm font-semibold">Images</Text><Text className="ml-1 text-red-500">*</Text>
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

                        const _files = form.getValues().images;
                        form.setFieldValue('images', [..._files, ...files]);
                    }}
                    onReject={(files) => console.log('rejected files', files)}
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
            <Button variant="default" onClick={close}>Close</Button>
            <Button onClick={() => {
                const result = form.validate();
                if (!result.hasErrors) {
                    console.log("data", form.getValues())
                    close();
                }
            }}>Save</Button>
        </Group>

    </Modal >
    )
}
export default CreateProductPage;