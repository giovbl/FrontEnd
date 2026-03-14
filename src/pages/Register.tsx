import RegisterForm from "../components/forms/RegisterForm"
import AllCenter from "../components/AllCenter"

import api from '../utils/api'
import { useLoaderData } from "react-router-dom"

//Loader for getting facilities and workgroup data
// eslint-disable-next-line react-refresh/only-export-components
export async function loader(){
    
    const res = await api.get('facility')

    return res.data
}

function Register(){

    const data = useLoaderData()

    return <RegisterForm facilities={data}/>
}

export default Register