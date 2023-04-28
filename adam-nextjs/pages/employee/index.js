import {Container, InputLabel, Input} from '@mui/material';
import { useRouter } from 'next/router';
import UpdateProfile from './update';
import AddEmployee from './form';

export default function Form(){
   const router = useRouter();
   const element = router.query.id !== ''? <UpdateProfile/>: <AddEmployee/>;

   return(
    <div>{element}</div>
   )
}