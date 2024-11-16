import { useState } from 'react';
import { Group } from '@mantine/core';
import {
    IconShoppingCart,
    IconHeartHandshake,
    IconUser
} from '@tabler/icons-react';

import classes from './auth-layout.module.css';
import { MainLayoutProps } from '../@types/main-layout-props';
import logo from '../assets/logo.png';
import { Image } from '@mantine/core';
import { PATH } from '../constants/paths';
import { useNavigate } from 'react-router-dom';

const data = [
    { link: PATH.STOREMANAGEMENT, label: 'Store management', icon: IconShoppingCart },
    { link: PATH.USERS, label: 'User management', icon: IconUser },

];

export function AuthLayout({ children, currentLink }: MainLayoutProps) {
    const navigate = useNavigate();
    const [active, setActive] = useState(currentLink);

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.link === active || undefined}
            // href={item.link}
            key={item.label}
            onClick={(event) => {
                navigate(item.link);
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <div className='w-screen h-screen flex flex-row'>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        {/* <MantineLogo size={28} /> */}
                        {/* <Code fw={700}>v3.1.2</Code> */}
                        <Image
                            radius="md"
                            h={48}
                            src={logo}
                        />
                    </Group>
                    {links}
                </div>
            </nav>
            <div className='flex flex-col flex-1'>
                {children}
            </div>
        </div>
    );
}