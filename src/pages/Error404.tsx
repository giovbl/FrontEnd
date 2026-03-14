import {Text} from '@mantine/core'

import AllCenter from "../components/AllCenter"
import { IconMoodPuzzled } from '@tabler/icons-react'

function Error404(){
    return(
        <AllCenter>
            <>
            <IconMoodPuzzled size={150}/>
            <Text size='xl'>Pagina inesistente</Text>
            </>
        </AllCenter>
    )
}

export default Error404