import { Alert, Box, Button, Fieldset, Group, NativeSelect, NumberInput, Space, Switch, Text, Textarea, TextInput } from "@mantine/core"

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useContext, useState, type ChangeEvent } from "react"
import type { FacilityInfo, Sample, UserData } from "../../utils/types"
import { IconAlertTriangle, IconX } from "@tabler/icons-react"
import api from "../../utils/api"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../utils/context"

const schema = z.object({
    analystWorkgroup: z.string().nonoptional("Inserire un opzione"),
    typeOfBiologicalMaterial: z.string().nonempty("Inserire un opzione"),
    exhaustedBiologicalMaterial: z.boolean(),
    histologicalNumber: z.string().nonempty("Inserire il numero istologico"),
    tissuePreservationMode: z.string(),
    tissueSamplingMode: z.string(),
    otherTissueSamplingMode: z.string(),
    biopsyType: z.string(),
    tissueProvenance: z.string(),
    metaStaticSite: z.string(),
    pctTumorCells: z.number().min(0,'Inserire un numero valido').max(100,'Inserire un numero valido').nonoptional('Inserire una percentuale'),
    ageOfSample: z.number("Inserire l'età del campione").min(0,'Inserire un numero valido'),
    pathologistNotes: z.string(),
    patient: z.string().nonempty('Inserire codice fiscale')
})

type SampleData = z.infer<typeof schema>

interface SampleFormInput{
    facilities?: Array<FacilityInfo>,
    readonly?: boolean,
    data?: Sample
}

function SampleForm({facilities,readonly,data}:SampleFormInput){

    const user:UserData = (useContext(UserContext) as unknown) as UserData

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<SampleData>({
        resolver: zodResolver(schema)
    })

    const [loading,setLoading] = useState(false)
    const [facility, setFacility] = useState(facilities?facilities[0].id:-1)
    const [bioType, setBioType] = useState('Tissue')
    const [failed, setFailed] = useState(false)
    const [tissueSampling,setTissueSampling] = useState('Biopsy')
    const [patientError,setPatientError] = useState(false)
    const navigate = useNavigate()

    function patientExists(e: ChangeEvent<HTMLInputElement>){
        if(e.target.value.length < 16)
            return

        api.post('patient/exists',{
            fiscalCode: e.target.value
        }).then((res) =>{
            setPatientError(!res.data.exists)
        })
    }

    const onSubmit:SubmitHandler<SampleData> = async (data:SampleData) =>{

        if(patientError)
            return

        setLoading(true)
        setFailed(false)
        
        try{
            await api.post("sample",{
                oncologiWorkgroup: user.workgroup.id,
                analystWorkgroup: Number(data.analystWorkgroup),
                typeofBiologicalMaterial: data.typeOfBiologicalMaterial,
                exhaustedBiologicalMaterial: data.exhaustedBiologicalMaterial,
                histologicalNumber: data.histologicalNumber,
                tissuePreservationMode: (bioType != 'Tissue')?null:data.tissuePreservationMode,
                tissueSamplingMode: (bioType != 'Tissue')?null:data.tissueSamplingMode,
                otherTissueSamplingMode: (bioType === 'Tissue' && tissueSampling ==='Altro')?data.otherTissueSamplingMode:null,
                biopsyType: (bioType != 'Tissue' && tissueSampling != 'Biopsy')?null:data.biopsyType,
                tissueProvenance: (bioType != 'Tissue')?null:data.tissueProvenance,
                metaStaticSite: data.metaStaticSite,
                pctTumorCells: data.pctTumorCells,
                ageOfSample: data.ageOfSample,
                pathologistNotes: data.pathologistNotes,
                patient: data.patient
            })
            setLoading(false)
            navigate(0)
        }catch{
            setLoading(false)
            setFailed(true)
        }
    }

    const wdata = facilities?.filter((itm) =>(
        itm.id === facility
    ))[0].workgroups.filter((itm)=>(
        itm.groupType === 'analyst'
    )).map((itm) =>(
        {label: itm.groupName, value: String(itm.id)}
    ))

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset legend='Paziente'>
                        <TextInput
                            label="Codice fiscale"
                            disabled={readonly}
                            value={data?.patient}
                            error={errors.patient?.message}
                            {...register('patient',{required:true,
                                onChange: patientExists
                            })}
                            />

                        {patientError &&
                            <Text c='red' size="sm"><IconX size={10}/>Paziente non esistente</Text>
                        }
                </Fieldset>

                <Space h="md"/>

                {!data &&
                    <>
                    <Fieldset legend='Workgroup di analisi'>
                        <NativeSelect 
                            label="Struttura"
                            onChange={(e)=>setFacility(Number(e.target.value))}>
                            {facilities &&
                                facilities.map((itm) =>(
                                    <option key={itm.id} value={itm.id}>{itm.nome}</option>
                                ))
                            }
                        </NativeSelect>

                        <NativeSelect 
                            label="Workgroup" 
                            data={wdata}
                            error={errors.analystWorkgroup?.message}
                            {...register('analystWorkgroup',{required:true})}>
                        </NativeSelect>
                    </Fieldset>

                    <Space h="md"/>
                    </>
                }

                <Fieldset legend='Materiale biologico'>
                    <Group>
                        <NativeSelect
                            label="Tipo di materiale"
                            disabled={readonly}
                            value={data?.typeOfBiologicalMaterial}
                            error={errors.typeOfBiologicalMaterial?.message}
                            {...register('typeOfBiologicalMaterial',{
                                required:true,
                                onChange:(e)=>{
                                    setBioType(e.target.value)
                                }})
                            }>
                            <option key="Tissue" value="Tissue">Tessuto</option>
                            <option key="Blood" value="Blood">Sangue</option>
                            <option key="Other" value="Other">Altro</option>
                        </NativeSelect>

                        <Controller
                            control={control}
                            name="ageOfSample"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <NumberInput
                                        label="Età del campione"
                                        suffix=" mesi"
                                        disabled={readonly}
                                        value={data?.ageOfSample}
                                        error={errors.ageOfSample?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }
                                    }/>
                                );
                            }}
                        />

                        <Switch
                            label="Esausto"
                            disabled={readonly}
                            checked={data?.exhaustedBiologicalMaterial}
                            error={errors.exhaustedBiologicalMaterial?.message}
                            {...register('exhaustedBiologicalMaterial',{required: true})}/>
                    </Group>

                    <Group>
                        <Controller
                            control={control}
                            name="pctTumorCells"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <NumberInput
                                        label="Percentuale cellule tumorali"
                                        suffix="%"
                                        placeholder="%"
                                        disabled={readonly}
                                        value={data?.pctTumorCells}
                                        error={errors.pctTumorCells?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}/>
                                );
                            }}
                        />
                    </Group>

                    <TextInput
                        label="Zona metastasi"
                        disabled={readonly}
                        value={data?.metaStaticSite}
                        error={errors.metaStaticSite?.message}
                        {...register('metaStaticSite',{required:true})}/>

                    
                </Fieldset>

                <Space h="md"/>

                <Fieldset legend='Informazioni tessuto'>
                    <TextInput
                            label="Numero istologico"
                            placeholder="0000/00"
                            disabled={readonly}
                            value={data?.histologicalNumber}
                            error={errors.histologicalNumber?.message}
                            maw={170}
                            {...register('histologicalNumber')}/>
                    <Group>
                        <NativeSelect
                            label="Preservazione"
                            disabled={readonly || bioType != 'Tissue'}
                            value={data?.tissuePreservationMode}
                            error={errors.tissuePreservationMode?.message}
                            {...register('tissuePreservationMode')}>
                            {bioType != 'Tissue'?
                                <option key='null' value='null'>Nessuno</option>
                                :
                                <>
                                <option key="Formalin" value="Formalin">Formalin</option>
                                <option key="Frozen" value="Frozen">Congelamento</option>
                                <option key="Paraffin" value="Paraffin">Paraffina</option>
                                </>
                            }
                        </NativeSelect>

                        <TextInput
                            label="Provenienza"
                            disabled={readonly || bioType != 'Tissue'}
                            value={data?.tissueProvenance}
                            error={errors.tissueProvenance?.message}
                            {...register('tissueProvenance')}/>
                     </Group>
                        
                    <Group>
                        <NativeSelect
                            label="Tipo di sampling"
                            disabled={readonly || bioType != 'Tissue'}
                            value={data?.tissueSamplingMode}
                            error={errors.tissueSamplingMode?.message}
                            {...register('tissueSamplingMode',{
                                onChange: (e)=>{
                                    setTissueSampling(e.target.value)
                                }
                            })}>
                            {bioType != 'Tissue'?
                                <option key='null' value='null'>Nessuno</option>
                                :
                                <>
                                <option key='Biopsy' value='Biopsy'>Biopsia</option>
                                <option key='Surgery' value='Surgery'>Chirurgia</option>
                                <option key='Cytology' value='Cytology'>Citologia</option>
                                <option key='altro' value='altro'>Altro</option>
                                </>
                            }
                        </NativeSelect>
                        <TextInput
                            label="Altro tipo di sampling"
                            disabled={readonly || tissueSampling != 'altro' || bioType != 'Tissue'}
                            value={data?.otherTissueSamplingMode}
                            error={errors.otherTissueSamplingMode?.message}
                            {...register('otherTissueSamplingMode')}/>
                     </Group>

                     <NativeSelect
                            label="Tipo di biopsia"
                            disabled={readonly || tissueSampling != 'Biopsy' || bioType != 'Tissue'}
                            value={data?.biopsyType}
                            error={errors.biopsyType?.message}
                            {...register('biopsyType')}>
                            
                            {tissueSampling != 'Biopsy'?
                                <option key='null' value='null'>Nessuno</option>
                                :
                                <>
                                <option key='Core' value='Core'>Core</option>
                                <option key='FineNeedle' value='FineNeedle'>FineNeedle</option>
                                <option key='Incisional' value='Incisional'>Incisionale</option>
                                <option key='Excisional' value='Excisional'>Escissionale</option>
                                </>
                            }
                        </NativeSelect>
                </Fieldset>

                <Space h="md"/>

                <Textarea
                    label='Note patologo'
                    disabled={readonly}
                    value={data?.pathologistNotes}
                    error={errors.pathologistNotes?.message}
                    {...register('pathologistNotes')}/>
                
                <Space h="md"/>

                {failed && 
                    <>
                    <Alert variant="light" color="red" title="Errore durante la creazione" icon={<IconAlertTriangle/>}/>
                    <Space h="md"/>
                    </>
                }

                {!readonly &&
                <>
                    {loading?
                    <Button type='submit' loading loaderProps={{ type: 'dots' }}>Crea campione</Button>
                    :
                    <Button type='submit'>Crea campione</Button>
                    }
                </>
                }
            </form>
        </Box>
    )
}

export default SampleForm