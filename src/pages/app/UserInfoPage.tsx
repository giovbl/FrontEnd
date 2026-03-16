import { useContext } from 'react'

import {Box, Space, TextInput, Group, Fieldset} from '@mantine/core'

import { UserContext } from '../../utils/context'
import type { UserData } from '../../utils/types'
import WorkgroupInfo from '../../components/datatable/WorkgroupInfo'

function UserInfoPage(){

    const user:UserData = (useContext(UserContext) as unknown) as UserData 

    return (
        <Box>
            <Group>
                <TextInput label="Nome" value={user.fullname} disabled/>

                <TextInput label="Email" value={user.email} disabled/>
            </Group>

            <Space h='md'/>

            <TextInput label="Tipo di utente" value={user.userType} disabled/>

            <Space h='md'/>

            {user.userType != 'Corriere' &&
                <Fieldset legend="Workgroup di appartenenza">
                    <WorkgroupInfo 
                        workgroup={user.workgroup.groupName}
                        facility={user.workgroup.facility.nome}/>
                </Fieldset>
            }

        </Box>
    )
}

export default UserInfoPage