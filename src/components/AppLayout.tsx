import { createContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { redirect, useLoaderData, useMatch, useNavigate } from 'react-router'

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Center, Group, Text, NavLink } from "@mantine/core";

import api from '../utils/api';

import AllCenter from './AllCenter';
import type { UserData } from '../utils/types';
import { IconTestPipe2Filled, IconUserFilled } from '@tabler/icons-react';

const UserContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('user')
        return res.data
    }catch(err){
        if(err.status === 401)
            throw redirect("auth/login")
        else
            throw err;
    }
}

function AppLayout(){

    const [opened, { toggle }] = useDisclosure();

    const match = useMatch(useLocation().pathname);
    const navigate = useNavigate();

    const user = useLoaderData()
    const usr:UserData = user

    return(
        <UserContext.Provider value={user}>
            <AppShell
            header={{ height: 60 }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: !opened } }}
            padding="md">

                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} aria-label="Toggle Menu" />
                        <AllCenter>
                            <Text>LOGOTEXT</Text>
                        </AllCenter>
                    </Group>
                </AppShell.Header>

                {opened &&
                    <AppShell.Navbar p="md" px="md">

                        {usr.userType === 'Oncologo' &&
                            <>
                                <NavLink
                                    label="Campioni"
                                    active={!!match && match.pathname === '/'}
                                    leftSection={<IconTestPipe2Filled/>}
                                    onClick={()=>navigate('/')}/>

                                <NavLink
                                    label="Pazienti"
                                    active={!!match && match.pathname === '/patient'}
                                    leftSection={<IconUserFilled/>}
                                    onClick={()=>navigate('/patient')}/>
                            </>                            
                        }

                    </AppShell.Navbar>
                }

                <AppShell.Main>
                    <Center>
                        <Outlet/>
                    </Center>
                </AppShell.Main>

            </AppShell>
        </UserContext.Provider>
  )
}

export default AppLayout