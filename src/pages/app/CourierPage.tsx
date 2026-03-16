import { useLoaderData, redirect } from "react-router-dom";

import DataTable from "../../components/datatable/DataTable";

import api from "../../utils/api";

//Loader for getting user's shippings
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('shipment')
        console.log(res.data)
        return res.data
    }catch(err){
        if(err.status === 401)
            throw redirect("auth/login")
        else
            throw err;
    }
}

function CourierPage(){

    const samples = useLoaderData()
    
    return <DataTable type="shipment" data={samples}/>
}

export default CourierPage