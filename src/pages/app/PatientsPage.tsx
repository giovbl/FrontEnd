import { useLoaderData, redirect, useNavigation } from "react-router-dom";

import DataTable from "../../components/datatable/DataTable";

import api from "../../utils/api";
import Loading from "../../components/Loading";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PatientForm from "../../components/forms/PatientForm";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('patient')
        return res.data
    }catch(err){
        if(err.status === 401)
            throw redirect("/auth/login")
        else if(err.status === 403)
            throw redirect("/")
        else
            throw err;
    }
}

function PatientsPage(){

    const patients = useLoaderData()
    const navigation = useNavigation()

    const [opened, { open, close }] = useDisclosure(false);
    
    if(navigation.state === 'loading')
        return <Loading/>
    else
        return (
            <>
                <Modal opened={opened} onClose={close} title="Creazione paziente">
                    <PatientForm/>
                </Modal>

                <DataTable type="patient" data={patients} btnfun={open}/>
            </>
        )
}

export default PatientsPage