import { useState } from "react";
import { Button, Text } from '@mantine/core'

import { type AnalysisStatus, type SampleInfo } from "../../utils/types"
import ErrorDisplay from "../Error";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { IconEye } from "@tabler/icons-react";

interface AnalysisStateInput{
    status: AnalysisStatus,
    data: Array<SampleInfo>
    sampleid: number,
    shipping: boolean,
    setData: (input: Array<SampleInfo>) => void,
    createfun: (sampleId:number) => void
}

function AnalysisState({status,sampleid,data,shipping,setData,createfun}:AnalysisStateInput){

    const [failed, setFailed] = useState(false)
    const navigate = useNavigate()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createReferto = (e: React.MouseEvent<HTMLButtonElement>) => createfun(sampleid);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setToAnalyze = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const newState = 'analyzing'

        try{
            await api.patch(`sample/${sampleid}/status`,{
                status:newState
            })

            setData(data.map(itm => {
                  if(itm.id == sampleid)
                     return Object.assign({}, itm, {analysisStat:newState})
                  return itm
                })
            )
        }
        catch(err){
            setFailed(true)
        }

    };

    const refertoId = data.filter((itm)=>itm.id === sampleid)[0].referto


    if(failed)
        return <ErrorDisplay iconSize={30} textSize="xs" text="Errore: impossibile modificare lo stato"/>
    else
        return (
            <>
            {status === 'unanalyzed' &&
                <>
                {shipping?
                    <Text>In attesa della consegna</Text>
                    :
                    <Button size="compact-sm" onClick={setToAnalyze}>
                        Segna come in analisi
                    </Button>
                }
                </>
            }
            {status === 'analyzing' &&
                <Button size="compact-sm" onClick={createReferto}>
                    Crea referto
                </Button>
            }
            {status === 'completed' &&
                <Button 
                    leftSection={<IconEye/>}
                    onClick={()=>navigate('/referto/'+refertoId)}>Visualizza referto</Button>
            }
            </>
        )

}

export default AnalysisState