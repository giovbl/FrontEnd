import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { PasswordInput,TextInput,Button,Stack,Divider,Text,Paper,Alert,NativeSelect } from '@mantine/core';
import {IconAt, IconLock, IconAlertTriangle} from '@tabler/icons-react'

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { NavLink, useNavigate } from 'react-router-dom';

import api from '../../utils/api'
import { type Facility } from '../../utils/types';

const schema = z.object({
  fullname: z.string().nonempty("Inserire un nome"),
  email: z.email("Email non corretta"),
  password: z.string().nonempty("Inserire una password"),
  type: z.string().nonempty("Inserire un tipo"),
  workgroup: z.string()
})

function RegisterForm({facilities}: {facilities:Array<Facility>}){

  const [failed, setFailed] = useState(false)
  const [userExsists, setUserExsists] = useState(false)
  const [wgFilter,setWgFilter] = useState('Oncologo')
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({
    resolver: zodResolver(schema)
  })
  type RegisterData = z.infer<typeof schema>

  /*
    Function for handling sent form data
  */
  const onSubmit:SubmitHandler<RegisterData> = (data:RegisterData) =>{

    setFailed(false)
    setUserExsists(false)

    if(data.type != 'Corriere' && 
      data.workgroup === 'Seleziona un workgroup'){
      return;
    }

    api.post('/auth/register', {
      fullname: data.fullname,
      email: data.email,
      pwd: data.password,
      userType: data.type,
      workgroup:Number(data.workgroup)
    })
    .then((res) => {

      console.log(res)

      navigate('/auth/login?reg=true')
    })
    .catch((error) =>{
      if(error.status === 409)
        setUserExsists(true)
      else
        setFailed(true)
    })

  }

  /*
    Form UI
  */
  return (
        <Paper shadow="xs" p="xl" withBorder>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>

                <TextInput 
                    label='Nome'
                    error={errors.fullname?.message}
                    {...register('fullname',{required: true})}
                />

                <TextInput
                    label='Email' 
                    placeholder="alias@domain.com"
                    leftSection={<IconAt/>}
                    error={errors.email?.message}
                    {...register('email',{required: true})}
                />

                <PasswordInput
                    label="Password" 
                    leftSection={<IconLock/>}
                    error={errors.password?.message}
                    {...register('password',{required: true})}
                />

                <NativeSelect label="Tipo di utente"
                    {...register('type',{
                      required:true,
                      onChange: (e) => {setWgFilter(()=>e.target.value)}
                    })}>
                  <option key="Oncologo" value="Oncologo">Oncologo</option>
                  <option key="Corriere" value="Corriere">Corriere</option>
                  <option key="Analista" value="Analista">Analista</option>
                </NativeSelect>

                { wgFilter === 'Corriere'?
                    <NativeSelect label="Workgroup" disabled
                      {...register('workgroup')}>
                        <option>Seleziona un workgroup</option>      
                    </NativeSelect>
                    :
                    <NativeSelect label="Workgroup" error={errors.workgroup?.message}
                      {...register('workgroup')}>
                        <option>Seleziona un workgroup</option>
              
                        {facilities && facilities.map((facility:Facility) => (
                            <optgroup key={facility.id} label={facility.nome}>
                                {
                                facility.workgroups.filter(
                                  (wgi) => wgi.groupType === (wgFilter === 'Oncologo'? 'oncologo': 'analyst')
                                  ).map((wg) => (
                                    <option key={wg.id} value={wg.id}>{wg.groupName}</option>
                                  ))
                                }
                            </optgroup>         
                        ))}         
                    </NativeSelect>
                }

                <Button type='submit'>Registrati</Button>

                {failed && 
                <Alert variant="light" color="red" title="Errore al server" icon={<IconAlertTriangle/>}/>
                }
                {userExsists && 
                <Alert variant="light" color="red" title="Account esistente" icon={<IconAlertTriangle/>}/>
                }
            </Stack>
          </form>

            <Divider my="md" />

            <Text>
              Hai già un account?{' '}
              <NavLink to="/auth/login">
                Login
              </NavLink>
            </Text>
      </Paper>
  )

}

export default RegisterForm