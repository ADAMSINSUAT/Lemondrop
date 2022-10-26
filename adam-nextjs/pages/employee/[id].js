import { useRouter } from 'next/router';
import { employee } from '../../Database/employee';
import { Container, Grid, Box, InputLabel, Stack } from '@mui/material';
//import { Grid3x3Outlined } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function InfoPage() {
    const employees = useSelector(state=>state.employee);
    const accounts = useSelector(state=>state.account);

    const empData = [...employee];

    const router = useRouter();

    const element = router.query.id;
    console.log(element);

    console.log(employees.employeeData.filter((data)=>data.account_id===1))
    //const id = element.replace(/\D/g,'');

    //console.log(parseInt(id));
    //const [id, setID] = useState('');

    // useEffect(()=>{
    //     setID(element.replace(/[<>]/gi, ''));
    // }, [id]);

    return (
        <Container maxWidth="sm">
            <Grid container alignItems="start" direction="column" sx={{ mt: 2, p: 2, border: 2, borderRadius:2 }}>
                {_.filter(employees.employeeData, ['account_id', parseInt(router.query.id)]).map((data, index) => 
                    <Box key={index} >
                        <Grid item sx={{ mb: 2 }}>{data.firstname}'s Profile</Grid>
                        <Grid container alignItems={"start"} direction="column" spacing={2} sx={{ mx: 20 }}>
                            <Grid item>Employee ID: {data.account_id}</Grid>
                            <Grid item>First Name: {data.firstname}</Grid>
                            <Grid item>Last Name: {data.lastname}</Grid>

                            {_.filter(accounts.accountData, ['account_id', parseInt(router.query.id)]).map((accvalue, accindex) =>
                                <Box key={accindex} sx={{ml:2}}>
                                    <Grid item sx={{mt:2}}>Email: {accvalue.email}</Grid>
                                    <Grid item sx={{mt:2}}>Password: {accvalue.password}</Grid>
                                </Box>
                            )}

                            <Grid item>Hourly Salary: {data.salary_per_hour}</Grid>
                            <Grid item>Remaining Leaves: {data.total_leaves}</Grid>
                            <Grid item>Total Absents: {data.total_absences}</Grid>
                            <Grid item>Total Overtime: {data.total_overtime} HRs</Grid>
                            <Grid item>Daily Wage: {data.daily_wage} Pesos</Grid>
                        </Grid>
                    </Box>
                )}
            </Grid>
        </Container>
    )
}