import { useLoaderData, redirect, useNavigate } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import { ActionIcon, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PatientForm from "../../components/forms/PatientForm";
import { useState } from "react";
import { IconEye } from "@tabler/icons-react";
import type { Patient } from "../../utils/types";
import type { AxiosError } from "axios";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('patient')
        return res.data
    }catch(error){
        const err = error as AxiosError
        
        if(err.status === 401)
            throw redirect("/auth/login")
        else if(err.status === 403)
            throw redirect("/")
        else
            throw err;
    }
}

function PatientsPage(){

    const odata = useLoaderData() as Array<Patient>
    const [data,setData] = useState(odata)

    const navigate = useNavigate()
    const [opened, { open, close }] = useDisclosure(false);

    function search(query:string){

        if(!query){
            setData(data)
            return
        }

        setData(data.filter((itm) =>
            (itm.name+' '+itm.surname).toLowerCase().includes(query) ||
            itm.fiscalCode.toLowerCase().includes(query)
        ))
    }

    const cols = ['Codice fiscale','Nome','Cognome','Visualizza']
    const rows = data.map((itm,i)=>[
        <Text key={`${i}.1`}>{itm.fiscalCode}</Text>,
        <Text key={`${i}.2`}>{itm.name}</Text>,
        <Text key={`${i}.3`}>{itm.surname}</Text>,
        <ActionIcon key={`${i}.4`}
            variant="outline" 
            aria-label="Visualizza"
            onClick={()=> navigate('/patient/'+itm.fiscalCode,{state: itm})}>
                <IconEye/>
        </ActionIcon>
    ])
    
    return (
        <>
            <Modal opened={opened} onClose={close} title="Creazione paziente">
                <PatientForm/>
            </Modal>

            <DataTable 
                cols={cols} rows={rows} searchfun={search}
                showbtn btntext="Crea paziente" btnfun={open}/>
        </>
    )
}

export default PatientsPage