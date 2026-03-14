import { useLoaderData } from "react-router-dom"

import { Alert,Paper,Text } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

import api from '../utils/api'

import WorkGroupForm from "../components/forms/WorkGroupForm"
import AllCenter from "../components/AllCenter"

//Loader for getting facilities and workgroup data
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    const resfac = await api.get('facility')
    const resusr = await api.get('user')

    return {user: resusr.data,facilities:resfac.data}
}

function WorkgroupPage() {

    const data = useLoaderData()

    return (
        <AllCenter>
            <Paper shadow="xs" p="xl" withBorder>
                <Alert variant="light" 
                    color="blue" 
                    title="Seleziona un workgroup" 
                    icon={<IconInfoCircle/>}>
                    <Text size="sm">
                        Il tuo account richiede l'assegnazione ad un workgroup
                    </Text>
                </Alert>
                <WorkGroupForm facilities={data.facilities} user={data.user}/>
            </Paper>
        </AllCenter>
    )
}

export default WorkgroupPage