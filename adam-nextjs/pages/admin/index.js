import { useRouter } from "next/router";
import AddCompany from "./AddCompany";
import UpdateCompany from "./[id]";
import { Container } from "@mui/system";

export default function redirectAdmin(){
    const router = useRouter().query.id;

    //if ( router === undefined) return ;
    const element = router !== undefined ? <UpdateCompany/>: <AddCompany/>;
    //if(router.query.id !== '') return <UpdateProfile/>

    console.log(router);

    return(
        <Container>{element}</Container>
    )
}