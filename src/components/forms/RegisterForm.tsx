import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { PasswordInput,TextInput,Button,Stack,Divider,Text,Paper,Alert,NativeSelect } from '@mantine/core';
import {IconAt, IconLock, IconAlertTriangle} from '@tabler/icons-react'

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { NavLink, useNavigate } from 'react-router-dom';

import api from '../../utils/api'

const schema = z.object({
  fullname: z.string().nonempty("Inserire un nome"),
  email: z.email("Email non corretta"),
  password: z.string().nonempty("Inserire una password"),
  type: z.string().nonempty("Inserire un tipo")
})

function RegisterForm(){

  const [failed, setFailed] = useState(false)
  const [userExsists, setUserExsists] = useState(false)
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

    if(data.type === 'null'){
      return;
    }

    api.post('/auth/register', {
      fullname: data.fullname,
      email: data.email,
      pwd: data.password,
      userType: data.type
    })
    .then(() => {
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
                      required:true})}>
                  <option key='null' value='null'>Seleziona un opzione</option>
                  <option key="Oncologo" value="Oncologo">Oncologo</option>
                  <option key="Corriere" value="Corriere">Corriere</option>
                  <option key="Analista" value="Analista">Analista</option>
                </NativeSelect>

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