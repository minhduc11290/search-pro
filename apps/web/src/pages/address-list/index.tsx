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

const AddressListPage = () => {
    const [data, setData] = useState<LocationInfo[]>([]);
    useEffect(() => {
        setData([{
            no: 1,
            locationID: 'store001',
            address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
            state: 'NJ',
            zipCode: '08234',
            openAt: '6:00am',
            closeAt: '18:00pm',
            status: Status.Active
        }, {
            no: 2,
            locationID: 'store002',
            address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
            state: 'NJ',
            zipCode: '08234',
            openAt: '6:00am',
            closeAt: '18:00pm',
            status: Status.Deactive
        }]);
    }, []);

    const [scrolled, setScrolled] = useState(false);

    const moveToEdit = (location: LocationInfo) => {
        setShowEdit(true);
        setLocationSelected(location);
    }
    const rows = data.map((row) => (
        <Table.Tr key={row.no}>
            <Table.Td>{row.no}</Table.Td>
            <Table.Td>{row.locationID}</Table.Td>
            <Table.Td>{row.address}</Table.Td>
            <Table.Td>{row.state} {row.zipCode}</Table.Td>
            <Table.Td>{row.openAt} - {row.closeAt}</Table.Td>
            <Table.Td>
                <Container className="flex flex-row items-center">
                    <Tooltip label={row.status == Status.Active ? 'Deactive location' : 'Active account'} refProp="rootRef">
                        <Switch checked={row.status == Status.Active} onChange={(event) => {
                            const title = row.status == Status.Active ? 'Deactive account' : 'Active account';
                            const checked = event.currentTarget.checked;
                            openModal(title, () => {
                                console.log("event.currentTarget", checked);
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
        onCancel: () => console.log('Cancel'),
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

    };

    const hideEdit = () => {
        setShowEdit(false)
    }

    const hideCreate = () => {
        setShowCreate(false)
    }

    return <AuthLayout currentLink={PATH.ADDRESSLIST} >
        <Header title="Location list"></Header>
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
                <div className="py-2 flex justify-between">
                    <TextInput
                        placeholder="Search by any field"
                        rightSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                        className="max-w-md"
                    />

                    <Container className="flex flex-row items-center flex-1 flex-grow justify-end mr-0 px-0">
                        <ActionIcon variant="filled" aria-label="Settings" size="lg" color="grey">
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
                    <Pagination total={2} />
                </Container>
            </div>
        </Container>
        <CreateAddressPage opened={showCreate} close={hideCreate} ></CreateAddressPage>
        <EditAddressPage opened={showEdit} locationInfo={locationSelected} close={hideEdit}></EditAddressPage>
    </AuthLayout>

}

export default AddressListPage;