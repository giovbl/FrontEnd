import { useEffect, useState } from "react";
import PatientForm from "../../../components/forms/PatientForm";
import Loading from "../../../components/LoadingLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import { Alert, Box, Button, Space } from "@mantine/core";
import { IconArrowLeft, IconUserX } from "@tabler/icons-react";

function PatientPage(){

    const [patient, setPatient] = useState(null)
    const [existence,setExistence] = useState(true)
    const [loading,setLoading] = useState(true)

    const loc = useLocation()
    const params = useParams();
    const navigate = useNavigate()

    useEffect(()=>{

        if(!loc.state)
            api.get('patient/'+ (params.id?params.id:"")).then((res)=>{
                setPatient(res.data)
                setLoading(false)
            }).catch((err) =>{
                if(err.status === 404)
                    setExistence(false)
                setLoading(false)
            })
    },[])

    if(patient === null && loc.state){
        setPatient(loc.state)
        setLoading(false)
    }

    return(
        <Box>
            <Button 
                leftSection={<IconArrowLeft/>} 
                variant="default"
                onClick={()=>navigate(-1)}>
                Torna indietro
            </Button>

            <Space h='xl'/>

            {!existence &&
                <Alert variant="light" color="red" title="Paziente non esistente" icon={<IconUserX/>}/>
            }

            {loading?
                <Loading/>
                :
                <PatientForm readonly data={(patient!=null)?patient:undefined}/>
            }

        </Box>
    )
}

export default PatientPage