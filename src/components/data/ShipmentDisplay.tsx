import {Group,Text,Box, Button} from '@mantine/core'
import {IconCheck, IconCheckupList, IconTruckLoading, IconTruckDelivery, IconPackageOff, IconClockQuestion, IconCubeSend } from '@tabler/icons-react'
import type { Shipment, ShipmentStatus } from '../../utils/types'

export interface ShipmentDisplayInput{
    sampleId: number
    shipment: Shipment,
    courierUsed: boolean,
    strfun: (stat:string) => string,
    createShipment?: (sampleId:number)=>void
}

function ShipmentIcon({status}:{status:ShipmentStatus}){
    switch(status) {
        case 'received':
            return <IconCheckupList/>
        case 'taken':
            return <IconTruckLoading/>
        case 'in transit':
            return <IconTruckDelivery/>
        case 'arrived':
            return <IconCheck/>
    }
}

function ShipmentDisplay({sampleId,shipment,courierUsed,strfun,createShipment}:ShipmentDisplayInput){

    function dateString(date:Date,time:boolean){
        date = new Date(date)

        let str = `${date.getDay()}/${date.getDate()}/${date.getFullYear()}`

        if(time)
            str += ` ${date.getHours()}:${date.getMinutes()}`

        return str;
    }

    return (
        <>
            {shipment?
                <Group gap="xs">
                    <Group>
                        <ShipmentIcon status={shipment.status}/>
                        <Text>{strfun(shipment.status)}</Text>
                    </Group>
                    {shipment.status === 'received' &&
                        <Box>
                            <Text size="sm">
                                Ritiro previsto: {dateString(shipment.expectedTakenDate,false)}
                            </Text>
                            <Text size="sm">
                                Consegna prevista: {dateString(shipment.expectedDeliveryDate,false)}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'taken' &&
                        <Box>
                            <Text size="sm">
                                In data: {dateString(shipment.effectiveTakenDate?shipment.effectiveTakenDate:new Date(-1),true)}
                            </Text>
                            <Text size="sm">
                                Consegna il: {dateString(shipment.expectedDeliveryDate,false)}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'in transit' &&
                        <Box>
                            <Text size="sm">
                                Preso in data: {dateString(shipment.effectiveTakenDate?shipment.effectiveTakenDate:new Date(-1),true)}
                            </Text>
                            <Text size="sm">
                                Consegna il: {dateString(shipment.expectedDeliveryDate,false)}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'arrived' &&
                            <Text size="sm">
                                In data: {dateString(shipment.effectiveDeliveryDate?shipment.effectiveDeliveryDate:new Date(-1),true)}
                            </Text>
                    }
                </Group>
                :
                <>
                    {typeof createShipment === "function"?
                        <>
                        {courierUsed?
                            <Button
                                leftSection={<IconCubeSend/>}
                                onClick={()=>{createShipment(sampleId)}}>
                                Spedisci
                            </Button>
                            :
                            <Group>
                                <IconPackageOff/>
                                <Text>Nessuna spedizione</Text>
                            </Group>
                        }
                        </>
                        :
                        <>
                        {courierUsed?
                            <Group>
                                <IconClockQuestion/>
                                <Text>Da spedire</Text>
                            </Group>
                            :
                            <Group>
                                <IconPackageOff/>
                                <Text>Nessuna spedizione</Text>
                            </Group>
                        }
                        </>
                    }
                </>
            }
        </>
    )
}

export default ShipmentDisplay