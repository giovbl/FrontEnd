import { Outlet } from "react-router-dom";
import AllCenter from "./AllCenter";

function AuthLayout(){
    return(
        <AllCenter>
            <Outlet/>
        </AllCenter>
    )
}

export default AuthLayout