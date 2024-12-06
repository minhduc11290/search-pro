import {
    Container,
    Avatar,
    Group,
    Text,
    rem,
    Title,
    ActionIcon,
} from '@mantine/core';
import {
    IconLogout,
    IconChevronLeft
} from '@tabler/icons-react';
import classes from './header.module.css';
import { HeaderProps } from '../@types/header-props';
import useAuth from '../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../constants/paths';
import { useEffect, useState } from 'react';
import { UserInfo } from '../@types/user-props';

// const user = {
//     name: 'Jane Spoonfighter',
//     email: 'janspoon@fighter.dev',
//     image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
//     id: '3265236598'
// };

export function Header({ title, isBack, onBackPress }: HeaderProps) {
    const [user, setUser] = useState<UserInfo | null>(null);

    const { getProfile, logout } = useAuth();
    const image = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png';

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setUser(await getProfile());
    }

    const navigate = useNavigate();
    return (
        <div className={classes.header}>
            <div className={`${classes.mainSection} flex flex-1 justify-between w-fit mx-2`}>

                <Container className='mx-0 flex flex-row justify-start items-center w-full pl-0 ml-4'>
                    {isBack && <ActionIcon variant='transparent' onClick={onBackPress} className='mr-2'>
                        <IconChevronLeft style={{ width: rem(24), height: rem(24) }} stroke={1.5}></IconChevronLeft>
                    </ActionIcon>}
                    <Title order={3} ta="center" className={`${classes.title}`} >
                        {title}
                    </Title>
                </Container>

                <Group justify="space-between">

                    <Group gap={7}>
                        <Avatar src={image} alt={user?.fullName} radius="xl" size={30} />
                        <Container className='max-w-60 overflow-hidden'>
                            <Text fw={500} size="sm" lh={1} mr={2}>
                                {user?.fullName}
                            </Text>
                            <Text fw={400} size="sm" lh={1} mr={2} mt={2}>
                                ID: {user?.userID}
                            </Text>
                        </Container>
                        <IconLogout style={{ width: rem(24), height: rem(24) }} stroke={1.5} onClick={() => {
                            logout();
                            navigate(PATH.LOGIN);
                        }} />
                    </Group>
                </Group>
            </div>

        </div >
    );
}