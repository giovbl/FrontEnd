import {Text, Box, Center} from '@mantine/core'
import {IconAlertTriangle} from '@tabler/icons-react'

interface ErrorDisplayInput{
    width: number,
    iconSize:number,
    textSize:string,
    text:string
}

function ErrorDisplay({width=0,iconSize,textSize,text}:ErrorDisplayInput){

    return (
        <>
        {width === 0?
            <Box>
                <Center>
                    <IconAlertTriangle size={iconSize} color='red'/>
                </Center>
                <Text c="red" ta="center" size={textSize}>{text}</Text>
            </Box>
            :
            <Box w={width}>
                <Center>
                    <IconAlertTriangle size={iconSize} color='red'/>
                </Center>
                <Text c="red" ta="center" size={textSize}>{text}</Text>
            </Box>
        }
        </>
    )
}

export default ErrorDisplay