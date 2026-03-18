import {Box, Fieldset, TextInput} from '@mantine/core'
import {DatePickerInput} from '@mantine/dates'

import {type Patient} from '../../utils/types'

interface PatientFormInput{
    readonly: boolean,
    data: Patient | null
}

function PatientForm({readonly,data=null}:PatientFormInput){
    return (
        <Box>
            <Fieldset legend="Personal information">
                <TextInput label="Codice fiscale" placeholder="RSSMRR07T.." disabled={readonly} value={data?.fiscalCode}/>
                <TextInput label="Nome" placeholder="Mario" disabled={readonly} value={data?.name}/>
                <TextInput label="Cognome" placeholder="Rossi" disabled={readonly} value={data?.surname}/>
                <DatePickerInput label="Data di nascita" disabled={readonly} value={data?.birthDate}/>
            </Fieldset>
            <Fieldset legend="">

            </Fieldset>
        </Box>
    )
}

export default PatientForm