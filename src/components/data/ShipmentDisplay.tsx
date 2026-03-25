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
                                Data di ritiro: {new Date(shipment.expectedTakenDate).toLocaleDateString()}
                            </Text>
                            <Text size="sm">
                                Consegna prevista: {new Date(shipment.expectedDeliveryDate).toLocaleDateString()}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'taken' &&
                        <Box>
                            <Text size="sm">
                                In data: {shipment.effectiveTakenDate?.toLocaleString()}
                            </Text>
                            <Text size="sm">
                                Consegna il: {shipment.expectedDeliveryDate.toLocaleString()}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'in transit' &&
                        <Box>
                            <Text size="sm">
                                Preso in data: {shipment.effectiveTakenDate?.toLocaleString()}
                            </Text>
                            <Text size="sm">
                                Consegna il: {shipment.expectedDeliveryDate.toLocaleString()}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'arrived' &&
                            <Text size="sm">
                                In data: {shipment.effectiveDeliveryDate?.toLocaleString()}
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
                        <Group>
                            <IconClockQuestion/>
                            <Text>Da spedire</Text>
                        </Group>
                    }
                </>
            }
        </>
    )
}

export default ShipmentDisplay