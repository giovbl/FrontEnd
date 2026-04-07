import { useLoaderData, redirect, useNavigate } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import { ActionIcon, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PatientForm from "../../components/forms/PatientForm";
import { useRef, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import type { Patient } from "../../utils/types";
import { isCancel, type AxiosError} from "axios";

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

    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)
    const controller = useRef(new AbortController())

    const navigate = useNavigate()
    const [opened, { open, close }] = useDisclosure(false);

    async function search(query:string){

        setError(false)

        if(!query){
            setData(odata)
            return
        }

        if(controller.current)
            controller.current.abort()

        setLoading(true)
        controller.current = new AbortController()

        api.get('patient?q='+encodeURIComponent(query),{
            signal: controller.current.signal
        }).then((res)=>{
            setData(res.data)
            setLoading(false)
        }).catch((err)=>{console.log(err)
            if (!isCancel(err)){
                setData([])
                setError(true)
            }
            setLoading(false)
        })
    }

    const cols = ['Codice fiscale','Nome','Cognome','Visualizza']
    const rows = data.map((itm,i)=>[
        <Text key={`${i}.1`}>{itm.fiscalCode}</Text>,
        <Text key={`${i}.2`}>{itm.name}</Text>,
        <Text key={`${i}.3`}>{itm.surname}</Text>,
        <ActionIcon key={`${i}.4`}
            variant="outline"
            aria-label="Visualizza"
            onClick={()=> navigate('/patient/'+String(itm.id),{state: itm})}>
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
                showbtn btntext="Crea paziente" btnfun={open}
                error={error} loading={loading}/>
        </>
    )
}

export default PatientsPage