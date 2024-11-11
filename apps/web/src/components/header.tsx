import {
    Container,
    Avatar,
    Group,
    Text,
    rem,
    Title,
} from '@mantine/core';
import {
    IconLogout,
} from '@tabler/icons-react';
import classes from './header.module.css';
import { HeaderProps } from '../@types/header-props';

const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    id: '3265236598'
};

export function Header({ title, isBack, onBackPress }: HeaderProps) {

    return (
        <div className={classes.header}>
            <div className={`${classes.mainSection} flex flex-1 justify-between w-fit mx-2`}>
                <a
                    onClick={(event) => {
                        event.preventDefault();
                        if (isBack && onBackPress) {
                            onBackPress
                        }

                    }}
                >
                    <Title ta="center" className={`${classes.title} mb-4`} >
                        {title}
                    </Title>
                </a>
                <Group justify="space-between">

                    <Group gap={7}>
                        <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
                        <Container >
                            <Text fw={500} size="sm" lh={1} mr={2}>
                                {user.name}
                            </Text>
                            <Text fw={400} size="sm" lh={1} mr={2} mt={2}>
                                ID: {user.id}
                            </Text>
                        </Container>
                        <IconLogout style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                    </Group>
                </Group>
            </div>

        </div >
    );
}