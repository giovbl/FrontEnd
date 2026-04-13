import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { PasswordInput,TextInput,Button,Stack,Divider,Text,Paper,Alert } from '@mantine/core';
import {IconAt, IconLock, IconAlertTriangle} from '@tabler/icons-react'

import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { Link, useNavigate } from 'react-router-dom';

import api from '../../utils/api'

const schema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty()
})
type LoginData = z.infer<typeof schema>


function LoginForm(){

  const [login, setLogin] = useState({failed:false,message:""})
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<LoginData>({
    resolver: zodResolver(schema)
  })

  /*
    Function for handling sent form data
  */
  const onSubmit: SubmitHandler<LoginData> = (data:LoginData) =>{

    setLoading(true)
    setLogin({failed:false,message:""})

    api.post('/auth/login', {
      email: data.email,
      pwd: data.password
    })
    .then((res) => {
      setLoading(false)

      if(res.data.failed)
        setLogin({failed:true,message: "Email o password invalidi"})

      if(res.data.requiresConfig)
        navigate('/user/setup')
      else
        navigate('/')
    })
    .catch(() =>{
      setLoading(false)
      setLogin({failed:true,message: "Errore al server"})
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

              {loading?
                <Button type='submit' loading loaderProps={{ type: 'dots' }}>Login</Button>
                :
                <Button type='submit'>Login</Button>
              }

              {login.failed && 
                <Alert variant="light" color="red" title={login.message} icon={<IconAlertTriangle/>}/>
              }
            </Stack>

            <Divider my="md" />

            <Text>
              Non hai un account?{' '}
              <Link to="/auth/register">
                Iscriviti
              </Link>
            </Text>

          </form>
      </Paper>
  )
}

export default LoginForm