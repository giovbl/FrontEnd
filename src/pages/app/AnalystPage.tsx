import { useLoaderData, redirect, Link } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import { sampleStatusString, shipmentString } from "../../utils/utils";
import { useState } from "react";
import WorkgroupInfo from "../../components/data/WorkgroupInfo";
import ShipmentDisplay from "../../components/data/ShipmentDisplay";
import AnalysisState from "../../components/data/AnalysisState";
import type { AxiosError } from "axios";
import type { SampleInfo } from "../../utils/types";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RefertoForm from "../../components/forms/RefertoForm";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('sample?oncologiWorkgroup=1')
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

function AnalystPage(){

    const [odata,setOdata] = useState(useLoaderData() as Array<SampleInfo>)
    const [data,setData] = useState(odata)
    const [sampleId,setSampleId] = useState(-1)

    const [opened, { open, close }] = useDisclosure(false);

    //Function for correctly updating page's data
    function setAllData(newData:Array<SampleInfo>){
        setOdata(newData)
        setData(newData)
    }

    //Function for handling referto creation
    function refCreate(sampleId:number){
        setSampleId(sampleId),
        open()
    }

    //Function implementing DataTable's search function
    function search(query:string){

        if(!query){
            setData(odata)
            return
        }

        setData(data.filter((itm) =>
            String(itm.id).includes(query) ||
            itm.oncologiWorkgroup.facility.nome.toLowerCase().includes(query) ||
            itm.oncologiWorkgroup.groupName.toLowerCase().includes(query) ||
            itm.patient.toLowerCase().includes(query) ||
            shipmentString(itm.shipment?.status).toLowerCase().includes(query) ||
            sampleStatusString(itm.analysisStat).toLowerCase().includes(query)
        ))
    }

    const cols = ['Campione (ID)','Centro oncologico','Spedizione','Stato analisi']
    const rows = data.map((itm)=>[
            <Link key={`${itm.id}.1`} to={"/sample/"+String(itm.id)} state={itm}>{itm.id}</Link>,
            <WorkgroupInfo key={`${itm.id}.2`} workgroup={itm.oncologiWorkgroup.groupName} facility={itm.oncologiWorkgroup.facility.nome}/>,
            <ShipmentDisplay key={`${itm.id}.3`} sampleId={itm.id} shipment={itm.shipment} strfun={shipmentString} courierUsed={itm.isCourierUsed}/>,
            <AnalysisState key={`${itm.id}.4`} sampleid={itm.id} status={itm.analysisStat} shipping={itm.shipment?.status != 'arrived' && itm.isCourierUsed} data={odata} setData={setAllData} createfun={refCreate}/>
        ])
        console.log(odata)

    return (
        <>
            <Modal size="auto" opened={opened} onClose={close} title={`Creazione referto (per campione id: ${sampleId})`}>
                <RefertoForm sampleId={sampleId}/>
            </Modal>

            <DataTable cols={cols} rows={rows} searchfun={search}/>
        </>
    )
}

export default AnalystPage