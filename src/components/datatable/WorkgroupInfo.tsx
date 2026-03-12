import {Box,Text} from '@mantine/core'


interface WorkgroupInfoInput{
    workgroup: string,
    facility: string
}

function WorkgroupInfo({workgroup,facility}:WorkgroupInfoInput){

    return (
        <Box>
            <Text size="sm">Workgroup: {workgroup}</Text>
            <Text size="sm">Struttura: {facility}</Text>
        </Box>
    )
}

export default WorkgroupInfo