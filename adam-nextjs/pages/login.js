import { Collapse, Alert, AlertTitle, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, FormControl, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _ from 'lodash';
import styles from '../styles/Home.module.css'
import redirectPage from './dashboard';
import { getEmployeeData } from '../store/reducers/employee';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, setAccount_ID, setFullName, setEmployment_Type, setEmail, setPassword } from '../store/reducers/login';

export default function Login() {
    const [accountType, setAccountType] = useState();
    const employees = useSelector(state=>state.employee);
    const logins = useSelector(state=>state.login);
    const accounts = useSelector(state=>state.account);
    const dispatch = useDispatch();

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [passwordalert, setShowPasswordAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    //Timeout for the notification
    const [seconds, setSeconds] = useState(2);
    
    const router = useRouter();

    useEffect(()=>{

            if (emailalert===true || passwordalert===true || info===true) {
                if (seconds > 0) {
                    setTimeout(() => setSeconds(seconds - 1), 1000);
                } else {
                    setShowEmailAlert(false);
                    setShowPasswordAlert(false);
                    setShowInfo(false);
                    setSeconds(2);
                }
            }
    }, [emailalert, passwordalert, info, seconds, logins])

    async function handleLogin(event) {
        event.preventDefault();
        
        const emailindex = _.findIndex(accounts.accountData, {'email': logins.email} );
        //const passwordindex = _.findIndex(accounts.accountData, {'password': logins.password })

        if(emailindex === -1){
           await setShowEmailAlert(true);
        }
        else {
            if (accounts.accountData[emailindex].password !== logins.password) {
                await setShowPasswordAlert(true);
            }
            else {
                setShowInfo(true);
                let roletype = accounts.accountData[emailindex].type;
                const account = accounts.accountData[emailindex];
                const empIndex = _.findIndex(employees.employeeData, ['account_id', account.account_id]);
                const employee = employees.employeeData[empIndex];
                if (roletype === 'Employer') {
                    await dispatch(setAccount_ID(account.account_id))
                    await dispatch(setFullName(account.firstname + ' ' + account.lastname));
                    await dispatch(setEmployment_Type(account.type));
                    await dispatch(loginUser());
                    await router.push('/dashboard');
                }
                if (roletype === 'Employee') {

                    await dispatch(setAccount_ID(account.account_id))
                    await dispatch(setFullName(employee.firstname + ' ' + employee.lastname));
                    await dispatch(setEmployment_Type(account.type));
                    await dispatch(loginUser());
                    await router.push({
                        pathname: '/dashboard/',
                        query: { role: roletype }
                    })
                }
                if (roletype === 'Admin') {
                    await dispatch(setAccount_ID(account.account_id))
                    await dispatch(setFullName(account.fullname));
                    await dispatch(setEmployment_Type(account.type));
                    await dispatch(loginUser());
                    await router.push({
                        pathname: '/dashboard/',
                        query: { role: roletype }
                    })
                }
            }
        }

        // await router.push(
        // {
        //     pathname: '/dashboard/',
        //     query: { role: accountType }
        // });
         //await router.push(`/dashboard`, `/dashboard?role=${role}`);
    }

    return (
        <Container maxWidth="sm">
            <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Login Successful! Please wait...
                    </Alert>
                </Collapse>
                <Collapse in={emailalert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Error: This Email does not exist!
                    </Alert>
                </Collapse>
                <Collapse in={passwordalert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Incorrect Password! Please check again...
                    </Alert>
                </Collapse>
            <Grid container direction='column' sx={{ border: 2, p: 2, mt:10 }}>
                <form onSubmit={handleLogin}>
                    <div className={styles.description}>Welcome to the Login Page!</div>

                    <Grid container alignItems="center" direction="column" spacing={2}>
                        <Grid item variant='contained'>Enter email: <input required value={logins.email} onChange={(event) => dispatch(setEmail(event.target.value))} placeholder='Username@gmail.com'></input></Grid>
                        <Grid item variant='contained' sx={{mr:4}}>Enter password: <input type="password" required value={logins.password} onChange={(event) => dispatch(setPassword(event.target.value))} placeholder='Password123'></input></Grid>
                       <Grid item><Button variant='outlined' type='submit'>Login</Button></Grid>
                    </Grid>
                    {/* <div className={styles.input_container}>
                        
                    </div> */}

                    {/* <Grid item>
                        <FormControl maring="normal">
                            <RadioGroup className={styles.select} onChange={(event) => setAccountType(event.target.value)}>
                                <Typography>Role: </Typography>
                                <FormControlLabel value="employer" control={<Radio />} label="Employer" />
                                <FormControlLabel value="employee" control={<Radio />} label="Employee" />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                            </RadioGroup>
                        </FormControl>
                    </Grid> */}

                </form>
            </Grid>
        </Container>
    )
}