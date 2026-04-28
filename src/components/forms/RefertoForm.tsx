import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Box, Stepper, Group, Center, Fieldset, Switch, Textarea, NativeSelect, Space, NumberInput, TextInput, FileInput, Alert, Text } from "@mantine/core"
import { IconAlertTriangle, IconClipboardSmile, IconFile } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {z} from 'zod'
import api from "../../utils/api"

//Schema for Referto form
const schema = z.object({
    isLabelEligible: z.boolean().nonoptional(),
    notElegibleReason: z.string().nullable(),
    otherNotElegibleReason: z.string(),
    isSampleElegible: z.boolean().nonoptional(),
    reasonSampleNotElegible: z.string()
})
type RefertoData = z.infer<typeof schema>

//Schema for RefertoRes form
const resSchema = z.object({
    dnaQuality: z.string().nonempty("Inserire un opzione"),
    technique: z.string().nonempty("Inserire un opzione"),
    genomicInstabilityStatus: z.string().nonempty("Inserire un opzione"),
    lossOfHeterozygosityPercentage: z.number("Inserire un valore").nonoptional("Inserire un valore"),
    genomicInstabilityMetric: z.string().nonempty("Inserire la metrica"),
    hrdStatus: z.string().nonempty("Inserire un opzione"),
    hrdScore: z.number("Inserire un valore").nonoptional("Inserire un opzione"),
    genomicIntegrityStatus: z.string().nonempty("Inserire un opzione"),
    brcaMutationStatus: z.string().nonempty("Inserire un opzione"),
    genotypeBrca: z.string().nonempty("Inserire un opzione"),
    variantStatus: z.string().nonempty("Inserire un opzione"),
    geneMutation: z.string().nonempty("Inserire un opzione"),
    geneOther: z.string(),
    exon: z.string().nonempty("Inserire exon"),
    intron: z.string().nonempty("Inserire intron"),
    nucleotideSubstitution: z.string().nonempty("Il campo non può essere vuoto"),
    aminoacidSubstitution: z.string().nonempty("Il campo non può essere vuoto"),
    reportingNotes: z.string(),
    reportingNotesBRCA: z.string(),
    refertingNotesHrd: z.string(),
    technicalNotes: z.string(),
    notesAnalysisCenter: z.string()
})
type RefertoResData = z.infer<typeof resSchema>

//Schema for file form
const finalSchema = z.object({
    file: z.file("Scegliere un file").mime('application/pdf')
})
type FinalData = z.infer<typeof finalSchema>

interface RefData{
    referto: RefertoData,
    result?: RefertoResData,
    final: FinalData
}

interface RefertoFormInput{
    readonly?: boolean
    sampleId: number
}

function RefertoForm({readonly,sampleId}:RefertoFormInput){

    const fdata = useRef<RefData>(new Object() as RefData)
    const [labelElibigle,setLabelEligible] = useState(false)
    const [sampleElibigle,setSampleEligible] = useState(false)
    const [otherEl,setOtherEl] = useState(false)

    const [loading,setLoading] = useState(false)
    const [failed, setFailed] = useState(false)
    const navigate = useNavigate()

    //States and functions for the Stepper
    const [active, setActive] = useState(0);
    const nextStep = (step?:number) => {
        if(active === 3)
            navigate(0)

        if(step)
            setActive(step)
        else
            setActive((current) => (current < 3 ? current + 1 : current))
    };
    const prevStep = () => {
        if((!labelElibigle || !sampleElibigle) && active === 2)
            setActive(0)
        else
            setActive((current) => (current > 0 ? current - 1 : current))
    }

    //referto
    const {
        register:refRegister,
        handleSubmit: refHandleSubmit,
        formState: {errors: refErrors}
    } = useForm<RefertoData>({
        resolver: zodResolver(schema)
    })

    //Referto handling function
    function onRefSubmit(data:RefertoData){

        fdata.current.referto = data;

        if(!(labelElibigle && data.isSampleElegible))
            nextStep(active + 2)
        else
            nextStep()
    }

    //RefertoRes
    const {
        register: resRegister,
        control: resControl,
        handleSubmit: resHandleSubmit,
        formState: {errors: resErrors}
    } = useForm<RefertoResData>({
        resolver: zodResolver(resSchema)
    })

    //Referto handling function
    function onResSubmit(data:RefertoResData){
        fdata.current.result = data
        nextStep()
    }

    //File
    const {
        control: fileControl,
        handleSubmit: fileHandleSubmit,
        formState: {errors: fileErrors}
    } = useForm<FinalData>({
        resolver: zodResolver(finalSchema)
    })

    //File handling function
    async function onFileSubmit(data:FinalData){
        
        setFailed(false)
        setLoading(true)
        
        try{
            await api.patch(`sample/${sampleId}/status`,{
                status:'completed'
            })

            const res = await api.post('referto',{
                referto: {
                    ...fdata.current.referto,
                    notElegibleReason: (!fdata.current.referto.isLabelEligible)? 
                                            fdata.current.referto.notElegibleReason
                                            :
                                            null,
                    sample: sampleId
                },
                result: (labelElibigle && sampleElibigle)?fdata.current.result:null
            })

            const fodata = new FormData()
            fodata.append('refpdf',data.file)

            api.post('referto/'+res.data.id+'/file',fodata,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                setLoading(false)
                nextStep()
            }).catch(() => {
                setLoading(false)
                setFailed(true)
            });
        }catch(err){
            setLoading(false)
            setFailed(true)
        }
    }

    //Function for assigning the right function to execute
    function selFun(){
        switch(active){
            case 0:
                return refHandleSubmit(onRefSubmit)
            case 1:
                return resHandleSubmit(onResSubmit)
            case 2:
                return fileHandleSubmit(onFileSubmit)
            default:
                return ()=>{}
        }
    }

    return (
       <Box>
            <form onSubmit={selFun()}>
                <Stepper active={active} onStepClick={setActive}>
                    <Stepper.Step disabled={!failed && active ===3} label="Elegibilità" description="Inserisci i dati richiesti">
                        <Center>
                            <Fieldset legend='Idoneità etichetta'>
                                <Switch
                                    label="Etichetta idonea"
                                    defaultChecked={fdata.current.referto?.isLabelEligible}
                                    error={refErrors.isLabelEligible?.message}
                                    {...refRegister('isLabelEligible',{
                                        required: true,
                                        onChange: ()=> setLabelEligible(!labelElibigle)
                                        })
                                    }/>

                                <NativeSelect
                                    label="Motivazione"
                                    disabled={labelElibigle}
                                    withAsterisk
                                    defaultValue={(fdata.current.referto?.notElegibleReason)?fdata.current.referto?.notElegibleReason:""}
                                    error={refErrors.notElegibleReason?.message}
                                    {...refRegister('notElegibleReason',{
                                        onChange: (e)=>setOtherEl(e.target.value === 'Other')
                                        })
                                    }>
                                    {labelElibigle?
                                        <option>Nessuno</option>
                                        :
                                        <>
                                        <option key="Damaged" value="Damaged">Danneggiato</option>
                                        <option key="Missing" value="Missing">Non trovato</option>
                                        <option key="Other" value="Other">Altro</option>
                                        </>
                                    }
                                </NativeSelect>

                                <Textarea
                                    label="Altra motivazione"
                                    disabled={!otherEl}
                                    defaultValue={fdata.current.referto?.otherNotElegibleReason}
                                    error={refErrors.otherNotElegibleReason?.message}
                                    {...refRegister('otherNotElegibleReason')}/>
                            </Fieldset>
                            <Fieldset legend='Idoneità campione'>
                                <Switch
                                    label="Campione idoneo"
                                    defaultChecked={fdata.current.referto?.isSampleElegible}
                                    error={refErrors.isSampleElegible?.message}
                                    {...refRegister('isSampleElegible',{
                                        required: true,
                                        onChange: ()=> setSampleEligible(!sampleElibigle)
                                        })
                                    }/>

                                <Textarea
                                    label="Motivazione"
                                    disabled={sampleElibigle}
                                    resize="both"
                                    defaultValue={fdata.current.referto?.reasonSampleNotElegible}
                                    error={refErrors.reasonSampleNotElegible?.message}
                                    {...refRegister('reasonSampleNotElegible')}/>

                            </Fieldset>
                        </Center>
                    </Stepper.Step>
                    <Stepper.Step disabled={!failed && (active ===3 || active < 1)} label="Risultati" description="Inserisci i risultati">
                        <Center>
                            <Box>
                                <Fieldset legend="Tecnica">
                                    <NativeSelect
                                        label="Tipo di tecnica"
                                        withAsterisk
                                        disabled={readonly}
                                        defaultValue={fdata.current.result?.technique}
                                        error={resErrors.technique?.message}
                                        {...resRegister('technique',{required:true})}>
                                        <option key="SOPHiA DDM" value="SOPHiA DDM">SOPHiA DDM</option>
                                        <option key="NGS" value="NGS">NGS</option>
                                        <option key="Amoy Dx" value="Amoy Dx">Amoy Dx</option>
                                        <option key="Thermo Fisher" value="Thermo Fisher">Thermo Fisher</option>
                                        <option key="Illumina" value="Illumina">Illumina</option>
                                    </NativeSelect>

                                    <Textarea
                                        label="Note tecniche"
                                        resize="both"
                                        defaultValue={fdata.current.result?.technicalNotes}
                                        error={resErrors.technicalNotes?.message}
                                        {...resRegister('technicalNotes')}/>
                                </Fieldset>

                                <Space h='md'/>

                                <Fieldset legend='Genoma'>
                                    <Group>
                                        <NativeSelect
                                            label="Qualità DNA"
                                            withAsterisk
                                            w={100}
                                            disabled={readonly}
                                            defaultValue={fdata.current.result?.dnaQuality}
                                            error={resErrors.dnaQuality?.message}
                                            {...resRegister('dnaQuality',{required:true})}>
                                            <option key="Low" value="Low">Basso</option>
                                            <option key="Medium" value="Medium">Medio</option>
                                            <option key="High" value="High">Alto</option>
                                        </NativeSelect>

                                        <NativeSelect
                                            label="Mutazione gene"
                                            withAsterisk
                                            defaultValue={fdata.current.result?.geneMutation}
                                            error={resErrors.geneMutation?.message}
                                            {...resRegister('geneMutation',{required:true})}>
                                            <option key="BRCA1" value="BRCA1">BRCA1</option>
                                            <option key="BRCA2" value="BRCA2">BRCA2</option>
                                        </NativeSelect>

                                        <NativeSelect
                                            label="Stato di integrità"
                                            withAsterisk
                                            defaultValue={fdata.current.result?.genomicIntegrityStatus}
                                            error={resErrors.genomicIntegrityStatus?.message}
                                            {...resRegister('genomicIntegrityStatus',{required:true})}>
                                            <option key="Good" value="Good">Buono</option>
                                            <option key="Moderate" value="Moderate">Moderato</option>
                                            <option key="Poor" value="Poor">Pessimo</option>
                                        </NativeSelect>

                                    </Group>

                                    <Group>
                                        <TextInput 
                                            label="Altro gene"
                                            w={150}
                                            value={fdata.current.result?.geneOther}
                                            error={resErrors.geneOther?.message}
                                            {...resRegister('geneOther')}/>

                                        <NativeSelect
                                            label="Stato variante"
                                            withAsterisk
                                            w={170}
                                            defaultValue={fdata.current.result?.variantStatus}
                                            error={resErrors.variantStatus?.message}
                                            {...resRegister('variantStatus',{required:true})}>
                                            <option key="Somatica" value="Somatica">Somatica</option>
                                            <option key="Germinale" value="Germinale">Germinale</option>
                                            <option key="GermlineSomatica" value="GermlineSomatica">GermlineSomatica</option>
                                        </NativeSelect>
                                    </Group>

                                    <Group>
                                        <NativeSelect
                                            label="Stato instabilità genoma"
                                            withAsterisk
                                            defaultValue={fdata.current.result?.genomicInstabilityStatus}
                                            error={resErrors.genomicInstabilityStatus?.message}
                                            {...resRegister('genomicInstabilityStatus',{required:true})}>
                                            <option key="Low" value="Low">Basso</option>
                                            <option key="Medium" value="Medium">Medio</option>
                                            <option key="High" value="High">Alto</option>
                                        </NativeSelect>

                                        <TextInput 
                                            label="Metrica di instabilità" 
                                            withAsterisk
                                            value={fdata.current.result?.genomicInstabilityMetric}
                                            error={resErrors.genomicInstabilityMetric?.message}
                                            {...resRegister('genomicInstabilityMetric',{required: true})}/>
                                    </Group>
                                    <Group align="center">     
                                        <Controller
                                            control={resControl}
                                            name="lossOfHeterozygosityPercentage"
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <NumberInput
                                                        label="Perdita di eterozigosità"
                                                        placeholder="%"
                                                        suffix="%"
                                                        w={180}
                                                        withAsterisk
                                                        defaultValue={fdata.current.result?.lossOfHeterozygosityPercentage}
                                                        error={resErrors.lossOfHeterozygosityPercentage?.message}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                        }}/>
                                                );
                                            }}/>                             
                                    </Group>

                                    <Group>
                                        <TextInput 
                                            label="Exon"
                                            placeholder="es. Exon 6"
                                            w={180}
                                            withAsterisk
                                            value={fdata.current.result?.exon}
                                            error={resErrors.exon?.message}
                                            {...resRegister('exon',{required: true})}/>

                                        <TextInput 
                                            label="Intron"
                                            placeholder="es. Introne 11"
                                            w={180}
                                            withAsterisk
                                            value={fdata.current.result?.intron}
                                            error={resErrors.intron?.message}
                                            {...resRegister('intron',{required: true})}/>
                                    </Group>

                                    <Group>
                                        <TextInput 
                                            label="Sostituzione aminoacidi"
                                            placeholder="Es. p.Gly144Ser"
                                            w={180}
                                            withAsterisk
                                            value={fdata.current.result?.aminoacidSubstitution}
                                            error={resErrors.aminoacidSubstitution?.message}
                                            {...resRegister('aminoacidSubstitution',{required: true})}/>
                                        <TextInput 
                                            label="Sostituzione nucleotidi"
                                            placeholder="Es. c.430G>A"
                                            w={180}
                                            withAsterisk
                                            value={fdata.current.result?.nucleotideSubstitution}
                                            error={resErrors.nucleotideSubstitution?.message}
                                            {...resRegister('nucleotideSubstitution',{required: true})}/>
                                    </Group>
                                </Fieldset>

                                <Space h='md'/>

                                <Fieldset legend='Hrd'>
                                    <Group>
                                        <NativeSelect
                                            label="Stato"
                                            withAsterisk
                                            defaultValue={fdata.current.result?.hrdStatus}
                                            error={resErrors.hrdStatus?.message}
                                            {...resRegister('hrdStatus',{required:true})}>
                                            <option key="Positivo+" value="Positivo+">Positivo+</option>
                                            <option key="Positivo" value="Positivo">Positivo</option>
                                            <option key="HRP" value="HRP">HRP</option>
                                            <option key="Indeterminabile" value="Indeterminabile">Indeterminabile</option>
                                        </NativeSelect>

                                        <Controller
                                            control={resControl}
                                            name="hrdScore"
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <NumberInput
                                                        label="Score"
                                                        placeholder="00"
                                                        w={150}
                                                        withAsterisk
                                                        defaultValue={fdata.current.result?.hrdScore}
                                                        error={resErrors.hrdScore?.message}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                        }}/>
                                                );
                                            }}/>
                                    </Group>

                                    <Textarea
                                        label="Note"
                                        resize="both"
                                        defaultValue={fdata.current.result?.refertingNotesHrd}
                                        error={resErrors.refertingNotesHrd?.message}
                                        {...resRegister('refertingNotesHrd')}/>
                                </Fieldset>

                                <Fieldset legend='Brca'>
                                    <Group>
                                        <NativeSelect
                                            label="Stato mutazione"
                                            withAsterisk
                                            defaultValue={fdata.current.result?.brcaMutationStatus}
                                            error={resErrors.brcaMutationStatus?.message}
                                            {...resRegister('brcaMutationStatus',{required:true})}>
                                            <option key="WildType" value="WildType">WildType</option>
                                            <option key="Mutato" value="Mutato">Mutato</option>
                                            <option key="VUS" value="VUS">VUS</option>
                                            <option key="NonValutabile" value="NonValutabile">NonValutabile</option>
                                        </NativeSelect>
                                        <NativeSelect
                                            label="Genotipo"
                                            defaultValue={fdata.current.result?.genotypeBrca}
                                            error={resErrors.genotypeBrca?.message}
                                            {...resRegister('genotypeBrca',{required:true})}>
                                            <option key="Omozigote" value="Omozigote">Omozigote</option>
                                            <option key="Eterozigote" value="Eterozigote">Eterozigote</option>
                                            <option key="AssenzaVarianti" value="AssenzaVarianti">AssenzaVarianti</option>
                                        </NativeSelect>
                                    </Group>
                                    
                                    <Textarea
                                        label="Note"
                                        resize="both"
                                        defaultValue={fdata.current.result?.reportingNotesBRCA}
                                        error={resErrors.reportingNotesBRCA?.message}
                                        {...resRegister('reportingNotesBRCA')}/>
                                </Fieldset>
                                
                                <Fieldset legend="Note">
                                    <Textarea
                                        label="Altre note"
                                        resize="both"
                                        defaultValue={fdata.current.result?.reportingNotes}
                                        error={resErrors.reportingNotes?.message}
                                        {...resRegister('reportingNotes')}/>
                                    <Textarea
                                        label="Note centro analisi"
                                        resize="both"
                                        defaultValue={fdata.current.result?.notesAnalysisCenter}
                                        error={resErrors.notesAnalysisCenter?.message}
                                        {...resRegister('notesAnalysisCenter')}/>
                                </Fieldset>
                            </Box>
                        </Center>
                    </Stepper.Step>
                    <Stepper.Step disabled={!failed && (active ===3 || active < 2)} label="PDF referto" description="Carica il file">
                        <Center>
                            <Controller
                                control={fileControl}
                                name="file"
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <FileInput
                                            label="PDF referto"
                                            placeholder="Carica PDF"
                                            leftSection={<IconFile/>}
                                            withAsterisk
                                            accept="application/pdf"
                                            defaultValue={fdata.current.final?.file}
                                            error={fileErrors.file?.message}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}/>
                                    );
                                }}/>
                        </Center>
                    </Stepper.Step>
                    <Stepper.Completed>
                        <Center>
                            <Box>
                                <Center>
                                    <IconClipboardSmile color="green" size={50}/>
                                </Center>
                                <Space h='md'/>
                                <Text>Referto creato con successo</Text>
                            </Box>
                        </Center>
                    </Stepper.Completed>
                </Stepper>

                <Group justify="center" mt="xl">
                    <Button variant="default"
                            disabled={!failed && (active ===3 || active === 0) || loading} 
                            onClick={prevStep}>
                        Indietro
                    </Button>

                    {failed && 
                        <>
                        <Alert variant="light" color="red" title="Errore durante la creazione" icon={<IconAlertTriangle/>}/>
                        <Space h="md"/>
                        </>
                    }

                    <Button type='submit'
                        loading={loading} 
                        loaderProps={{ type: 'dots' }}>
                        {active === 2?"Crea referto":(active===3)?"Chiudi":"Continua"}
                    </Button>
                </Group>
            </form>
        </Box>
    )
}

export default RefertoForm