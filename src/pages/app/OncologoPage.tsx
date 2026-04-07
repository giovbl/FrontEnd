import { useLoaderData, redirect, Link } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import { Modal } from "@mantine/core";
import SampleForm from "../../components/forms/SampleForm";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useState } from "react";
import ShipmentForm from "../../components/forms/ShipmentForm";
import WorkgroupInfo from "../../components/data/WorkgroupInfo";
import ShipmentDisplay from "../../components/data/ShipmentDisplay";
import { sampleStatusString, shipmentString } from "../../utils/utils";
import AnalysisDisplay from "../../components/data/AnalysisDisplay";
import { AxiosError,isCancel } from "axios";
import type { SampleInfo } from "../../utils/types";

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
        else if(err.status === 403)
            throw redirect("/")
        else
            throw err;
    }
}

function OncologoPage(){

    const [sampleShip, setSampleShip] = useState<number | null>(null)

    const data = useLoaderData()
    const [tdata,setTData] = useState<Array<SampleInfo>>(data.samples)

    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)
    const controller = useRef(new AbortController())

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

        setError(false)

        if(!query){
            setTData(data.samples)
            return
        }

        if(controller.current)
            controller.current.abort()

        setLoading(true)
        controller.current = new AbortController()

        api.get('sample?analystWorkgroup=1&q='+encodeURIComponent(query),{
            signal: controller.current.signal
        }).then((res)=>{
            const rs = res.data as Array<SampleInfo>
            setTData(rs.filter((itm)=>
                itm.id === itm.id ||
                shipmentString(itm.shipment?.status).toLowerCase().includes(query) ||
                sampleStatusString(itm.analysisStat).toLowerCase().includes(query)
            ))
            setLoading(false)
        }).catch((err)=>{
            if (!isCancel(err)){
                setTData([])
                setError(true)
            }
            setLoading(false)
        })
    }

    //Defining columns and rows to show
    const cols = ['Campione (ID)','Paziente','Centro analisi','Spedizione','Analisi']
    const rows = tdata.map((itm)=>([
        <Link key={`${itm.id}.1`} to={"/sample/"+String(itm.id)} state={itm}>{itm.id}</Link>,
        <Link key={`${itm.id}.2`} to={"/patient/"+String(itm.patientId)}>{itm.patient}</Link>,
        <WorkgroupInfo key={`${itm.id}.3`} workgroup={itm.analystWorkgroup.groupName} facility={itm.analystWorkgroup.facility.nome}/>,
        <ShipmentDisplay key={`${itm.id}.4`} sampleId={itm.id} shipment={itm.shipment} courierUsed={itm.isCourierUsed} strfun={shipmentString} createShipment={createShipment}/>,
        <AnalysisDisplay key={`${itm.id}.5`} status={itm.analysisStat} refertoid={itm.referto} strfun={sampleStatusString}/>
    ]))

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
                showbtn btntext="Crea campione" btnfun={()=>{setForm('sample');open()}}
                error={error} loading={loading}/>
        </>
    )
}

export default OncologoPage