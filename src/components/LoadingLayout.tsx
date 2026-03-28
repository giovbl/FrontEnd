import { AppShell, Burger, Group, Loader,Skeleton } from "@mantine/core";
import AllCenter from "./AllCenter";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./Logo";

function LoadingLayout(){

    const [opened, { toggle }] = useDisclosure();

    return (   
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
                        <Skeleton visible h={400}/>
                    </AppShell.Navbar>
                }

                <AppShell.Main>
                    <AllCenter>
                        <Loader color="blue" type="bars" size={70}/>
                    </AllCenter>
                </AppShell.Main>

        </AppShell>
    )
}

export default LoadingLayout