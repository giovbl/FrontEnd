export type UserType = 'Oncologo' | 'Corriere' | 'Analista'
export type WorkgroupType = "oncologo" | 'analyst'
export type AnalysisStatus = 'unanalyzed' | 'analyzing' | 'completed';
export type ShipmentStatus = 'received' | 'taken' | 'in transit' | 'arrived';

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