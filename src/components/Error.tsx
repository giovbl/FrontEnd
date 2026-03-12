import {Text, Box, Center} from '@mantine/core'
import {IconAlertTriangle} from '@tabler/icons-react'

interface ErrorDisplayInput{
    iconSize:number,
    textSize:string,
    text:string
}

function ErrorDisplay({iconSize,textSize,text}:ErrorDisplayInput){
    return (
            <Box>
                <Center>
                    <IconAlertTriangle size={iconSize} color='red'/>
                </Center>
                <Text c="red" ta="center" size={textSize}>{text}</Text>
            </Box>
    )
}

export default ErrorDisplay