import {Group,Text} from '@mantine/core'
import { IconCircleFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import {type AnalysisStatus} from '../../utils/types'

export interface AnalysisDisplayInput{
    status: AnalysisStatus,
    refertoid: number | null,
    strfun: (stat:string) => string
}

function CircleIcon({status}:{status:AnalysisStatus}){

    switch(status) {
        case 'unanalyzed':
            return <IconCircleFilled color='red'/>
        case 'analyzing':
            return <IconCircleFilled color='yellow'/>
        case 'completed':
            return <IconCircleFilled color='green'/>
    }
}

function AnalysisDisplay({status,refertoid,strfun}:AnalysisDisplayInput){
    
    return (
        <Group>
            <CircleIcon status={status}/>
            {status === 'completed'?
                <Link to={"referto/"+btoa(String(refertoid))}>
                    {strfun(status)}
                </Link>
                :
                <Text>{strfun(status)}</Text>
            }
        </Group>
    )
}

export default AnalysisDisplay