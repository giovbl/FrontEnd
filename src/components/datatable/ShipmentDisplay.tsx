import {Group,Text,Box} from '@mantine/core'
import {IconCheck, IconCheckupList, IconTruckLoading, IconTruckDelivery, IconPackageOff, IconClockQuestion } from '@tabler/icons-react'
import type { ShipmentStatus } from '../../utils/types'

export interface ShipmentDisplayInput{
    shipment: unknown,
    courierUsed: boolean,
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

function ShipmentDisplay({shipment,courierUsed,strfun}:ShipmentDisplayInput){
    
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
    )
}

export default ShipmentDisplay