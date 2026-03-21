import { Loader,Space,Text } from "@mantine/core";

function Loading(){
    return (
        <>
            <Loader color="blue" type="dots"/>
            <Space h='md'/>
            <Text>Caricamento in corso...</Text>
        </>
    )
}

export default Loading