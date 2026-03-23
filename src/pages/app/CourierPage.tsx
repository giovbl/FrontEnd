import { useLoaderData, redirect, useNavigation } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import Loading from "../../components/Loading";
import { shipmentString } from "../../utils/utils";
import ShipmentAddress from "../../components/data/ShipmentAddress";
import ShipmentState from "../../components/data/ShipmentState";
import { useState } from "react";
import { Text } from "@mantine/core";

//Loader for getting user's shippings
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('shipment')
        return res.data
    }catch(error){
        const err = error as AxiosError
                
        if(err.status === 401)
            throw redirect("/auth/login")
        else
            throw err;
    }
}

function CourierPage(){

    const odata = useLoaderData() as Array<unknown>
    const [data,setData] = useState(odata)
    const navigation = useNavigation()

    //Function implementing DataTable's search function
    function search(query:string){

        if(!query){
            setData(odata)
            return
        }

        setData(data.filter((itm) =>
            String(itm.id).includes(query) ||
            itm.recipient.residenceCity.toLowerCase().includes(query) ||
            itm.recipient.cap.toLowerCase().includes(query) ||
            (itm.recipient.address+' '+itm.recipient.civicNumber).toLowerCase().includes(query) ||
            itm.sender.residenceCity.toLowerCase().includes(query) ||
            itm.sender.cap.toLowerCase().includes(query) ||
            (itm.sender.address+' '+itm.sender.civicNumber).toLowerCase().includes(query) ||
            shipmentString(itm.status).toLowerCase().includes(query) ||
            String(itm.sample).includes(query)
        ))
    }

    //Defining columns and rows to show
    const cols = ['Spedizione (ID)','Campione (ID)','Mittente','Destinatario','Stato spedizione']
    const rows = data.map((itm)=>[
            <Text key={`${itm.id}.1`}>{itm.id}</Text>,
            <Text key={`${itm.id}.2`}>{itm.sample}</Text>,
            <ShipmentAddress key={`${itm.id}.3`} facility={itm.sender}/>,
            <ShipmentAddress key={`${itm.id}.4`} facility={itm.recipient}/>,
            <ShipmentState key={`${itm.id}.5`} shipmentId={itm.id} status={itm.status} data={data} setData={setData}/>
        ])
    
    if(navigation.state === 'loading')
        return <Loading/>
    else
        return <DataTable cols={cols} rows={rows} searchfun={search}/>
}

export default CourierPage