import { Button, Group, Modal, ScrollArea, Table, Title } from "@mantine/core";
import classes from '../product-list.module.css';
import cx from 'clsx';
import { useState } from "react";
import { ListLocationProps } from "../../../@types/list-location-products";


const ListLocationPage = ({ opened, close, locationPrice }: ListLocationProps) => {
    console.log("locationPrice", locationPrice);
    const [scrolled, setScrolled] = useState(false);
    // const data: LocationPrice[] = [{
    //     locationID: 'store001',
    //     address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
    //     state: 'NJ',
    //     zipCode: '08234',
    //     // price: '$ 2.00',
    //     price: 2
    // }, {
    //     locationID: 'store001',
    //     address: '91 ELM ST MANCHESTER CT 06040-8610 USA',
    //     state: 'NJ',
    //     zipCode: '08234',
    //     // price: '$ 2.00',
    //     price: 2
    // }];

    // const [data, setData] =  useState<LocationPrice[]>([]);

    const rows = locationPrice.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td style={{ maxWidth: '80' }}>{row.locationID}</Table.Td>
            <Table.Td>{row.address}</Table.Td>
            <Table.Td>{row.steName} {row.zipCode}</Table.Td>
            <Table.Td>{row.price}</Table.Td>
        </Table.Tr>));

    return (<Modal opened={opened} onClose={() => { }} size="lg" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> List location </Title>

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
            <Button onClick={() => close(false)}>Close</Button>
        </Group>
    </Modal>)
}
export default ListLocationPage;