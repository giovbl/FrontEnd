import { useLoaderData, redirect, useNavigation } from "react-router-dom";

import DataTable from "../../components/datatable/DataTable";

import api from "../../utils/api";
import Loading from "../../components/Loading";
import { Modal } from "@mantine/core";
import SampleForm from "../../components/forms/SampleForm";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ShipmentForm from "../../components/forms/ShipmentForm";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const sres = await api.get('sample?analystWorkgroup=1')
        const fres = await api.get('facility')

        return {samples: sres.data,facilities: fres.data}
    }catch(err){
        if(err.status === 401)
            throw redirect("/auth/login")
        else
            throw err;
    }
}

function OncologoPage(){

    const data = useLoaderData()
    const navigation = useNavigation()

    const [form, setForm] = useState('sample')

    const [opened, { open, close }] = useDisclosure(false);

    if(navigation.state === 'loading')
        return <Loading/>
    else
        return (
            <>
                <Modal opened={opened} onClose={close} title={`Creazione ${form==='ship'?'spedizione':'campione'}`}>
                    {form === 'sample'?
                        <SampleForm facilities={data.facilities}/>
                        :
                        <ShipmentForm sampleId={1}/>
                    }
                </Modal>

                <DataTable type="sampleOncologo" data={data.samples} btnfun={()=>{setForm('sample');open()}} secbtnfun={()=>{setForm('ship');open()}}/>
            </>
        )
}

export default OncologoPage