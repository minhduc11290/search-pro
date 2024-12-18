import { ActionIcon, Button, Container, Pagination, rem, TextInput, Text, Title, Image, Select, ComboboxItem } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from 'react';
import { Table, Tooltip, Switch } from '@mantine/core';
import cx from 'clsx';
import classes from './product-list.module.css';
import { Header } from "../../components/header";
import { IconSearch, IconPlus, IconEdit, IconCheck, IconX } from "@tabler/icons-react";

import { modals } from '@mantine/modals';
import EditProductPage from "./components/edit"
import CreateProductPage from "./components/create";
import { Status } from "../../@types/enum/status";
import { Product } from "../../@types/product-props";
import ListLocationPage from "./components/list-location";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../@types/store-props";
import useStoreProducts from "../../hooks/store-products";
import { PAGINATION } from "../../constants/pagination";
import useStoreLocations from "../../hooks/store-locations";
import { notifications } from "@mantine/notifications";
const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state.id;
    console.log("storeId", storeId);
    const [data, setData] = useState<Product[]>([]);
    const [dataFiltered, setDataFiltered] = useState<Product[]>([]);
    const [dataDisplay, setDataDisplay] = useState<Product[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { getStoreLocations } = useStoreLocations();
    const [storeInfo, setStoreInfo] = useState<Store | null>(null);

    const [locations, setLocations] = useState<ComboboxItem[]>([]);

    const [search, setSearch] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showList, setShowList] = useState(false);

    const [productSelected, setProductSelected] = useState<Product>({
        id: '',
        no: 0,
        SKU: '',
        productName: '',
        keysword: [],
        description: '',
        locationInfo: [],
        image: '',
        attachments: [],
        status: Status.Deactive
    });

    const { isLoading, getStoreProducts, getStoreInfoById, updateProduct } = useStoreProducts();
    const getData = async () => {
        const stores = await getStoreInfoById(storeId);
        setStoreInfo(stores);
        const products = await getStoreProducts(storeId);
        setData(products);
        setDataFiltered(products);


    }



    useEffect(() => {
        // setData([{

        getData();
        _getStoreLocations();
    }, []);

    const _getStoreLocations = async () => {
        const _locations = await getStoreLocations(storeId);
        if (Array.isArray(_locations)) {
            const _locationData: ComboboxItem[] = _locations.map(location => {
                return {
                    value: location.locationID,
                    label: location.address
                }
            });
            setLocations(_locationData);
        }
    }


    useEffect(() => {
        if (dataFiltered && dataFiltered.length > 0) {

            // console.log("start", start);
            // console.log("end", start + PAGINATION.ITEMPERPAGE - 1);
            setTotalPage(Math.ceil(dataFiltered.length / PAGINATION.ITEMPERPAGE));
            getDataDisplay();

        } else {
            setDataDisplay([]);
        }
    }, [dataFiltered]);

    const getDataDisplay = () => {
        if (dataFiltered && dataFiltered.length > 0) {
            const start = (currentPage - 1) * PAGINATION.ITEMPERPAGE;

            const end = dataFiltered.length > (start + PAGINATION.ITEMPERPAGE) ? start + PAGINATION.ITEMPERPAGE : dataFiltered.length;
            const _data = [...dataFiltered];
            setDataDisplay(_data.slice(start, end));
        }
    }

    // const [scrolled, setScrolled] = useState(false);

    const moveToEdit = (product: Product) => {
        setShowEdit(true);
        setProductSelected(product);
    }
    const rows = dataDisplay.map((row) => (
        <Table.Tr key={row.no}>
            <Table.Td>{row.no}</Table.Td>
            <Table.Td>{row.SKU}</Table.Td>
            <Table.Td>{row.productName}</Table.Td>
            <Table.Td>{row.keysword.join(",")}</Table.Td>
            <Table.Td>{row.description}</Table.Td>
            <Table.Td><a className="text-blue-500 cursor-pointer" onClick={(event) => {
                event.preventDefault();
                console.log("row", row);
                setProductSelected(row);
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
                        <Switch checked={row.status == Status.Active} onChange={async (event) => {
                            const title = row.status == Status.Active ? 'Deactive account' : 'Active account';
                            const checked = event.currentTarget.checked;
                            openModal(title, async () => {
                                row.status = (checked ? Status.Active : Status.Deactive);
                                setData([...data]);

                                const { result, errorMessage } = await updateProduct(row.id!, {
                                    isActive: checked,
                                });
                                if (result) {
                                    notifications.show({
                                        title: `Success`,
                                        message: `Product have been updated successfully`,
                                        color: 'teal',
                                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                        position: 'top-right'
                                    });
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
        const dataFilter = data.filter(function (el) {
            return el.SKU.includes(value)
                || el.description.includes(value)
                || el.keysword.join(",").includes(value);
        });

        setDataFiltered(dataFilter);
    };

    const hideEdit = (isReload: boolean) => {
        if (isReload) {
            getData();
        }
        setShowEdit(false)
    }

    const hideCreate = (isReload: boolean) => {
        if (isReload) {
            getData();
        }
        setShowCreate(false)
    }

    const hideList = () => {
        setShowList(false)
    }

    return <AuthLayout currentLink={PATH.STOREMANAGEMENT} isLoading={isLoading} >
        <Header title="Product list" isBack={true} onBackPress={() => {
            navigate(PATH.STOREMANAGEMENT)
        }}></Header>
        <div className="py-2 px-6 flex flex-row items-center">
            <Title order={4} className="text-base"> Owner's Store </Title>
            <Text className="px-4 text-base">{storeInfo?.ownerstore}</Text>
            <Title order={5} className="text-base"> Username </Title>
            <Text className="px-4">{storeInfo?.email}</Text>
            <Title order={5} className="text-base"> Status </Title>
            <Text className="px-4">{storeInfo?.status == Status.Active ? 'Active' : 'Deactive'}</Text>
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

                        {/* <Button leftSection={<IconDownload size={14} />} variant="default" className="ml-2" size="sm"

                            onClick={() => {

                            }} >Import excel file</Button> */}
                        <Button leftSection={<IconPlus size={14} />} variant="filled" className="ml-2" size="sm" onClick={() => {
                            setShowCreate(true);
                        }} >Add new product</Button>
                    </Container>
                </div>
                <div>
                    {/* <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}> */}
                    <Table miw={700} className={classes.table} withTableBorder={true}>
                        <Table.Thead className={cx(classes.header)}>
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
                    {/* </ScrollArea> */}
                </div>
                <Container fluid className="mx-0 px-0 flex flex-row-reverse py-2">
                    <Pagination value={currentPage} total={totalPage} onChange={setCurrentPage} />
                </Container>
            </div>
        </Container>
        <CreateProductPage opened={showCreate} close={hideCreate} ></CreateProductPage>
        <EditProductPage opened={showEdit} productInfo={productSelected} close={hideEdit}></EditProductPage>
        <ListLocationPage opened={showList} close={hideList} locationPrice={productSelected.locationInfo} ></ListLocationPage>
    </AuthLayout>

}

export default ProductsPage;