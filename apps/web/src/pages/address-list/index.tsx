import { ActionIcon, Button, Container, Pagination, rem, TextInput, Text, Title } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Tooltip, Switch } from '@mantine/core';
import cx from 'clsx';
import classes from './address-list.module.css';
import { Header } from "../../components/header";
import { IconSearch, IconRefresh, IconPlus, IconEdit } from "@tabler/icons-react";

import { modals } from '@mantine/modals';
import EditAddressPage from "./components/edit"
import CreateAddressPage from "./components/create";
import { LocationInfo } from "../../@types/location-props";
import { Status } from "../../@types/enum/status";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useStoreLocations from "../../hooks/store-locations";
import { Store } from "../../@types/store-props";
import { PAGINATION } from "../../constants/pagination";
import { formatTime } from "../../utils/time";

const AddressListPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state.id;
    console.log("storeId", storeId);
    const [data, setData] = useState<LocationInfo[]>([]);
    const [dataFiltered, setDataFiltered] = useState<LocationInfo[]>([]);
    const [dataDisplay, setDataDisplay] = useState<LocationInfo[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [storeInfo, setStoreInfo] = useState<Store | null>(null);

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
        console.log("currentPage", currentPage);
        if (dataFiltered && dataFiltered.length > 0) {
            const start = (currentPage - 1) * PAGINATION.ITEMPERPAGE;

            const end = dataFiltered.length > (start + PAGINATION.ITEMPERPAGE) ? start + PAGINATION.ITEMPERPAGE : dataFiltered.length;
            const _data = [...dataFiltered];
            setDataDisplay(_data.slice(start, end));
        }
    }

    useEffect(() => {
        getDataDisplay();
    }, [currentPage, dataFiltered]);

    useEffect(() => {
        getData();
    }, [storeId]);

    const { isLoading, getStoreLocations, getStoreInfoById } = useStoreLocations();
    const getData = async () => {
        const stores = await getStoreInfoById(storeId);
        setStoreInfo(stores);
        const locations = await getStoreLocations(storeId);
        setData(locations);
        setDataFiltered(locations);
    }

    const [scrolled, setScrolled] = useState(false);

    const moveToEdit = (location: LocationInfo) => {
        setShowEdit(true);
        setLocationSelected(location);
    }
    const rows = dataDisplay.map((row, index) => (
        <Table.Tr key={row.no}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{row.locationID}</Table.Td>
            <Table.Td>{row.address}</Table.Td>
            <Table.Td>{row.state} {row.zipCode}</Table.Td>
            <Table.Td>{formatTime(row.openAt)} - {formatTime(row.closeAt)}</Table.Td>
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

    const [search, setSearch] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const [locationSelected, setLocationSelected] = useState<LocationInfo>({
        no: 0,
        locationID: '',
        address: '',
        state: '',
        zipCode: '',
        openAt: '',
        closeAt: '',
        status: Status.Deactive
    });


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);

        const dataFilter = data.filter(function (el) {
            return el.address.includes(value)
                || el.openAt.includes(value)
                || el.closeAt.includes(value) || el.locationID?.includes(value);
        });

        console.log("dataFilter", dataFilter);

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



    return <AuthLayout currentLink={PATH.STOREMANAGEMENT} isLoading={isLoading} >
        <Header title="Location list" isBack={true} onBackPress={() => {
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
                <div className="py-2 flex justify-between">
                    <TextInput
                        placeholder="Search by any field"
                        rightSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                        className="max-w-md"
                    />

                    <Container className="flex flex-row items-center flex-1 flex-grow justify-end mr-0 px-0">
                        <ActionIcon variant="filled" aria-label="Settings" size="lg" color="grey" onClick={() => {
                            getData();
                        }}>
                            <IconRefresh style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                        <Button leftSection={<IconPlus size={14} />} variant="filled" className="ml-2" size="sm" onClick={() => {
                            setShowCreate(true);
                        }} >Add new location</Button>
                    </Container>
                </div>
                <div>
                    <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700} className={classes.table} withTableBorder={true}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>No</Table.Th>
                                    <Table.Th>Location ID</Table.Th>
                                    <Table.Th>Address</Table.Th>
                                    <Table.Th>State/Zip</Table.Th>
                                    <Table.Th>Open time</Table.Th>
                                    <Table.Th>Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <Container fluid className="mx-0 px-0 flex flex-row-reverse py-2">
                    <Pagination value={currentPage} total={totalPage} onChange={setCurrentPage} />
                </Container>
            </div>
        </Container>
        <CreateAddressPage opened={showCreate} close={hideCreate} ></CreateAddressPage>
        <EditAddressPage opened={showEdit} locationInfo={locationSelected} close={hideEdit}></EditAddressPage>
    </AuthLayout>

}

export default AddressListPage;