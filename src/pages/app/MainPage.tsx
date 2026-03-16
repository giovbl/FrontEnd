import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserContext } from "../../utils/context"
import { type UserData } from '../../utils/types'

function MainPage(){

    const navigate = useNavigate()

    const user:UserData = (useContext(UserContext) as unknown) as UserData
    const [usr] = useState(user.userType)

    useEffect(()=>{
        switch(usr){
        case 'Oncologo':
            navigate('/oncologo')
            break;
        case 'Corriere':
            navigate('/courier')
            break;
        case 'Analista':
            navigate('/analyst')
            break;
        }
    },[])

    return (
        <>
        REDIREZIONE
        </>
    )
}

export default MainPage