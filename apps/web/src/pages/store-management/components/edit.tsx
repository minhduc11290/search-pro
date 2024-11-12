import { Modal, Text, Group, TextInput } from "@mantine/core";
import { EditStoreProps } from "../../../@types/edit-store-props";
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { phoneRegex } from '../../../utils/regex';
const EditStorePage = ({ opened, storeInfo }: EditStoreProps) => {
    const schema = z.object({
        name: z
            .string()
            .min(2, { message: 'Name should have at least 2 letters' }),
        email: z.string().email({ message: 'Invalid email' }),
        phone: z.string().regex(phoneRegex, 'Invalid phone')

    });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: storeInfo.ownerstore,
            email: storeInfo.email,
            phone: storeInfo.phone,
            status: storeInfo.status
        },
        validate: zodResolver(schema),
    });

    return (<Modal opened={opened} onClose={close} size="auto" title="Modal size auto">
        <Text>Edit store owner</Text>

        <Group wrap="nowrap" mt="md">
            <TextInput
                label="Name"
                placeholder="Name"
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
            />
        </Group>

        {/* <Group mt="xl">
            <Button onClick={increment}>Add badge</Button>
            <Button onClick={decrement}>Remove badge</Button>
        </Group> */}
    </Modal>
    )
}
export default EditStorePage;