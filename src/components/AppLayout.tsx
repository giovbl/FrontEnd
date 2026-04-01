import { Outlet, useLocation } from 'react-router-dom';
import { redirect, useLoaderData, useMatch, useNavigate, useNavigation } from 'react-router'

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Center, Group, NavLink, Divider } from "@mantine/core";
import { IconPackage, IconTestPipe2Filled, IconUserFilled, IconUsers } from '@tabler/icons-react';

import api from '../utils/api';

import AllCenter from './AllCenter';
import { UserContext } from '../utils/context';
import type { AxiosError } from 'axios';
import Logo from './Logo';
import LoadingIndicator from './LoadingIndicator';

//Loader for getting current user's info
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('user')
        return res.data
    }catch(error){
        const err = error as AxiosError

        if(err.status === 401)
            throw redirect("/auth/login")
        else
            throw err;
    }
}

function AppLayout(){

    const [opened, { toggle }] = useDisclosure();

    const match = useMatch(useLocation().pathname);
    const navigate = useNavigate();
    const navigation = useNavigation()

    const user = useLoaderData()
    const isNavigating = Boolean(navigation.location);

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
                            <Logo/>
                        </AllCenter>
                    </Group>
                </AppShell.Header>

                {opened &&
                    <AppShell.Navbar p="md" px="md">

                        {user.userType === 'Oncologo' &&
                            <>
                                <NavLink
                                    label="Campioni"
                                    active={!!match && (match.pathname === '/oncologo' || match.pathname === '/')}
                                    leftSection={<IconTestPipe2Filled/>}
                                    onClick={()=>navigate('/oncologo')}/>

                                <NavLink
                                    label="Pazienti"
                                    active={!!match && match.pathname === '/patient'}
                                    leftSection={<IconUsers/>}
                                    onClick={()=>navigate('/patient')}/>
                            </> 
                        }

                        {user.userType === 'Corriere' &&
                            <>
                                <NavLink
                                    label="Spedizioni"
                                    active={!!match && match.pathname === '/courier'}
                                    leftSection={<IconPackage/>}
                                    onClick={()=>navigate('/courier')}/>
                            </> 
                        }

                        {user.userType === 'Analista' &&
                            <>
                                <NavLink
                                    label="Campioni"
                                    active={!!match && match.pathname === '/analyst'}
                                    leftSection={<IconTestPipe2Filled/>}
                                    onClick={()=>navigate('/analyst')}/>
                            </> 
                        }

                        <Divider/>

                        <NavLink
                            label="Account"
                            active={!!match && match.pathname === '/user'}
                            leftSection={<IconUserFilled/>}
                            onClick={()=>navigate('/user')}/>

                    </AppShell.Navbar>
                }

                <AppShell.Main>
                    <Center>
                        {isNavigating?
                            <LoadingIndicator/>
                            :
                            <Outlet/>
                        }
                    </Center>
                </AppShell.Main>

            </AppShell>
        </UserContext.Provider>
  )
}

export default AppLayout