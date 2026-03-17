import { Loader,Text } from "@mantine/core";

function Loading(){
    return (
        <>
            <Loader color="blue" type="dots"/>
            <Text>Caricamento in corso...</Text>
        </>
    )
}

export default Loading