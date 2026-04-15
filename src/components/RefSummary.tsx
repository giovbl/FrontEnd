import { Alert, Group, Loader, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import api from "../utils/api"
import { IconX } from "@tabler/icons-react"

interface RefSummaryInput{
    refertoId: number,
    summary: String | null
}

function RefSummary({refertoId,summary: smry}:RefSummaryInput){

    const [summary,setSummary] = useState(smry)
    const [error,setError] = useState(false)

    const [effState, setEffState] = useState(false)
    useEffect(()=>{
        if(summary == null){
            const timer = setTimeout(()=>{
                api.get(`referto/${refertoId}/summary`).then((res)=>{
                    setSummary(res.data.summary)
                    setError(false)
                    setEffState((res.data.summary === summary)?!effState:effState)
                }).catch(()=>{
                    setError(true)
                })
            },10000)

            return () => clearTimeout(timer);
        }
    },[summary,effState])

    return (
        <>
        {error?
            <Alert variant="light" color="red" title="Impossibile ottenere il sommario" icon={<IconX/>}/>
            :
            <>
            {summary?
                <Text>{summary}</Text>
                :
                <Group>
                    <Loader size={15}/>
                    <Text>In generazione...</Text>
                </Group>
            }
            </>
        }
        </>
    )
}   

export default RefSummary