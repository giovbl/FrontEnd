export type UserType = 'Oncologo' | 'Corriere' | 'Analista'
export type WorkgroupType = "oncologo" | 'analyst'
export type AnalysisStatus = 'unanalyzed' | 'analyzing' | 'completed';
export type ShipmentStatus = 'received' | 'taken' | 'in transit' | 'arrived';
export type RefertoElegibility = 'Damaged'|'Missing'|'Other'
export type DnaQuality = 'Low'|'Medium'|'High'
export type Technique = 'SOPHiA DDM'|'NGS'|'Amoy Dx'|'Thermo Fisher'|'Illumina'
export type InstabilityStatus = 'Low'|'Medium'|'High'
export type HrdStatus = 'Positivo+'|'Positivo'|'Indeterminabile'|'HRP'
export type IntegrityStatus = 'Good'|'Moderate'|'Poor'
export type BrcaMutationStatus = 'WildType'|'Mutato'|'VUS'|'NonValutabile'
export type GenotypeBrca = 'Omozigote'|'Eterozigote'|'AssenzaVarianti'
export type VariantStatus = 'Somatica'|'Germinale'|'GermlineSomatica'
export type GeneMutation = 'BRCA1'|'BRCA2'

export interface WorkgroupBase{
    id: number,
    groupName: string,
    groupType: WorkgroupType,
}

export interface Workgroup extends WorkgroupBase{
    facility: number
}

export interface WorkgroupInfo extends WorkgroupBase{
    facility: Facility
}

export interface Facility{
    id: number,
    nome: string,
    cap: string,
    residenceCity: string,
    residenceProvince: string,
    residenceRegion: string,
    address: string,
    civicNumber: number
}

export interface FacilityInfo extends Facility {
    workgroups: Array<Workgroup>
}

export interface UserData{
    id: number,
    fullname: string,
    email: string,
    userType: UserType,
    workgroup: WorkgroupInfo
}

export interface Patient{
    fiscalCode: string,
    isForeign: boolean,
    name: string,
    surname: string,
    birthDate: Date,
    initials: string,
    gender: 'M'|'F'|'Altro',
    ethnicOrigin: 'Caucasico'|'Africano'|'Asiatico'|'Altro',
    otherEthnicOrigin: string,
    residenceRegion: string,
    residenceCity: string,
    residenceProvince: string,
    cap: string,
    address: string,
    civicNumber: number,
    phone: string,
    privacyAndConditions: boolean,
    privacyPersonalData: boolean
    diagnosis: 'OC'|'BC'|'Altro',
    neoplasia: 'Epitelioma'|'Adenocarcinoma'|'Altro',
    familiarity: number,
    brcaSomaticTest: boolean,
    mutationResult: 'Positive'|'Negative'|'Indeterminate',
    histology: string,
    otherHistology: string,
    isoTypeOtherDetails: string,
    hasReceivedSystemicTreatment: boolean,
    platinumSensitive: boolean,
    oncologistNotes: string,
    allergies: string,
    previousTreatments: string
}

export interface ShipmentBase{
    id: number,
    status: ShipmentStatus   
    effectiveDeliveryDate: Date | null
    effectiveTakenDate: Date | null
    expectedDeliveryDate: Date,
    expectedTakenDate: Date
}

export interface Shipment extends ShipmentBase{
    sender: number,
    recipient: number,
}

export interface ShipmentInfo extends ShipmentBase{
    sender: FacilityInfo,
    recipient: FacilityInfo,
    sample: number
}

export interface Sample{
    id: number,
    typeOfBiologicalMaterial: 'Tissue'|'Blood'|'Other',
    exhaustedBiologicalMaterial: boolean,
    histologicalNumber: string,
    tissuePreservationMode: 'Formalin'|'Frozen'|'Paraffin',
    tissueSamplingMode: 'Biopsy'|'Surgery'|'Cytology',
    otherTissueSamplingMode: string,
    biopsyType: 'Core'|'FineNeedle'|'Incisional'|'Excisional',
    tissueProvenance: string,
    metaStaticSite: string,
    pctTumorCells: number,
    ageOfSample:  number,
    isCourierUsed: boolean,
    pathologistNotes: string,
    patient: string,
    analysisStat: 'unanalyzed'|'analyzing'|'completed'
}

export interface SampleInfo extends Sample{
    analystWorkgroup: WorkgroupInfo,
    shipment: Shipment,
    referto: number | null
    oncologiWorkgroup: WorkgroupInfo
}

export interface RefertoResult{
    id: number,
    dnaQuality: DnaQuality,
    technique: Technique,
    genomicInstabilityStatus: InstabilityStatus,
    lossOfHeterozygosityPercentage: number,
    genomicInstabilityMetric: string,
    hrdStatus: HrdStatus,
    hrdScore: number,
    genomicIntegrityStatus: IntegrityStatus,
    brcaMutationStatus: BrcaMutationStatus,
    genotypeBrca: GenotypeBrca,
    variantStatus: VariantStatus,
    geneMutation: GeneMutation,
    geneOther: string,
    exon: string,
    intron: string,
    nucleotideSubstitution: string,
    aminoacidSubstitution: string,
    reportingNotes: string,
    reportingNotesBRCA: string,
    refertingNotesHrd: string,
    technicalNotes: string,
    notesAnalysisCenter: string
}

export interface RefertoInfo{
    id: number,
    isLabelEligible: boolean,
    notElegibleReason: RefertoElegibility,
    otherNotElegibleReason: string,
    isSampleElegible: boolean,
    reasonSampleNotElegible: string,
    result?: RefertoResult,
    sample: Sample
    refertoPdf: string,
    summary: string
}