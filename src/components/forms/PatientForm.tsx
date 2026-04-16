import {Box, Fieldset, NativeSelect, TextInput, Group, NumberInput, Textarea, Switch, Space, Button, Stack, Alert} from '@mantine/core'
import { DateInput } from '@mantine/dates'

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {type Patient} from '../../utils/types'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import api from '../../utils/api'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'

const schema = z.object({
    fiscalCode: z.string().nonempty("Inserire codice fiscale"),
    isForeign: z.boolean(),
    name: z.string().nonempty("Inserire nome"),
    surname: z.string().nonempty("Inserire cognome"),
    birthDate: z.string().nonempty("Inserire una data").nonoptional("Inserire una data"),
    gender: z.string().nonempty("Inserire il sesso"),
    ethnicOrigin: z.string().nonempty("Inserire un opzione"),
    otherEthnicOrigin: z.string(),
    residenceRegion: z.string().nonempty("Inserire regione"),
    residenceCity: z.string().nonempty("Inserire città"),
    residenceProvince: z.string().nonempty("Inserire provincia"),
    cap: z.string().nonempty("Inserire CAP"),
    address: z.string().nonempty("Inserire indirizzo"),
    civicNumber: z.number("Inserire il civico").nonnegative("Inserire un numero valido").nonoptional("Inserire il civico"),
    phone: z.string().nonempty("Inserire un numero di telefono"),
    privacyAndConditions: z.boolean(),
    privacyPersonalData: z.boolean(),
    diagnosis: z.string(),
    neoplasia: z.string(),
    familiarity: z.number("Inserire familiarità").nonoptional("Inserire familiarità"),
    brcaSomaticTest: z.boolean(),
    mutationResult: z.string(),
    histology: z.string().nonempty("Inserire istologia"),
    otherHistology: z.string(),
    isoTypeOtherDetails: z.string(),
    hasReceivedSystemicTreatment: z.boolean(),
    platinumSensitive: z.string(),
    oncologistNotes: z.string(),
    allergies: z.string(),
    previousTreatments: z.string()
})

type PatientData = z.infer<typeof schema>
interface PatientDataExtended extends PatientData{
    initials:string
}

interface PatientFormInput{
    readonly?: boolean,
    data?: Patient
}

function PatientForm({readonly,data}:PatientFormInput){

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<PatientData>({
        resolver: zodResolver(schema)
    })

    const [loading,setLoading] = useState(false)
    const [otherEthnicity, setOtherEthnicity] = useState(false)
    const [patientExists,setPatientExists] = useState(false)
    const [failed, setFailed] = useState(false)
    const navigate = useNavigate()

    if(data?.ethnicOrigin === 'Altro')
        setOtherEthnicity(true)

    const onSubmit:SubmitHandler<PatientData> = async (data:PatientData) =>{

        setLoading(true)
        setPatientExists(false)
        setFailed(false)
        
        const rdata:PatientDataExtended = data as PatientDataExtended
        rdata.initials = data.name.substring(0,3) + '. ' + data.surname.substring(0,3) + '.'
        
        try{
            await api.post("patient",{
                ...rdata,
                platinumSensitive: (data.platinumSensitive !== 'null')?Boolean(data.platinumSensitive):null
            })

            setLoading(false)
            navigate(0)
        }catch(error){
            setLoading(false)
            const err = error as AxiosError

            if(err.status === 409)
                setPatientExists(true)
            else
                setFailed(true)
        }
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset legend='Generalità'>
                    <Group>
                        <TextInput 
                            label="Codice fiscale" 
                            disabled={readonly} 
                            withAsterisk
                            value={data?.fiscalCode}
                            error={errors.fiscalCode?.message}
                            {...register('fiscalCode',{required: true})}/>
                        
                        <Switch
                            label="Estero"
                            disabled={readonly}
                            checked={data?.isForeign}
                            error={errors.isForeign?.message}
                            {...register('isForeign',{required: true})}/>
                    </Group>

                    <Group>
                        <TextInput 
                            label="Nome"
                            disabled={readonly}
                            withAsterisk
                            value={data?.name}
                            error={errors.name?.message}
                            {...register('name',{required: true})}/>

                        <TextInput 
                            label="Cognome" 
                            disabled={readonly} 
                            withAsterisk
                            value={data?.surname}
                            error={errors.surname?.message}
                            {...register('surname',{required: true})}/>

                        <NativeSelect 
                            label="Sesso" 
                            disabled={readonly} 
                            withAsterisk
                            value={data?.gender}
                            error={errors.gender?.message}
                            {...register('gender',{required: true})}>
                            <option value="M">M</option>
                            <option value="F">F</option>
                            <option value="Altro">Altro</option>
                        </NativeSelect>
                    </Group>

                    <Group>
                        <Controller
                            control={control}
                            name="birthDate"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <DateInput 
                                        label="Data di nascita" 
                                        disabled={readonly}
                                        withAsterisk
                                        value={data?.birthDate}
                                        error={errors.birthDate?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                );
                            }}
                        />

                        <TextInput 
                            label="Numero di telefono"
                            disabled={readonly}
                            withAsterisk
                            value={data?.phone}
                            error={errors.phone?.message}
                            {...register('phone',{required: true})}/>
                    </Group>
                </Fieldset>

                <Fieldset legend="Residenza">
                    <Group>
                        <TextInput 
                            label="Regione" 
                            disabled={readonly} 
                            withAsterisk
                            value={data?.residenceRegion}
                            error={errors.residenceRegion?.message}
                            {...register('residenceRegion',{required: true})}/>

                        <TextInput 
                            label="Provincia" 
                            disabled={readonly} 
                            withAsterisk
                            value={data?.residenceProvince}
                            error={errors.residenceProvince?.message}
                            {...register('residenceProvince',{required: true})}/>

                        <TextInput 
                            label="Città"
                            disabled={readonly} 
                            withAsterisk
                            value={data?.residenceCity}
                            error={errors.residenceCity?.message}
                            {...register('residenceCity',{required: true})}/>
                    </Group>
                    <Group>
                        <TextInput 
                            label="CAP"
                            disabled={readonly} 
                            withAsterisk
                            value={data?.cap}
                            error={errors.cap?.message}
                            {...register('cap',{required: true})}/>

                        <TextInput 
                            label="Indirizzo"
                            disabled={readonly} 
                            value={data?.address}
                            withAsterisk
                            error={errors.address?.message}
                            {...register('address',{required: true})}/>
                        
                        <Controller
                            control={control}
                            name="civicNumber"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <NumberInput
                                        label="Civico"
                                        disabled={readonly} 
                                        withAsterisk
                                        value={data?.civicNumber}
                                        error={errors.civicNumber?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}/>
                                );
                            }}
                        />

                    </Group>
                </Fieldset>
                <Fieldset legend="Dati medici">
                    <Group>
                        <NativeSelect 
                            label="Origine etnica"
                            disabled={readonly}
                            withAsterisk
                            value={data?.ethnicOrigin}
                            error={errors.ethnicOrigin?.message}
                            {...register('ethnicOrigin',{
                                    required: true,
                                    onChange: (e) =>{
                                        setOtherEthnicity(e.target.value === 'Altro')
                                    }
                                })
                            }>
                            <option key="Caucasico" value="Caucasico">Caucasico</option>
                            <option key="Africano" value="Africano">Africano</option>
                            <option key="Asiatico" value="Asiatico">Asiatico</option>
                            <option key="Altro" value="Altro">Altro</option>
                        </NativeSelect>

                        <TextInput 
                            label="Altra etnia"
                            disabled={readonly || !otherEthnicity}
                            withAsterisk={otherEthnicity}
                            value={data?.otherEthnicOrigin}
                            error={errors.otherEthnicOrigin?.message}
                            {...register('otherEthnicOrigin')}/>
                    </Group>

                    <Space h="md"/>

                    <Group>

                        <NativeSelect 
                            label="Diagnosi"
                            disabled={readonly}
                            withAsterisk
                            value={data?.diagnosis}
                            error={errors.diagnosis?.message}
                            {...register('diagnosis',{required: true})}>
                            <option key="OC" value="OC">OC</option>
                            <option key="BC" value="BC">BC</option>
                            <option key="Altro" value="Altro">Altro</option>
                        </NativeSelect>

                        <NativeSelect 
                            label="Neoplasia"
                            disabled={readonly}
                            withAsterisk
                            value={data?.neoplasia}
                            error={errors.neoplasia?.message}
                            {...register('neoplasia',{required: true})}>
                            <option key="Epitelioma" value="Epitelioma">Epitelioma</option>
                            <option key="Adenocarcinoma" value="Adenocarcinoma">Adenocarcinoma</option>
                            <option key="Altro" value="Altro">Altro</option>
                        </NativeSelect>

                        <Controller
                            control={control}
                            name="familiarity"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <NumberInput
                                        label="Familiarità"
                                        disabled={readonly}
                                        withAsterisk
                                        value={(Number.isNaN(data?.familiarity))?0:data?.familiarity}
                                        error={errors.familiarity?.message}
                                        onChange={(val) => {
                                            field.onChange(val);
                                        }}/>
                                );
                            }}
                        />

                    </Group>

                    <Space h="md"/>

                    <Group>
                        <NativeSelect 
                            label="Mutazione"
                            disabled={readonly}
                            withAsterisk
                            value={data?.mutationResult}
                            error={errors.mutationResult?.message}
                            {...register('mutationResult',{required: true})}>
                            <option key="Positive" value="Positive">Positiva</option>
                            <option key="Negative" value="Negative">Negativa</option>
                            <option key="Indeterminate" value="Indeterminate">Indeterminata</option>
                        </NativeSelect>

                        <Switch
                            label="Esecuzione test somatico BRCA"
                            disabled={readonly}
                            checked={data?.brcaSomaticTest}
                            error={errors.brcaSomaticTest?.message}
                            {...register('brcaSomaticTest',{required: true})}/>
                    </Group>

                    <Space h="md"/>

                    <Group>
                        <Textarea
                            label="Istologia"
                            resize="both"
                            disabled={readonly}
                            withAsterisk
                            value={data?.histology}
                            error={errors.histology?.message}
                            {...register('histology',{required: true})}/>

                        <Textarea
                            label="Altra istologia"
                            resize="both"
                            disabled={readonly}
                            value={data?.otherHistology}
                            error={errors.otherHistology?.message}
                            {...register('otherHistology')}/>

                        <Textarea
                            label="Altri dettagli isotipo"
                            resize="vertical"
                            disabled={readonly}
                            value={data?.isoTypeOtherDetails}
                            error={errors.isoTypeOtherDetails?.message}
                            {...register('isoTypeOtherDetails')}/>
                    </Group>

                </Fieldset>

                <Fieldset legend="Trattamento">
                    <Group>
                        <NativeSelect
                                label="Sensibilità al platino"
                                disabled={readonly}
                                withAsterisk
                                w={140}
                                value={(data?.platinumSensitive)?String(data.platinumSensitive):undefined}
                                error={errors.platinumSensitive?.message}
                                {...register('platinumSensitive',{required: true})}>
                                    <option key="true" value="true">Si</option>
                                    <option key="false" value="false">No</option>
                                    <option key="null" value="null">Non noto</option>
                        </NativeSelect>

                        <Textarea
                            label="Trattamenti precedenti"
                            resize="both"
                            disabled={readonly}
                            value={data?.previousTreatments}
                            error={errors.previousTreatments?.message}
                            {...register('previousTreatments')}/>

                        <Stack>

                            <Switch
                                label="Trattamento sistemico ricevuto"
                                disabled={readonly}
                                checked={data?.hasReceivedSystemicTreatment}
                                error={errors.hasReceivedSystemicTreatment?.message}
                                {...register('hasReceivedSystemicTreatment',{required: true})}/>
                                
                        </Stack>
                    </Group>
                </Fieldset>

                <Fieldset legend="Altre note">

                    <Textarea
                        label="Allergie"
                        resize="both"
                        disabled={readonly}
                        value={data?.allergies}
                        error={errors.allergies?.message}
                        {...register('allergies')}/>

                    <Textarea
                        label="Altre note"
                        resize="both"
                        disabled={readonly}
                        value={data?.oncologistNotes}
                        error={errors.oncologistNotes?.message}
                        {...register('oncologistNotes')}/>
                </Fieldset>
                
                <Fieldset legend="Condizioni privacy">
                    <Switch
                        label="Consenso al trattamento dei dati personali"
                        disabled={readonly}
                        checked={data?.privacyPersonalData}
                        error={errors.privacyPersonalData?.message}
                        {...register('privacyPersonalData',{required: true})}/>
                    
                    <Space h="md"/>

                    <Switch
                        label="Consenso ai termini e condizioni della privacy"
                        disabled={readonly}
                        checked={data?.privacyAndConditions}
                        error={errors.privacyAndConditions?.message}
                        {...register('privacyAndConditions',{required: true})}/>
                </Fieldset>

                <Space h="md"/>

                {!readonly &&
                <>
                    {loading?
                        <Button type='submit' loading loaderProps={{ type: 'dots' }}>Crea paziente</Button>
                        :
                        <Button type='submit'>Crea paziente</Button>
                    }
                </>
                }
                {patientExists &&
                    <Alert variant="light" color="red" title="Paziente esistente" icon={<IconAlertTriangle/>}/>
                }
                {failed && 
                    <Alert variant="light" color="red" title="Errore durante la creazione" icon={<IconAlertTriangle/>}/>
                }
            </form>
        </Box>
    )
}

export default PatientForm