type UserType = 'Oncologo' | 'Corriere' | 'Analista'
type WorkgroupType = "oncologo" | 'analyst'

interface WorkgroupBase{
    id: number,
    groupName: string,
    groupType: WorkgroupType,
}

interface Workgroup extends WorkgroupBase{
    facility: number
}

interface WorkgroupInfo extends WorkgroupBase{
    facility: Facility
}

interface Facility{
    id: number,
    nome: string,
    cap: string,
    residenceCity: string,
    residenceProvince: string,
    residenceRegion: string,
    address: string,
    civicNumber: number
}

interface FacilityInfo extends Facility {
    workgroups: Array<Workgroup>
}

interface UserData{
    id: number,
    fullname: string,
    email: string,
    userType: UserType,
    workgroup: WorkgroupInfo
}

export {
    type UserType,
    type WorkgroupType,
    type Workgroup,
    type WorkgroupInfo,
    type Facility,
    type FacilityInfo,
    type UserData
}