import { Text,Group } from "@mantine/core"


function ShipmentAddress({facility}:{facility:unknown}){

    return (
        <>
            <Group>
                <Text size="sm" fw={700}>
                    Città:
                </Text>
                <Text size="sm">
                    {
                        `${facility.cap} | `+
                        `${facility.residenceCity}(${facility.residenceProvince}),`+
                        facility.residenceRegion
                    }
                </Text>
            </Group>
            <Group>
                <Text size="sm" fw={700}>
                    Indirizzo:
                </Text>
                <Text size="sm">
                {`${facility.address}, ${facility.civicNumber}`}
            </Text>
            </Group>
        </>
    )
}

export default ShipmentAddress