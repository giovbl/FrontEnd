import { Button, Box } from "@mantine/core"
import { useState } from "react"

interface RefertoFormInput{
    readonly?: boolean,
    data?: unknown,
}

function RefertoForm({readonly,data}:RefertoFormInput){

    const [loading,setLoading] = useState(false)

    return (
        <Box>
            <form>
                

                {loading?
                    <Button type='submit' loading loaderProps={{ type: 'dots' }}>Crea referto</Button>
                    :
                    <Button type='submit'>Crea referto</Button>
                }
            </form>
        </Box>
    )
}

export default RefertoForm