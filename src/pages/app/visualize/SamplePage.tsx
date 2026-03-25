import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useLocation, useNavigate, useNavigation, useParams } from "react-router-dom";
import api from "../../../utils/api";
import { Alert, Box, Button, Space } from "@mantine/core";
import { IconArrowLeft, IconUserX } from "@tabler/icons-react";
import SampleForm from "../../../components/forms/SampleForm";

function SamplePage(){

    const [sample, setSample] = useState(null)
    const [existence,setExistence] = useState(true)
    const [loading,setLoading] = useState(true)

    const loc = useLocation()
    const params = useParams();
    const navigate = useNavigate()
    const navigation = useNavigation()

    useEffect(()=>{

        if(!loc.state)
            api.get('sample/'+ (params.id?params.id:"")).then((res)=>{
                setSample(res.data)
                setLoading(false)
            }).catch((err) =>{
                if(err.status === 404)
                    setExistence(false)
                setLoading(false)
            })
    },[])

    if(sample === null && loc.state){
        setSample(loc.state)
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

            {!existence?
                <Alert variant="light" color="red" title="Campione non esistente" icon={<IconUserX/>}/>
                :
                <>
                    {loading || navigation.state === 'loading'?
                        <Loading/>
                        :
                        <SampleForm readonly data={(sample!=null)?sample:undefined}/>
                    }
                </>
            }

        </Box>
    )
}

export default SamplePage