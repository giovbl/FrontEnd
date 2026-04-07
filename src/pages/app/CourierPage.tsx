import { useLoaderData, redirect } from "react-router-dom";

import DataTable from "../../components/DataTable";

import api from "../../utils/api";
import { shipmentString } from "../../utils/utils";
import ShipmentAddress from "../../components/data/ShipmentAddress";
import ShipmentState from "../../components/data/ShipmentState";
import { useRef, useState } from "react";
import { Text } from "@mantine/core";
import { AxiosError,isCancel } from "axios";
import type { ShipmentInfo } from "../../utils/types";

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
        else if(err.status === 403)
            throw redirect("/")
        else
            throw err;
    }
}

function CourierPage(){

    const [odata,setOdata] = useState(useLoaderData() as Array<ShipmentInfo>)
    const [data,setData] = useState(odata)

    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)
    const controller = useRef(new AbortController())

    //Function for correctly updating page's data
    function setAllData(newData:Array<ShipmentInfo>){
        setOdata(newData)
        setData(newData)
    }

    //Function implementing DataTable's search function
    function search(query:string){

        setError(false)

        if(!query){
            setData(odata)
            return
        }

        if(controller.current)
            controller.current.abort()

        setLoading(true)
        controller.current = new AbortController()

        api.get('shipment?q='+encodeURIComponent(query),{
            signal: controller.current.signal
        }).then((res)=>{
            const rs = res.data as Array<ShipmentInfo>
            setData(rs.filter((itm)=>
                itm.id === itm.id ||
                shipmentString(itm.status).toLowerCase().includes(query)
            ))
            setLoading(false)
        }).catch((err)=>{console.log(err)
            if (!isCancel(err)){
                setData([])
                setError(true)
            }
            setLoading(false)
        })

        /*setData(data.filter((itm) =>
            String(itm.id).includes(query) ||
            itm.recipient.residenceCity.toLowerCase().includes(query) ||
            itm.recipient.cap.toLowerCase().includes(query) ||
            (itm.recipient.address+' '+itm.recipient.civicNumber).toLowerCase().includes(query) ||
            itm.sender.residenceCity.toLowerCase().includes(query) ||
            itm.sender.cap.toLowerCase().includes(query) ||
            (itm.sender.address+' '+itm.sender.civicNumber).toLowerCase().includes(query) ||
            shipmentString(itm.status).toLowerCase().includes(query) ||
            String(itm.sample).includes(query)
        ))*/
    }

    //Defining columns and rows to show
    const cols = ['Spedizione (ID)','Campione (ID)','Mittente','Destinatario','Stato spedizione']
    const rows = data.map((itm)=>[
            <Text key={`${itm.id}.1`}>{itm.id}</Text>,
            <Text key={`${itm.id}.2`}>{itm.sample}</Text>,
            <ShipmentAddress key={`${itm.id}.3`} facility={itm.sender}/>,
            <ShipmentAddress key={`${itm.id}.4`} facility={itm.recipient}/>,
            <ShipmentState key={`${itm.id}.5`} shipmentId={itm.id} status={itm.status} data={odata} setData={setAllData}/>
        ])
    
    return <DataTable cols={cols} rows={rows} searchfun={search}
                    error={error} loading={loading}/>
}

export default CourierPage