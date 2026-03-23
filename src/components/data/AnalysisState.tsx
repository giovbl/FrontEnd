import { useState } from "react";
import { Button } from '@mantine/core'

import { type AnalysisStatus } from "../../utils/types"
import ErrorDisplay from "../Error";
import api from "../../utils/api";

interface AnalysisStateInput{
    status: AnalysisStatus,
    data: Array<unknown>
    sampleid: number,
    setData: (input: Array<unknown>) => void
}

function AnalysisState({status,sampleid,data,setData}:AnalysisStateInput){

    const [failed, setFailed] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setToAnalyze = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const newState = 'analyzing'

        try{
            await api.patch(`sample/${sampleid}/status`,{
                status:newState
            })

            setData(data.map(itm => {
                  if(itm.id == sampleid)
                     return Object.assign({}, itm, {status:newState})
                  return itm
                })
            )
        }
        catch(err){
            console.log(err)
            setFailed(true)
        }

    };

    const createReferto = (e: React.MouseEvent<HTMLButtonElement>) => {

        //Pass to page state sample id
        //Move to the page for making a referto

    };

    if(failed)
        return <ErrorDisplay iconSize={30} textSize="xs" text="Errore: impossibile modificare lo stato"/>
    else
        return (
            <>
            {status === 'unanalyzed'?
                <Button size="compact-sm" onClick={setToAnalyze}>
                    Segna come in analisi
                </Button>
                :
                <Button size="compact-sm" onClick={createReferto}>
                    Crea referto
                </Button>
            }
            </>
        )

}

export default AnalysisState