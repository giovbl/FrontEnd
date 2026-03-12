import {Group,Text,Box} from '@mantine/core'
import { IconX, IconCheck, IconCheckupList, IconTruckLoading, IconTruckDelivery } from '@tabler/icons-react'
import type { ShipmentStatus } from './types'

export interface ShipmentDisplayInput{
    shipment: unknown  
    strfun: (stat:string) => string
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

function ShipmentDisplay({shipment,strfun}:ShipmentDisplayInput){
    
    return (
        <>
            {shipment?
                <Group gap="xs">
                    <Group>
                        <ShipmentIcon status={shipment.status}/>
                        <Text>{strfun(shipment.status)}</Text>
                    </Group>
                    {shipment.status === 'received' &&
                            <Text size="sm">
                                Verrà preso il: {shipment.expectedTakenDate.toLocaleString()}
                            </Text>
                    }
                    {shipment.status === 'taken' &&
                        <Box>
                            <Text size="sm">
                                In data: {shipment.effectiveTakenDate.toLocaleString()}
                            </Text>
                            <Text size="sm">
                                Consegna il: {shipment.expectedDeliveryDate.toLocaleString()}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'in transit' &&
                        <Box>
                            <Text size="sm">
                                Preso in data: {shipment.effectiveTakenDate.toLocaleString()}
                            </Text>
                            <Text size="sm">
                                Consegna il: {shipment.expectedDeliveryDate.toLocaleString()}
                            </Text>
                        </Box>
                    }
                    {shipment.status === 'arrived' &&
                            <Text size="sm">
                                In data: {shipment.effectiveDeliveryDate.toLocaleString()}
                            </Text>
                    }
                </Group>
                :
                <Group>
                <IconX color="red"/>
                <Text>No spedizione</Text>
                </Group>
            }
        </>
    )
}

export default ShipmentDisplay