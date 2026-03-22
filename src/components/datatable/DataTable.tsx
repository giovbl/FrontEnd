import { Table,ActionIcon,Button,Stack,Group,TextInput,Center } from "@mantine/core"
import { IconEye, IconPlus, IconSearch } from "@tabler/icons-react"

import { useState } from "react"
import {useNavigate, Link} from 'react-router-dom'

import AnalysisDisplay from "./AnalysisDisplay"
import ShipmentDisplay from "./ShipmentDisplay"
import WorkgroupInfo from "./WorkgroupInfo"
import AnalysisState from "./AnalysisState"
import ShipmentAddress from "./ShipmentAddress"
import ShipmentState from "./ShipmentState"

interface DataTableInput{
    type: 'sampleOncologo' | 'sampleAnalyst' | 'patient' | 'shipment',
    data: Array<unknown>
    btnfun?: ()=>void
    secbtnfun?: ()=>void
}

function DataTable({type,data,btnfun=()=>{},secbtnfun=()=>{}}:DataTableInput){

    const navigate = useNavigate()

    const [tdata, setTdata] = useState(data)

    //Function for generating a displayable string based on the sample status
    function sampleStatusString(status:string): string {

        switch(status) {
            case 'unanalyzed':
                return 'Da analizzare'
            case 'analyzing':
                return 'In analisi'
            case 'completed':
                return 'Visualizza referto'
            default:
                return ''
        }
    }

    //Function for generating a displayable string based on the shippping status
    function shippingString(status:string): string {

        switch(status) {
            case 'received':
                return 'In carico'
            case 'taken':
                return 'Preso'
            case 'in transit':
                return 'In transito'
            case 'arrived':
                return 'Arrivato'
            default:
                return ''
        }
    }

    //Function for filtering data (search functionality)
    function search(e: React.ChangeEvent<HTMLInputElement>){
        const query = e.target.value.toLowerCase()

        if(!query){
            setTdata(data)
            return
        }

        switch(type) {
            case 'patient':
                setTdata(data.filter((itm) =>
                    (itm.name+' '+itm.surname).toLowerCase().includes(query) ||
                    itm.fiscalCode.toLowerCase().includes(query)
                ))
                break;
            case 'sampleOncologo':
                setTdata(data.filter((itm) =>
                    String(itm.id).includes(query) ||
                    itm.analystWorkgroup.facility.nome.toLowerCase().includes(query) ||
                    itm.analystWorkgroup.groupName.toLowerCase().includes(query) ||
                    itm.patient.toLowerCase().includes(query) ||
                    shippingString(itm.shipping?.status).toLowerCase().includes(query) ||
                    sampleStatusString(itm.analysisStat).toLowerCase().includes(query)
                ))
                break;
            case 'sampleAnalyst':
                setTdata(data.filter((itm) =>
                    String(itm.id).includes(query) ||
                    itm.oncologiWorkgroup.facility.nome.toLowerCase().includes(query) ||
                    itm.oncologiWorkgroup.groupName.toLowerCase().includes(query) ||
                    itm.patient.toLowerCase().includes(query) ||
                    shippingString(itm.shipping?.status).toLowerCase().includes(query) ||
                    sampleStatusString(itm.analysisStat).toLowerCase().includes(query)
                ))
                break;
            case 'shipment':
                setTdata(data.filter((itm) =>
                    String(itm.id).includes(query) ||
                    itm.recipient.residenceCity.toLowerCase().includes(query) ||
                    itm.recipient.cap.toLowerCase().includes(query) ||
                    (itm.recipient.address+' '+itm.recipient.civicNumber).toLowerCase().includes(query) ||
                    itm.sender.residenceCity.toLowerCase().includes(query) ||
                    itm.sender.cap.toLowerCase().includes(query) ||
                    (itm.sender.address+' '+itm.sender.civicNumber).toLowerCase().includes(query) ||
                    shippingString(itm.status).toLowerCase().includes(query) ||
                    String(itm.sample).includes(query)
                ))
                break;
            default:
                break;
        }

    }

    return (
        <Stack>
            <Center>
                {(type === 'sampleOncologo' || type === 'patient')?
                    <Group>
                        <Button
                            leftSection={<IconPlus/>}
                            variant="default"
                            onClick={()=>btnfun()}>
                            {type === 'sampleOncologo'? "Crea campione":"Crea paziente"}
                        </Button>
                        
                        <TextInput
                            leftSection={<IconSearch/>}
                            placeholder="Cerca"
                            onChange={search}/>
                    </Group>
                    :
                    <TextInput
                        leftSection={<IconSearch/>}
                        placeholder="Cerca"
                        onChange={search}/>
                }   
            </Center>
            
            <Table striped withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                    {type === 'patient' &&
                        <>
                            <Table.Th>Codice fiscale</Table.Th>
                            <Table.Th>Nome</Table.Th>
                            <Table.Th>Cognome</Table.Th>
                            <Table.Th>Visualizza</Table.Th>
                        </>
                    }
                    {type === 'sampleOncologo' &&
                        <>
                            <Table.Th>Id campione</Table.Th>
                            <Table.Th>Paziente</Table.Th>
                            <Table.Th>Centro analisi</Table.Th>
                            <Table.Th>Spedizione</Table.Th>
                            <Table.Th>Analisi</Table.Th>
                        </>
                    }
                    {type === 'sampleAnalyst' &&
                        <>
                            <Table.Th>Id campione</Table.Th>
                            <Table.Th>Centro oncologico</Table.Th>
                            <Table.Th>Spedizione</Table.Th>
                            <Table.Th>Stato analisi</Table.Th>
                        </>
                    }
                    {type === 'shipment' &&
                        <>
                            <Table.Th>Id spedizione</Table.Th>
                            <Table.Th>Id campione</Table.Th>
                            <Table.Th>Mittente</Table.Th>
                            <Table.Th>Destinatario</Table.Th>
                            <Table.Th>Stato spedizione</Table.Th>
                        </>
                    }
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {tdata && type === 'patient' &&
                        tdata.map((itm) => (
                            <Table.Tr key={itm.fiscalCode}>
                                <Table.Td>{itm.fiscalCode}</Table.Td>
                                <Table.Td>{itm.name}</Table.Td>
                                <Table.Td>{itm.surname}</Table.Td>
                                <Table.Td>
                                    <ActionIcon 
                                        variant="outline" 
                                        aria-label="Visualizza"
                                        onClick={()=> navigate('/patient/'+itm.fiscalCode,{state: itm})}>
                                            <IconEye/>
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }
                    {tdata && type === 'sampleOncologo' &&
                        tdata.map((itm) => (
                            <Table.Tr key={itm.id}>
                                <Table.Td>
                                    <Link to={"/sample/"+String(itm.id)}
                                          state={itm}>
                                        {itm.id}
                                    </Link>
                                </Table.Td>
                                <Table.Td>
                                    <Link to={"/patient/"+itm.patient}>
                                        {itm.patient}
                                    </Link>
                                </Table.Td>
                                <Table.Td>
                                    <WorkgroupInfo 
                                        workgroup={itm.analystWorkgroup.groupName}
                                        facility={itm.analystWorkgroup.facility.nome}/>
                                </Table.Td>
                                <Table.Td>
                                    <ShipmentDisplay 
                                        shipment={itm.shipment}
                                        courierUsed={itm.isCourierUsed}
                                        strfun={shippingString}
                                        createShipment={secbtnfun}/>
                                </Table.Td>
                                <Table.Td>
                                    <AnalysisDisplay 
                                        status={itm.analysisStat}
                                        refertoid={itm.referto}
                                        strfun={sampleStatusString}/>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }
                    {tdata && type === 'sampleAnalyst' &&
                        tdata.map((itm) => (
                            <Table.Tr key={itm.id}>
                                <Table.Td>
                                   <Link to={"/sample/"+String(itm.id)}
                                          state={itm}>
                                        {itm.id}
                                    </Link>
                                </Table.Td>
                                <Table.Td>
                                    <WorkgroupInfo 
                                        workgroup={itm.oncologiWorkgroup.groupName}
                                        facility={itm.oncologiWorkgroup.facility.nome}/>
                                </Table.Td>
                                <Table.Td>
                                    <ShipmentDisplay 
                                        shipment={itm.shipment}
                                        strfun={shippingString}
                                        courierUsed={itm.isCourierUsed}/>
                                </Table.Td>
                                <Table.Td>
                                    <AnalysisState 
                                        sampleid={itm.id} 
                                        status={itm.analysisStat}
                                        data={tdata}
                                        setData={setTdata}/>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }
                    {tdata && type === 'shipment' &&
                        tdata.map((itm) => (
                            <Table.Tr key={itm.id}>
                                <Table.Td>
                                    {itm.id}
                                </Table.Td>
                                <Table.Td>
                                    {itm.sample}
                                </Table.Td>
                                <Table.Td>
                                    <ShipmentAddress facility={itm.sender}/>
                                </Table.Td>
                                <Table.Td>
                                    <ShipmentAddress facility={itm.recipient}/>
                                </Table.Td>
                                <Table.Td>
                                    <ShipmentState
                                        shipmentId={itm.id}
                                        status={itm.status}
                                        data={tdata}
                                        setData={setTdata}/>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    }
                </Table.Tbody>
            </Table>
        </Stack>
    )
}

export default DataTable