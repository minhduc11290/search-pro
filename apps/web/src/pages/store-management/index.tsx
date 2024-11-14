import { ActionIcon, Button, Container, Pagination, rem, TextInput, Text } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Tooltip, Switch } from '@mantine/core';
import cx from 'clsx';
import classes from './store-management.module.css';
import { Header } from "../../components/header";
import { IconSearch, IconRefresh, IconPlus, IconEdit, IconLock } from "@tabler/icons-react";
import { Store } from "../../@types/store-props";
import { modals } from '@mantine/modals';
import EditStorePage from "./components/edit";
import CreateStorePage from "./components/create";
import { Status } from "../../@types/enum/status";

const StoreManagementPage = () => {
    const [data, setData] = useState<Store[]>([]);
    useEffect(() => {
        setData([{
            no: 1,
            ownerstore: 'Brian Huynh',
            userName: 'brianhuynh',
            phone: '0968656985632',
            email: 'brianhuynh3265@gmail.com',
            status: Status.Active,
        }, {
            no: 2,
            ownerstore: 'Brian Huynh',
            userName: 'brianhuynh',
            phone: '0968656985632',
            email: 'brianhuynh3265@gmail.com',
            status: Status.Deactive,
        }]);
    }, []);

    const [scrolled, setScrolled] = useState(false);

    const moveToEdit = (store: Store) => {
        setShowEdit(true);
        setStoreSelected(store);
    }
    const rows = data.map((row) => (
        <Table.Tr key={row.no}>
            <Table.Td>{row.no}</Table.Td>
            <Table.Td>{row.ownerstore}</Table.Td>
            <Table.Td>{row.userName}</Table.Td>
            <Table.Td>{row.phone}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>
                <Container className={row.status == Status.Active ? classes.active : classes.deactive}>
                    {row.status == Status.Active ? 'Active' : 'Deactive'}
                </Container>
            </Table.Td>
            <Table.Td><a className="text-blue-500">Show address list </a></Table.Td>
            <Table.Td><a className="text-blue-500">Show product list </a></Table.Td>
            <Table.Td>
                <Container className="flex flex-row items-center">
                    <Tooltip label={row.status == Status.Active ? 'Deactive account' : 'Active account'} refProp="rootRef">
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
                    <ActionIcon variant="transparent" aria-label="Settings" size="sm">
                        <IconLock style={{ width: '100%', height: '100%' }} stroke={1.5} />
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

    const [storeSelected, setStoreSelected] = useState<Store>({
        no: 0,
        ownerstore: '',
        userName: '',
        phone: '',
        email: '',
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

    return <AuthLayout currentLink={PATH.STOREMANAGEMENT}>
        <Header title="Store management"></Header>
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
                        }} >Add new store owner</Button>
                    </Container>
                </div>
                <div>
                    <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700} className={classes.table} withTableBorder={true}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>No</Table.Th>
                                    <Table.Th>Owner's Store</Table.Th>
                                    <Table.Th>Username</Table.Th>
                                    <Table.Th>Phone</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Address List</Table.Th>
                                    <Table.Th>Product List</Table.Th>
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
        <CreateStorePage opened={showCreate} close={hideCreate} ></CreateStorePage>
        <EditStorePage opened={showEdit} storeInfo={storeSelected} close={hideEdit}></EditStorePage>
    </AuthLayout>
}

export default StoreManagementPage;