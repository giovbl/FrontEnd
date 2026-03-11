import {Text, Stack, Center} from '@mantine/core'
import {IconAlertTriangle} from '@tabler/icons-react'
import AllCenter from './AllCenter'

function ErrorDisplay(){
    return (
        <AllCenter>
            <Stack>
                <Center>
                    <IconAlertTriangle size={100} color='red'/>
                </Center>
                <Text c="red" size="lg">Errore: impossibile contattare il server</Text>
            </Stack>
        </AllCenter>
    )
}

export default ErrorDisplay