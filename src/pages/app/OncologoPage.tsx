import { useLoaderData, redirect, useNavigation } from "react-router-dom";

import DataTable from "../../components/datatable/DataTable";

import api from "../../utils/api";
import Loading from "../../components/Loading";

//Loader for getting user's samples
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    try{
        const res = await api.get('sample?analystWorkgroup=1')
        console.log(res.data)
        return res.data
    }catch(err){
        if(err.status === 401)
            throw redirect("/auth/login")
        else
            throw err;
    }
}

function OncologoPage(){

    const samples = useLoaderData()
    const navigation = useNavigation()

    if(navigation.state === 'loading')
        return <Loading/>
    else
        return <DataTable type="sampleOncologo" data={samples}/>
}

export default OncologoPage