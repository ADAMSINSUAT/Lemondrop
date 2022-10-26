import { useRouter } from "next/router";
import Admin from "./admin";
import Employee from "./employee";
import Employer from "./employer";
import Login from "../login";
import { useEffect } from "react";


export default function redirectPage() {
    const router = useRouter();
    const element = router.query.role;

    // const adminPage = router.query.role=== 'Admin'? <Admin/>: '';
    // const employeePage = router.query.role=== 'Employee'? <Employee/>: '';

    if(router.query.role === 'Admin') return <Admin/>

    if(router.query.role === 'Employee') return <Employee/>

    //const employerPage = router.query.role === ''? <Employer/>: '';

    // useEffect(()=>{

    //     if(router.query.role){
    //         console.log('Employer')
    //         router.push('/dashboard/employer', '/dashboard')
    //     }
    // })

    return (
        <div>
           <div><Employer/></div>
        </div>
    )
}