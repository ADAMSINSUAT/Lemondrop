import { useRouter } from "next/router"
import AddEmployer from "./addEmployer";
import UpdateProfile from "./[id]";
export default function redirectEmployer(){
    const router = useRouter().query.id;

    const element = router === undefined? <AddEmployer/>: <UpdateProfile/>;
    //if(router.query.id !== '') return <UpdateProfile/>

    console.log(router)
    return(
        <div>{element}</div>
    )
}