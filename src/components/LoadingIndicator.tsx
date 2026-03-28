import { Loader } from "@mantine/core";
import AllCenter from "./AllCenter";

function LoadingIndicator(){
    return(
        <AllCenter>
            <Loader color="blue" type="bars" size={70}/>
        </AllCenter>
    )
}

export default LoadingIndicator