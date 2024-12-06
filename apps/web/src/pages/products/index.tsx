import { ActionIcon, Button, Container, Pagination, rem, TextInput, Text, Title, Image, Select, ComboboxItem } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Tooltip, Switch } from '@mantine/core';
import cx from 'clsx';
import classes from './product-list.module.css';
import { Header } from "../../components/header";
import { IconSearch, IconDownload, IconPlus, IconEdit } from "@tabler/icons-react";

import { modals } from '@mantine/modals';
import EditProductPage from "./components/edit"
import CreateProductPage from "./components/create";
import { Status } from "../../@types/enum/status";
import { Product } from "../../@types/product-props";
import ListLocationPage from "./components/list-location";
import { useNavigate } from "react-router-dom";
const ProductsPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<Product[]>([]);
    const [locations, setLocations] = useState<ComboboxItem[]>([]);

    const [search, setSearch] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showList, setShowList] = useState(false);

    const [productSelected, setProductSelected] = useState<Product>({
        no: 0,
        SKU: '',
        productName: '',
        keysword: '',
        description: '',
        locationInfo: [],
        image: '',
        status: Status.Deactive
    });

    useEffect(() => {
        setData([{
            no: 1,
            SKU: 'pr001',
            productName: 'Whiskey',
            keysword: 'whis, wskey',
            description: '91 ELM ST MANCHESTER CT 06040-8610 USA',
            locationInfo: [{
                locationID: 'store001',
                address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
                state: 'NJ',
                zipCode: '08234',
                price: "0",
            }, {
                locationID: 'store002',
                address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
                state: 'NJ',
                zipCode: '08234',
                price: "0",
            }],
            image: 'https://res.cloudinary.com/dbibqov2j/image/upload/v1726197092/foods/monle_1726197090.jpg',
            status: Status.Active
        }, {
            no: 2,
            SKU: 'pr001',
            productName: 'Whiskey',
            keysword: 'whis, wskey',
            description: '91 ELM ST MANCHESTER CT 06040-8610 USA',
            locationInfo: [{
                locationID: 'store001',
                address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
                state: 'NJ',
                zipCode: '08234',
                price: "0",
            }, {
                locationID: 'store002',
                address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
                state: 'NJ',
                zipCode: '08234',
                price: "0",
            }],
            image: 'https://res.cloudinary.com/dbibqov2j/image/upload/v1726197092/foods/monle_1726197090.jpg',
            status: Status.Active
        },]);

        setLocations([{
            value: "1",
            label: 'store001'
        }, {
            value: "2",
            label: 'store002'
        }])
    }, []);

    const [scrolled, setScrolled] = useState(false);

    const moveToEdit = (product: Product) => {
        setShowEdit(true);
        setProductSelected(product);
    }
    const rows = data.map((row) => (
        <Table.Tr key={row.no}>
            <Table.Td>{row.no}</Table.Td>
            <Table.Td>{row.SKU}</Table.Td>
            <Table.Td>{row.productName}</Table.Td>
            <Table.Td>{row.keysword}</Table.Td>
            <Table.Td>{row.description}</Table.Td>
            <Table.Td><a className="text-blue-500 cursor-pointer" onClick={(event) => {
                event.preventDefault();
                setShowList(true);
            }}>Show location list</a></Table.Td>
            <Table.Td><Image
                fit="contain"
                h={28}
                radius="md"
                src={row.image} ></Image></Table.Td>
            <Table.Td>
                <Container className="flex flex-row items-center">
                    <Tooltip label={row.status == Status.Active ? 'Deactive location' : 'Active account'} refProp="rootRef">
                        <Switch checked={row.status == Status.Active} onChange={(event) => {
                            const title = row.status == Status.Active ? 'Deactive account' : 'Active account';
                            const checked = event.currentTarget.checked;
                            openModal(title, () => {
                                row.status = (checked ? Status.Active : Status.Deactive);
                                setData([...data]);
                            });

                        }} />
                    </Tooltip>
                    <ActionIcon variant="transparent" aria-label="Settings" className="mx-1" size="sm" onClick={() => moveToEdit(row)}>
                        <IconEdit style={{ width: '100%', height: '100%' }} stroke={1.5} />
                    </ActionIcon>
                </Container>
            </Table.Td>
        </Table.Tr>
    ));

    const openModal = (title: string, onOk: () => void) => modals.openConfirmModal({
        title: title,
        children: (
            <>
                <Text size="sm">
                    Please confirm before proceed
                </Text>
                <Text size="sm">
                    Do you want to continue?
                </Text>
            </>
        ),
        labels: { confirm: 'Yes', cancel: 'Cancel' },
        onCancel: () => { },
        onConfirm: onOk,
        centered: true,
        withCloseButton: false,

    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);

    };

    const hideEdit = () => {
        setShowEdit(false)
    }

    const hideCreate = () => {
        setShowCreate(false)
    }

    const hideList = () => {
        setShowList(false)
    }

    return <AuthLayout currentLink={PATH.STOREMANAGEMENT} >
        <Header title="Location list" isBack={true} onBackPress={() => {
            navigate(PATH.STOREMANAGEMENT)
        }}></Header>
        <div className="py-2 px-6 flex flex-row items-center">
            <Title order={4} className="text-base"> Owner's Store </Title>
            <Text className="px-4 text-base">Brian Huynh</Text>
            <Title order={5} className="text-base"> Username </Title>
            <Text className="px-4">Brian Huynh</Text>
            <Title order={5} className="text-base"> Status </Title>
            <Text className="px-4">Active</Text>
        </div>
        <Container fluid className="flex flex-1 mx-2">
            <div className="flex flex-1 flex-col justify-start">
                <div className="py-2 flex justify-between flex-row">
                    <Container className="w-5/12 flex-row items-center flex-grow justify-end  mr-0 px-0">
                        <TextInput
                            style={{ width: '100%' }}
                            placeholder="Search by any field"
                            rightSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Container>

                    <Container className="flex flex-nowrap flex-row items-center flex-grow justify-end ml-2 mr-0 px-0">
                        {/* <Text className="font-bold w-10">Location</Text> */}
                        {/* <Select
                            className="w-32"
                            placeholder="Location"
                            data={locations}
                        /> */}

                        {/* <Text className="font-bold w-10">Location</Text>
                        <Container>
                        <Select
                            className="w-32"
                            placeholder="Location"
                            data={locations}
                        />
                        </Container> */}
                        <Text className="font-bold pr-2">Location</Text>
                        <Select
                            className="w-32"
                            placeholder="Location"
                            data={locations}
                        />
                        <Button variant="default" className="ml-2" size="sm" onClick={() => {

                        }} >Apply</Button>

                        <Button leftSection={<IconDownload size={14} />} variant="default" className="ml-2" size="sm"

                            onClick={() => {

                            }} >Import excel file</Button>
                        <Button leftSection={<IconPlus size={14} />} variant="filled" className="ml-2" size="sm" onClick={() => {
                            setShowCreate(true);
                        }} >Add new product</Button>
                    </Container>
                </div>
                <div>
                    <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700} className={classes.table} withTableBorder={true}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>No</Table.Th>
                                    <Table.Th>SKU</Table.Th>
                                    <Table.Th>Product name</Table.Th>
                                    <Table.Th>Keysword</Table.Th>
                                    <Table.Th>Description</Table.Th>
                                    <Table.Th>Location</Table.Th>
                                    <Table.Th>Image</Table.Th>
                                    <Table.Th>Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <Container fluid className="mx-0 px-0 flex flex-row-reverse py-2">
                    <Pagination total={2} />
                </Container>
            </div>
        </Container>
        <CreateProductPage opened={showCreate} close={hideCreate} ></CreateProductPage>
        <EditProductPage opened={showEdit} productInfo={productSelected} close={hideEdit}></EditProductPage>
        <ListLocationPage opened={showList} close={hideList} ></ListLocationPage>
    </AuthLayout>

}

export default ProductsPage;