import { Button } from "@mantine/core"
import { useState } from "react"



function RefertoForm(){

    const [loading,setLoading] = useState(false)

    return (
        <>
        {loading?
        <Button type='submit' loading loaderProps={{ type: 'dots' }}>Crea referto</Button>
        :
        <Button type='submit'>Crea referto</Button>
        }
        </>
    )
}

export default RefertoForm