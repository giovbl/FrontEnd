import { useLoaderData, redirect, useNavigation, Link } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import Loading from "../../components/Loading";
import { Modal } from "@mantine/core";
import SampleForm from "../../components/forms/SampleForm";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ShipmentForm from "../../components/forms/ShipmentForm";
import WorkgroupInfo from "../../components/data/WorkgroupInfo";
import ShipmentDisplay from "../../components/data/ShipmentDisplay";
import { sampleStatusString, shipmentString } from "../../utils/utils";
import AnalysisDisplay from "../../components/data/AnalysisDisplay";
import type { AxiosError } from "axios";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const sres = await api.get('sample?analystWorkgroup=1')
        const fres = await api.get('facility')

        return {samples: sres.data,facilities: fres.data}
    }catch(error){
        const err = error as AxiosError
                
        if(err.status === 401)
            throw redirect("/auth/login")
        else
            throw err;
    }
}

function OncologoPage(){

    const [sampleShip, setSampleShip] = useState<number | null>(null)

    const data = useLoaderData()
    const [tdata,setTData] = useState(data.samples)

    const navigation = useNavigation()

    const [form, setForm] = useState('sample')

    const [opened, { open, close }] = useDisclosure(false);

    //Function for letting the user create a shipment for a sample
    function createShipment(sampleId:number){
        setForm('ship')
        setSampleShip(sampleId)
        open()
    }

    //Function implementing DataTable's search function
    function search(query:string){
        
        if(!query){
            setTData(data.samples)
            return
        }

        setTData(tdata.filter((itm) =>
            String(itm.id).includes(query) ||
            itm.analystWorkgroup.facility.nome.toLowerCase().includes(query) ||
            itm.analystWorkgroup.groupName.toLowerCase().includes(query) ||
            itm.patient.toLowerCase().includes(query) ||
            shipmentString(itm.shipping?.status).toLowerCase().includes(query) ||
            sampleStatusString(itm.analysisStat).toLowerCase().includes(query)
        ))
    }

    //Defining columns and rows to show
    const cols = ['Campione (ID)','Paziente','Centro analisi','Spedizione','Analisi']
    const rows = tdata.map((itm)=>([
            <Link key={`${itm.id}.1`} to={"/sample/"+String(itm.id)} state={itm}>{itm.id}</Link>,
            <Link key={`${itm.id}.2`} to={"/patient/"+itm.patient}>{itm.patient}</Link>,
            <WorkgroupInfo key={`${itm.id}.3`} workgroup={itm.analystWorkgroup.groupName} facility={itm.analystWorkgroup.facility.nome}/>,
            <ShipmentDisplay key={`${itm.id}.4`} sampleId={itm.id} shipment={itm.shipment} courierUsed={itm.isCourierUsed} strfun={shipmentString} createShipment={createShipment}/>,
            <AnalysisDisplay key={`${itm.id}.5`} status={itm.analysisStat} refertoid={itm.referto} strfun={sampleStatusString}/>
    ]))

    if(navigation.state === 'loading')
        return <Loading/>
    else
        return (
            <>
                <Modal opened={opened} onClose={close} title={`Creazione ${form==='ship'?'spedizione':'campione'}`}>
                    {form === 'sample'?
                        <SampleForm facilities={data.facilities}/>
                        :
                        <ShipmentForm sampleId={sampleShip?sampleShip:-1}/>
                    }
                </Modal>

                <DataTable 
                    rows={rows} cols={cols} searchfun={search}
                    showbtn btntext="Crea campione" btnfun={()=>{setForm('sample');open()}}/>
            </>
        )
}

export default OncologoPage