type UserType = 'Oncologo' | 'Corriere' | 'Analista'

interface Workgroup{
    id: number,
    groupName: "Oncologia",
    groupType: "oncologo" | 'analyst',
    facility: number
}

interface Facility {
    id: number,
    nome: string,
    firstName: string,
    workgroups: Array<Workgroup>
}

interface UserData{
    id: number,
    name: string
    userType: UserType,
    workgroup: number
}

export {
    type Workgroup,
    type Facility,
    type UserData,
    type UserType
}