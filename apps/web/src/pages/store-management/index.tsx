import { Container, rem, TextInput } from "@mantine/core";
import { AuthLayout } from "../../components/auth-layout";
import { PATH } from "../../constants/paths";
import { useState } from 'react';
import { Table, ScrollArea } from '@mantine/core';
import cx from 'clsx';
import classes from './store-management.module.css';
import { Header } from "../../components/header";
import { IconSearch } from "@tabler/icons-react";

const StoreManagementPage = () => {
    const data = [
        {
            name: 'Athena Weissnat',
            company: 'Little - Rippin',
            email: 'Elouise.Prohaska@yahoo.com',
        },
        {
            name: 'Deangelo Runolfsson',
            company: 'Greenfelder - Krajcik',
            email: 'Kadin_Trantow87@yahoo.com',
        },
        {
            name: 'Danny Carter',
            company: 'Kohler and Sons',
            email: 'Marina3@hotmail.com',
        }];
    const [scrolled, setScrolled] = useState(false);

    const rows = data.map((row) => (
        <Table.Tr key={row.name}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>{row.company}</Table.Td>
        </Table.Tr>
    ));

    const [search, setSearch] = useState('');
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);

    };

    return <AuthLayout currentLink={PATH.STOREMANAGEMENT}>
        <Header title="Location list"></Header>
        <div className="px-2 flex flex-1 w-full">
            <div className="flex flex-1 flex-col justify-start">
                <div className="py-2">
                    <TextInput
                        placeholder="Search by any field"
                        mb="md"
                        rightSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                        className="max-w-80"
                    />
                </div>
                <div>
                    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700} className="w-fit">
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
            </div>
        </div>
    </AuthLayout>
}

export default StoreManagementPage;