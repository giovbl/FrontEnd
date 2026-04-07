import { Table,Button,Stack,Group,TextInput,Center, Alert, Skeleton } from "@mantine/core"
import { IconAlertTriangle, IconPlus, IconSearch } from "@tabler/icons-react"
import type { ReactElement } from "react"

interface DataTableInput{
    cols: Array<string>,
    rows: Array<Array<ReactElement>>,
    error?: boolean,
    loading?: boolean,
    showbtn?: boolean,
    btntext?:string,
    btnfun?: ()=>void
    searchfun?: (query:string)=>void
}

function DataTable({rows,cols,error,loading,showbtn,btntext,btnfun,searchfun=()=>{}}:DataTableInput){

    return (
        <Stack>
            <Center>
                {showbtn?
                    <Group>
                        <Button
                            leftSection={<IconPlus/>}
                            variant="default"
                            onClick={btnfun?()=>btnfun():()=>{}}>
                            {btntext}
                        </Button>
                        
                        <TextInput
                            leftSection={<IconSearch/>}
                            placeholder="Cerca"
                            onChange={(e)=>searchfun(e.target.value.toLowerCase())}/>
                    </Group>
                    :
                    <TextInput
                        leftSection={<IconSearch/>}
                        placeholder="Cerca"
                        onChange={(e)=>searchfun(e.target.value.toLowerCase())}/>
                }   
            </Center>

            {error &&
                <Alert variant="light" color="red" title="Errore nel caricamento dati" icon={<IconAlertTriangle/>}/>
            }
            
            {loading?
                <Skeleton visible h={400}/>
                :
                <Table striped withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {cols.map((col)=><Table.Th key={col}>{col}</Table.Th>)}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {rows.map((row,i)=>(
                            <Table.Tr key={i}>
                                {row.map((el)=>(<Table.Td key={`${i}.${el.key}`}>{el?el:""}</Table.Td>))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            }
        </Stack>
    )
}

export default DataTable