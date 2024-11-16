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


const UserManagementPage = () => {
    const [data, setData] = useState<UserInfo[]>([]);
    useEffect(() => {
        setData([{
            no: 1,
            userID: 'usr001',
            userName: 'henry6868',
            fullName: 'john henry',
            phone: '0653 2565 48579',
            email: 'john_henry6868@gmail.com',
            state: 'NJ 08234',
            status: Status.Active
        }, {
            no: 2,
            userID: 'usr001',
            userName: 'henry6868',
            fullName: 'john henry',
            phone: '0653 2565 48579',
            email: 'john_henry6868@gmail.com',
            state: 'NJ 08234',
            status: Status.Deactive
        }]);
    }, []);

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


    const rows = data.map((row) => (
        <Table.Tr key={row.no}>
            <Table.Td>{row.no}</Table.Td>
            <Table.Td>{row.userID}</Table.Td>
            <Table.Td>{row.userName}</Table.Td>
            <Table.Td>{row.fullName}</Table.Td>
            <Table.Td>{row.phone}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>{row.state}</Table.Td>
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

    };



    return <AuthLayout currentLink={PATH.USERS}>
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
                        <ActionIcon variant="filled" aria-label="Settings" size="lg" color="grey">
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
                                    <Table.Th>User ID</Table.Th>
                                    <Table.Th>Username</Table.Th>
                                    <Table.Th>Full name</Table.Th>
                                    <Table.Th>Phone number</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>State/Zip</Table.Th>
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

    </AuthLayout>
}

export default UserManagementPage;