import { useState } from "react"
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"

import { Box, Button, NativeSelect, Stack, Alert } from "@mantine/core"

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import api from "../../utils/api"

import type { Facility, UserData, UserType } from "../../utils/types"
import { IconAlertTriangle } from "@tabler/icons-react"

const schema = z.object({
  workgroup:z.string().nonempty("Inserire un workgroup")
})
type WorkgroupData = z.infer<typeof schema>

interface WorkGroupFormType{
    facilities:Array<Facility>,
    user: UserData
}

function WorkGroupForm({facilities, user}: WorkGroupFormType) {

    const [facility, setFacility] = useState(facilities[0].id)
    const [failed, setFailed] = useState(false)

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<WorkgroupData>({
        resolver: zodResolver(schema)
    })

    function userWorkgroup(type:UserType){
        switch(type) {
            case 'Oncologo':
                return 'oncologo'
            case 'Analista':
                return 'analyst'
            default:
                return ''
        }
    }

    const onSubmit: SubmitHandler<WorkgroupData> = (data:WorkgroupData) =>{

        setFailed(false)

        api.patch('user/workgroup',{
            workgroup:Number(data.workgroup)
        }).then(() =>{
            navigate('/')
        }).catch((err) =>{
            if(err.status === 401)
                navigate('/auth/login')
            else
                setFailed(true)
        })
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <NativeSelect 
                        label="Struttura"
                        onChange={(e)=>setFacility(Number(e.target.value))}>
                        {facilities &&
                            facilities.map((itm:Facility) =>(
                                <option key={itm.id} value={itm.id}>{itm.nome}</option>
                            ))
                        }
                    </NativeSelect>

                    <NativeSelect 
                        label="Workgroup" error={errors.workgroup?.message}
                        {...register('workgroup',{required:true})}>
                        {facilities &&
                            facilities.filter((itm) =>(
                                itm.id === facility
                            ))[0].workgroups.filter((itm)=>(
                                itm.groupType === userWorkgroup(user.userType)
                            )).map((itm) =>(
                                <option key={itm.id} value={itm.id}>{itm.groupName}</option>
                            ))
                        }
                    </NativeSelect>

                    <Button type="submit">Conferma scelta</Button>
                </Stack>
            </form>

            {failed && 
                <Alert variant="light" color="red" title={failed} icon={<IconAlertTriangle/>}/>
            }
        </Box>
    )
}

export default WorkGroupForm