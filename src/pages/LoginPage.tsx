import { useSearchParams } from 'react-router-dom'
import {Alert,Box,Space} from '@mantine/core'

import LoginForm from '../components/forms/LoginForm'
import { IconCheck } from '@tabler/icons-react';

function Login() {

  const [searchParams] = useSearchParams();
  const regParam = searchParams.get("reg")

  return (
      <Box>
          {regParam === 'true' &&
            <Alert variant="light" 
                  color="green" 
                  title="Registrazione eseguita con successo" 
                  icon={<IconCheck/>}
            > Ora puoi effettuare il login</Alert>
          }

          <Space h="xs"/>

          <LoginForm/>
      </Box>
  )
}

export default Login
