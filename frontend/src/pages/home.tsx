import { AppContext } from "@/app/page";
import { useContext } from "react";
import DashboardPage from "./dashboard2";
import LoginPage from "./login";
import Login from "./login";



const Home = () => {
    /***
     * check for login 
     * if success show dashboard page 
    */
   // @ts-ignore
   const {context} = useContext(AppContext)

    return(
        <div>
            
            {
                context?.user ? <DashboardPage/> : <LoginPage/>
            }
        </div>
    )
}

export default Home ;