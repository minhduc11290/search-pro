import { ActionIcon, Container, Pagination, rem, TextInput, Text } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Tooltip, Switch } from '@mantine/core';
import cx from 'clsx';
import classes from './user-management.module.css';
import { Header } from "../../components/header";
import { IconSearch, IconRefresh, } from "@tabler/icons-react";
import { Status } from "../../@types/enum/status";
import { modals } from '@mantine/modals';
import { UserInfo } from "../../@types/user-props";
import useUsers from "../../hooks/users";
import { PAGINATION } from "../../constants/pagination";


const UserManagementPage = () => {
    const [data, setData] = useState<UserInfo[]>([]);
    const [dataFiltered, setDataFiltered] = useState<UserInfo[]>([]);
    const [dataDisplay, setDataDisplay] = useState<UserInfo[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

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
    }, [currentPage]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const users = await getUsers();
        setData(users);
        setDataFiltered(users);
    }

    const { isLoading, getUsers } = useUsers();

    const [scrolled, setScrolled] = useState(false);
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


    const rows = dataDisplay.map((row, index) => (
        <Table.Tr key={row.no}>
            <Table.Td>{index + 1}</Table.Td>
            {/* <Table.Td>{row.userID}</Table.Td> */}
            <Table.Td>{row.userName}</Table.Td>
            {/* <Table.Td>{row.fullName}</Table.Td>
            <Table.Td>{row.phone}</Table.Td> */}
            <Table.Td>{row.email}</Table.Td>
            {/* <Table.Td>{row.state}</Table.Td> */}
            <Table.Td>
                <Container className="flex flex-row items-center">
                    <Tooltip label={row.status == Status.Active ? 'Deactive account' : 'Active account'} refProp="rootRef">
                        <Switch checked={row.status == Status.Active} onChange={(event) => {
                            const title = row.status == Status.Active ? 'Deactive account' : 'Active account';
                            const checked = event.currentTarget.checked;
                            openModal(title, () => {
                                row.status = (checked ? Status.Active : Status.Deactive);
                                setData([...data]);
                            });

                        }} />
                    </Tooltip>

                </Container>
            </Table.Td>
        </Table.Tr>
    ));


    const [search, setSearch] = useState('');



    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);

        const dataFilter = data.filter(function (el) {
            return el.fullName.includes(value)
                || el.email.includes(value)
                || el.phone.includes(value) || el.userID?.includes(value);
        });

        console.log("dataFilter", dataFilter);

        setDataFiltered(dataFilter);
    };

    return <AuthLayout currentLink={PATH.USERS} isLoading={isLoading}>
        <Header title="User management"></Header>
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

                    </Container>
                </div>
                <div>
                    <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700} className={classes.table} withTableBorder={true}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>No</Table.Th>
                                    {/* <Table.Th>User ID</Table.Th> */}
                                    <Table.Th>Username</Table.Th>
                                    {/* <Table.Th>Full name</Table.Th>
                                    <Table.Th>Phone number</Table.Th> */}
                                    <Table.Th>Email</Table.Th>
                                    {/* <Table.Th>State/Zip</Table.Th> */}
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

    </AuthLayout>
}

export default UserManagementPage;