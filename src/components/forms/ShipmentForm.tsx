import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Button, Alert, Box, NativeSelect, Space, Text } from '@mantine/core';
import {IconAlertTriangle} from '@tabler/icons-react'

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { Link, useNavigate } from 'react-router-dom';

import api from '../../utils/api'
import ErrorDisplay from '../Error';
import Loading from '../Loading';
import type { UserData } from '../../utils/types';

const schema = z.object({
  courier: z.number().nonoptional("Inserire un corriere")
})
type ShipmentCreation = z.infer<typeof schema>

interface ShipmentFormInput{
    sampleId: number
}

function ShipmentForm({sampleId}:ShipmentFormInput){

    const [loading,setLoading] = useState(true)
    const [failed,setFailed] = useState(false)

    const [couriers,setCouriers] = useState<Array<UserData> | null>(null)
    const [fetchFailed,setFetchFailed] = useState(false)

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ShipmentCreation>({
        resolver: zodResolver(schema)
    })

    //Fetching dei corrieri disponibili
    useEffect(()=>{
        api.get('user?type=courier').then((res) =>{
            setCouriers([res.data])
        }).catch(()=>{
            setFetchFailed(true)
        }).finally(()=>{
            setLoading(false)
        })
    },[])

    /*
        Function for handling sent form data
    */
    const onSubmit: SubmitHandler<ShipmentCreation> = (data:ShipmentCreation) =>{

        setFailed(false)

        api.post('/auth/login', {
        
        })
        .then(() => {
            navigate(0)
        })
        .catch(() =>{
        setFailed(true)
        })

    }

    if(fetchFailed){
        return (
            <ErrorDisplay
                width={100}
                iconSize={50} 
                textSize="md"
                text="Si è verificato un errore"/>
        )
    }
    else if(loading){
        return <Loading/>
    }

    return (
        <Box>
        <form onSubmit={handleSubmit(onSubmit)}>

            <Text>Spedizione per campione ID: {sampleId}</Text>

            <NativeSelect
            label="Seleziona corriere"
            error={errors.courier?.message}
            {...register('courier',{required:true})}>
            {couriers &&
                couriers.map((itm)=>
                    <option key={itm.id} value={itm.id}>{itm.fullname}</option>
                )
            }
            </NativeSelect>

            <Space h="md"/>

            {failed && 
            <>
            <Alert variant="light" color="red" title="Errore durante la creazione" icon={<IconAlertTriangle/>}/>
            <Space h="md"/>
            </>
            }

            <Button type='submit'>Crea spedizione</Button>
        </form>
        </Box>
    )
}

export default ShipmentForm