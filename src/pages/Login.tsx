import { useSearchParams } from 'react-router-dom'
import {Alert,Box,Space} from '@mantine/core'

import LoginForm from '../components/forms/LoginForm'
import AllCenter from '../components/AllCenter'
import { IconCheck } from '@tabler/icons-react';

function Login() {

  const [searchParams] = useSearchParams();
  const regParam = searchParams.get("reg")

  return (
    <AllCenter>
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
    </AllCenter>
  )
}

export default Login
