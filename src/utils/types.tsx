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

export {
    type Workgroup,
    type Facility
}