import { useState } from "react";
import { Button, Group, Text } from '@mantine/core'

import type { ShipmentStatus } from "./types";
import ErrorDisplay from "../Error";
import { IconCheck } from "@tabler/icons-react";

interface ShipmentStateInput{
    shipmentId: number,
    status: ShipmentStatus,
    data: Array<unknown>,
    setData: (input: Array<unknown>) => void
}

function ShipmentState({shipmentId,status,data,setData}:ShipmentStateInput){

    const [failed, setFailed] = useState(false)

    const changeStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
        
        let newStatus:ShipmentStatus;
        
        //Changing status
        switch(status) {
            case 'received':
                newStatus = 'taken'
                break;
            case 'taken':
                newStatus = 'in transit'
                break;
            case 'in transit':
                newStatus = 'arrived'
                break;
        }

        try{
            /*
            change state
            */

            setData(data.map(itm => {
                  if(itm.id == shipmentId)
                     return Object.assign({}, itm, {status: newStatus})
                  return itm
                })
            )
        }
        catch(err){
            console.log(err)
            setFailed(true)
        }
    }

    function btnText(status:ShipmentStatus){
        switch(status) {
            case 'received':
                return 'Segna come preso'
            case 'taken':
                return 'Segna come in transito'
            case 'in transit':
                return 'Segna come consegnato'
        
            default:
                break;
        }
    }


    if(failed)
        return <ErrorDisplay iconSize={30} textSize="xs" text="Errore: impossibile modificare lo stato"/>
    
    return (
        <>
            {status === 'arrived'?
                <Group>
                    <IconCheck/>
                    <Text>Consegnato</Text>
                </Group>
                :
                <Button onClick={changeStatus}>
                    {btnText(status)}
                </Button>
            }
        </>
    )

}

export default ShipmentState