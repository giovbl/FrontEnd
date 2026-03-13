import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Center, Group, Text } from "@mantine/core";
import AllCenter from './AllCenter';
import { Outlet } from 'react-router-dom';

function AppLayout(){

    const [opened, { toggle }] = useDisclosure();

    return(
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
                    Navbar is collapsed on mobile at sm breakpoint. At that point it is no longer offset by
                    padding in the main element and it takes the full width of the screen when opened.
                </AppShell.Navbar>
            }

            <AppShell.Main>
                <Center>
                    <Outlet/>
                </Center>
            </AppShell.Main>

        </AppShell>
  )
}

export default AppLayout