import { useEffect, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { Button, Alert, Box, NativeSelect, Space, Text, Group } from '@mantine/core';
import {IconAlertTriangle, IconTestPipe2} from '@tabler/icons-react'

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { useNavigate } from 'react-router-dom';

import api from '../../utils/api'
import ErrorDisplay from '../Error';
import Loading from '../Loading';
import type { UserData } from '../../utils/types';
import { DateInput } from '@mantine/dates';

const schema = z.object({
  courier: z.string().nonempty("Scelgiere un corriere"),
  expected: z.string().nonempty("Inserire una data").nonoptional("Inserire una data")
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
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<ShipmentCreation>({
        resolver: zodResolver(schema)
    })

    //Fetching dei corrieri disponibili
    useEffect(()=>{
        api.get('user/courier').then((res) =>{
            setCouriers(res.data)
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

        api.post(`/sample/${sampleId}/ship`, {
            sample: sampleId,
            courier: Number(data.courier),
            expectedTakenDate: new Date(data.expected)
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

            <Group>
                <IconTestPipe2/>
                <Text>ID: {sampleId}</Text>
            </Group>

            <Space h="md"/>

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

            <Controller
                control={control}
                name="expected"
                rules={{ required: true }}
                render={({ field }) => {
                    return (
                        <DateInput
                            label="Data preferita di ritiro"
                            placeholder='Scegliere una data'
                            minDate={new Date((new Date()).getTime() + 1 * 24 * 60 * 60 * 1000)}
                            error={errors.expected?.message}
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                        />
                    );
                }}
            />

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