import { Button, Group, Modal, ScrollArea, Table, Title } from "@mantine/core";
import { CreateStoreProps } from "../../../@types/create-store-props";
import classes from '../product-list.module.css';
import cx from 'clsx';
import { useState } from "react";
import { LocationPrice } from "../../../@types/product-props";

const ListLocationPage = ({ opened, close }: CreateStoreProps) => {
    const [scrolled, setScrolled] = useState(false);
    const data: LocationPrice[] = [{
        locationID: 'store001',
        address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
        state: 'NJ',
        zipCode: '08234',
        price: '$ 2.00',
    }, {
        locationID: 'store001',
        address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
        state: 'NJ',
        zipCode: '08234',
        price: '$ 2.00',
    }];

    const rows = data.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td>{row.locationID}</Table.Td>
            <Table.Td>{row.address}</Table.Td>
            <Table.Td>{row.state} {row.zipCode}</Table.Td>
            <Table.Td>{row.price}</Table.Td>
        </Table.Tr>));

    return (<Modal opened={opened} onClose={() => { }} size="lg" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Create new product </Title>

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
                    {rows}
                </Table.Tbody>

            </Table>
        </ScrollArea>
        <Group mt="xl" className="flex justify-end">
            <Button onClick={close}>Close</Button>
        </Group>
    </Modal>)
}
export default ListLocationPage;