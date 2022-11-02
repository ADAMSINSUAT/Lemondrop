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
import Axios from "axios";

export default function Login() {
    const [accountType, setAccountType] = useState();
    // const employees = useSelector(state=>state.employee);
    // const logins = useSelector(state=>state.login);
    // const accounts = useSelector(state=>state.account);

    //Set login email
    const [email, setEmail] = useState('');

    //Set login password
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [passwordalert, setShowPasswordAlert] = useState(false);

    //Show error message that either email or password is incorrect
    const [accountAlert, setShowAccountAlert] = useState(false);

    //Show error message from post login request
    const [errorAlert, setShowErrorAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    //Timeout for the notification
    const [seconds, setSeconds] = useState(2);
    
    const router = useRouter();

    const [error, setError] = useState('');

    useEffect(()=>{

            if (errorAlert === true || accountAlert === true || info===true) {
                if (seconds > 0) {
                    setTimeout(() => setSeconds(seconds - 1), 1000);
                } else {
                    setShowInfo(false);
                    setShowErrorAlert(false);
                    setShowAccountAlert(false);
                    setSeconds(2);
                }
            }
    }, [errorAlert, accountAlert, info, seconds])

    async function handleLogin(event) {
        event.preventDefault();

        // try{
        //     const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6Imp3dCJ9.eyJzdWIiOlt7ImZuYW1lIjoiQWRhbSBLZWl6emVyIiwiYWNjSUQiOiJjZTI2MmZmYi1mNDZlLTRhZjAtOTkwZS03OWI5ODU4ZjRjM2IiLCJsbmFtZSI6IlNpbnN1YXQiLCJwYXNzd29yZCI6ImFkYW0xMjMiLCJyb2xlIjoiRW1wbG95ZWUiLCJlbWFpbCI6ImFkYW1zaW5zdWF0QGdtYWlsLmNvbSJ9XSwiaWF0IjoxNjY2OTYxNDYwLCJpc3MiOiJsZW1vZHJvcCIsImF1ZCI6ImxlbW9kcm9wIiwiZXhwIjoxNjY2OTY4NjYwfQ.qvZLlNCbO1AjASkkLFrbbt77WnPWDch6aP6HeIjST7n0QZmarM0j0yEwWOx9Hn9JdIUHnnrd95ftRRrNdir952rXd7aaRhMsH1wCtXUTSyrco6Mrrp3AFHd9oLeuoaoqxqeILAnNfTvgrzuIFFgZZ7IsuTP30Q_DIg1epvou6UUZRby1SNKNN4YAZ_rlEoabKGZI4RDeuUIOa0uifWvAeJj09pQHVCve3SrFC3ygOco92ec-Pvw7QsL3WQn6N0X8I_CqIvhokezQCiU0nF-0l8uC-ag5I2svVrxjKh-dACnT_z2Z_OYtdVymkI2btDgBjbau_D_uHLJp5gnS8wB-Tw"
        //     const getData = await Axios("http://localhost:8080/account", {
        //         method: "GET",
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     })
        //     console.log(getData.data)
        // } catch (err) {
        //     console.log(err)
        // }
        try {
            const payload = {
                email: email,
                password: password
            }
            const request = await Axios("http://localhost:8080/login", {
                method: "POST",
                data: JSON.stringify(payload)
            })

            if (request.data === "Incorrect email or password") {
                setShowAccountAlert(true);
            } else {
                _.map(request.data.details.accountData, (data)=>{
                    localStorage.setItem("role", data.role);
                })
                localStorage.setItem("jwt", request.data.token);
                localStorage.setItem("account", JSON.stringify(request.data.details.accountData).replace(/[\[\]']+/g,''));

                if (localStorage.getItem("role") === 'Employer') {
                    console.log(request.data.details.employeeData);
                    localStorage.setItem("employees", JSON.stringify(request.data.details.employeeData));
                    await router.push('/dashboard');
                }
                if (localStorage.getItem("role") === 'Employee') {
                    localStorage.setItem("empData", JSON.stringify(request.data.details.empData))
                    await router.push({
                        pathname: '/dashboard/',
                        query: { role: localStorage.getItem("role") }
                    })
                }
                if (localStorage.getItem("role") === 'Admin') {
                    await router.push({
                        pathname: '/dashboard/',
                        query: { role: localStorage.getItem("role") }
                    })
                }
            }
        } catch (err) {
            setError(JSON.stringify(err));
            setShowErrorAlert(true);
        }
        // const emailindex = _.findIndex(accounts.accountData, {'email': logins.email} );
        // //const passwordindex = _.findIndex(accounts.accountData, {'password': logins.password })

        // if(emailindex === -1){
        //    await setShowEmailAlert(true);
        // }
        // else {
        //     if (accounts.accountData[emailindex].password !== logins.password) {
        //         await setShowPasswordAlert(true);
        //     }
        //     else {
        //         setShowInfo(true);
        //         let roletype = accounts.accountData[emailindex].type;
        //         const account = accounts.accountData[emailindex];
        //         const empIndex = _.findIndex(employees.employeeData, ['account_id', account.account_id]);
        //         const employee = employees.employeeData[empIndex];
        //         if (roletype === 'Employer') {
        //             await dispatch(setAccount_ID(account.account_id))
        //             await dispatch(setFullName(account.firstname + ' ' + account.lastname));
        //             await dispatch(setEmployment_Type(account.type));
        //             await dispatch(loginUser());
        //             await router.push('/dashboard');
        //         }
        //         if (roletype === 'Employee') {

        //             await dispatch(setAccount_ID(account.account_id))
        //             await dispatch(setFullName(employee.firstname + ' ' + employee.lastname));
        //             await dispatch(setEmployment_Type(account.type));
        //             await dispatch(loginUser());
        //             await router.push({
        //                 pathname: '/dashboard/',
        //                 query: { role: roletype }
        //             })
        //         }
        //         if (roletype === 'Admin') {
        //             await dispatch(setAccount_ID(account.account_id))
        //             await dispatch(setFullName(account.fullname));
        //             await dispatch(setEmployment_Type(account.type));
        //             await dispatch(loginUser());
        //             await router.push({
        //                 pathname: '/dashboard/',
        //                 query: { role: roletype }
        //             })
        //         }
        //     }
        //}

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
                <Collapse in={accountAlert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Error: Incorrect email or password
                    </Alert>
                </Collapse>
                <Collapse in={errorAlert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Error: {error}
                    </Alert>
                </Collapse>
                {/* <Collapse in={emailalert}>
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
                </Collapse> */}
            <Grid container direction='column' sx={{ border: 2, p: 2, mt:10 }}>
                <form onSubmit={handleLogin}>
                    <div className={styles.description}>Welcome to the Login Page!</div>

                    <Grid container alignItems="center" direction="column" spacing={2}>
                        <Grid item variant='contained'>Enter email: <input required value={email} onChange={(event) => setEmail(event.target.value)} placeholder='Username@gmail.com'></input></Grid>
                        <Grid item variant='contained' sx={{mr:4}}>Enter password: <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder='Password123'></input></Grid>
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