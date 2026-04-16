import { useEffect, useState } from "react"
import api from "../../../utils/api"
import { useNavigate, useParams } from "react-router-dom"
import { Alert, Box, Button, Center, Fieldset, Group, Loader, NumberInput, Space, Switch, Textarea, TextInput } from "@mantine/core"
import { IconArrowLeft, IconPdf, IconX } from "@tabler/icons-react"
import type { RefertoInfo } from "../../../utils/types"
import RefSummary from "../../../components/RefSummary"
import AllCenter from "../../../components/AllCenter"

function RefertoPage(){

    const [referto, setReferto] = useState<RefertoInfo|null>(null)
    const [existence,setExistence] = useState(true)
    const [loading,setLoading] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        api.get('referto/'+ (params.id?params.id:"")).then((res)=>{
            setReferto(res.data)
            setLoading(false)
        }).catch((err) =>{
            if(err.status === 404)
                setExistence(false)
            setLoading(false)
        })
    },[])

    if(loading)
        return <AllCenter><Loader type="bars"/></AllCenter>

    return (
        <Box>
            <Button
                leftSection={<IconArrowLeft/>} 
                variant="default"
                onClick={()=>navigate(-1)}>
                Torna indietro
            </Button>

            <Space h='xl'/>

            {!existence &&
                <Alert variant="light" color="red" title="Referto non esistente" icon={<IconX/>}/>
            }

            <Box>
                <Fieldset legend='Sommario'>
                    <RefSummary refertoId={Number(params.id)} summary={(referto?.summary)?referto?.summary:null}/>
                </Fieldset>
                 <Space h='md'/>
                <Center>
                    <Button
                        leftSection={<IconPdf/>}
                        variant="default"
                        component="a"
                        href={referto?.refertoPdf}>
                    Visualizza PDF
                    </Button>    
                </Center>
            </Box>

            {(referto && !loading) &&
                <Box>
                    <Fieldset legend='Idonietà'>
                        <Fieldset legend='Idoneità etichetta'>
                            <Switch
                                label="Etichetta idonea"
                                readOnly
                                checked={referto.isLabelEligible}/>

                            <TextInput
                                label="Motivazione"
                                readOnly
                                value={referto.notElegibleReason}/>

                            <Textarea
                                label="Altra motivazione"
                                readOnly
                                value={referto.otherNotElegibleReason}/>
                        </Fieldset>
                        <Fieldset legend='Idoneità campione'>
                            <Switch
                                label="Campione idoneo"
                                readOnly
                                checked={referto?.isSampleElegible}/>

                            <Textarea
                                label="Motivazione"
                                readOnly
                                resize="both"
                                value={referto?.reasonSampleNotElegible}/>
                        </Fieldset>
                    </Fieldset>

                    <Space h='md'/>

                    {referto.result &&
                        <Fieldset legend='Risultati'>
                            <Fieldset legend="Tecnica">
                                <TextInput
                                    label="Tipo di tecnica"
                                    readOnly
                                    value={referto.result?.technique}/>

                                <Textarea
                                    label="Note tecniche"
                                    resize="both"
                                    readOnly
                                    value={referto.result?.technicalNotes}/>
                            </Fieldset>

                            <Space h='md'/>

                            <Fieldset legend='Genoma'>
                                <Group>
                                    <TextInput
                                        label="Qualità DNA"
                                        w={100}
                                        readOnly
                                        value={referto.result?.dnaQuality}/>

                                    <TextInput
                                        label="Mutazione gene"
                                        readOnly
                                        value={referto.result?.geneMutation}/>

                                    <TextInput
                                        label="Stato di integrità"
                                        readOnly
                                        value={referto.result?.genomicIntegrityStatus}/>
                                </Group>

                                <Group>
                                    <TextInput
                                        label="Altro gene"
                                        w={150}
                                        readOnly
                                        value={referto.result?.geneOther}/>

                                    <TextInput
                                        label="Stato variante"
                                        w={170}
                                        readOnly
                                        value={referto.result?.variantStatus}/>
                                </Group>

                                <Group>
                                    <TextInput
                                        label="Stato instabilità genoma"
                                        readOnly
                                        defaultValue={referto.result?.genomicInstabilityStatus}/>

                                    <TextInput 
                                        label="Metrica di instabilità"
                                        readOnly
                                        value={referto.result?.genomicInstabilityMetric}/>
                                </Group>
                                <Group align="center">           
                                <NumberInput
                                    label="Perdita di eterozigosità"
                                    placeholder="%"
                                    suffix="%"
                                    w={150}
                                    readOnly
                                    value={referto.result?.lossOfHeterozygosityPercentage}/>                      
                                </Group>

                                <Group>
                                    <TextInput 
                                        label="Exon"
                                        placeholder="ATGGCCA..."
                                        w={180}
                                        readOnly
                                        value={referto.result?.exon}/>

                                    <TextInput 
                                        label="Intron"
                                        placeholder="GTGAGTAAA..."
                                        w={180}
                                        readOnly
                                        value={referto.result?.intron}/>
                                </Group>

                                <Group>
                                    <TextInput 
                                        label="Sostituzione aminoacidi"
                                        w={180}
                                        readOnly
                                        value={referto.result?.aminoacidSubstitution}/>
                                    <TextInput 
                                        label="Sostituzione nucleotidi"
                                        w={180}
                                        readOnly
                                        value={referto.result?.nucleotideSubstitution}/>
                                </Group>
                            </Fieldset>

                            <Space h='md'/>

                            <Fieldset legend='Hrd'>
                                <Group>
                                    <TextInput
                                        label="Stato"
                                        readOnly
                                        value={referto.result?.hrdStatus}/>

                                    <NumberInput
                                        label="Score"
                                        placeholder="00"
                                        w={150}
                                        readOnly
                                        value={referto.result?.hrdScore}/>
                                </Group>

                                <Textarea
                                    label="Note"
                                    resize="both"
                                    readOnly
                                    value={referto.result?.refertingNotesHrd}/>
                            </Fieldset>

                            <Fieldset legend='Brca'>
                                <Group>
                                    <TextInput
                                        label="Stato mutazione"
                                        readOnly
                                        value={referto.result?.brcaMutationStatus}/>
                                    <TextInput
                                        label="Genotipo"
                                        readOnly
                                        value={referto.result?.genotypeBrca}/>
                                </Group>
                                
                                <Textarea
                                    label="Note"
                                    resize="both"
                                    readOnly
                                    value={referto.result?.reportingNotesBRCA}/>
                            </Fieldset>
                            
                            <Fieldset legend="Note">
                                <Textarea
                                    label="Altre note"
                                    resize="both"
                                    readOnly
                                    defaultValue={referto.result?.reportingNotes}/>
                                <Textarea
                                    label="Note centro analisi"
                                    resize="both"
                                    readOnly
                                    defaultValue={referto.result?.notesAnalysisCenter}/>
                            </Fieldset>
                        </Fieldset>
                    }
                </Box>
            }
        </Box>
    )
}

export default RefertoPage