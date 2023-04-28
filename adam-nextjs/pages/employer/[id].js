import { Box, Button, Container, Collapse, Alert, AlertTitle, Grid, Typography, Input, InputLabel, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';;
import { useSelector, useDispatch } from 'react-redux';
import { setAccountFullName, setAccountEmail, setAccountPassword, updateAccount, setAccountFirstName, setAccountLastName} from '../../store/reducers/account';
import Axios from "axios";

export default function UpdateProfile(props) {
    const [accountData, setAccountData] = useState(JSON.parse(localStorage.getItem("account")));
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const accID = accountData.accID;
    const role = accountData.role;
    const [error, setError] = useState('');
    // const dispatch = useDispatch();
    // const employees = useSelector(state=>state.employee)
    // const logins = useSelector(state=>state.login);
    // const accounts = useSelector(state=>state.account)
    //Timeout for the notification
    const [seconds, setSeconds] = useState(5);

    //Get the id supplied by the router
    const router = useRouter();
    const id = router.query.id;
    // const element = router.query.id;
    // const id = element.replace(/\D/g, '');

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [fullnamealert, setShowFullNameAlert] = useState(false);

    const [errorAlert, setShowErrorAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    //Variable to hold the employee data
    // const [firstname, setFirstName] = useState('');
    // const [lastname, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    useEffect(() => {

        if ((emailalert===true || fullnamealert===true) || errorAlert === true || info===true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowEmailAlert(false);
                setShowFullNameAlert(false);
                setShowErrorAlert(false);
                setShowInfo(false);
                setSeconds(5);
            }
        }

        fname === "" ? setFname(accountData.fname) : "";
        lname === "" ? setLname(accountData.lname) : "";
        email === "" ? setEmail(accountData.email) : "";
        password === "" ? setPassword(accountData.password) : "";

        // const filter = _.filter(accounts.accountData, function(value){
        //     return value.account_id !== parseInt(router.query.id)
        // });

        // _.map(filter, (value, index)=>{
        //     if (filter[index].email === accounts.email) {
        //         setShowEmailAlert(true);
        //     }
        //     if (filter[index].firstname + filter[index].lastname === accounts.firstname + accounts.lastname) {
        //         setShowFullNameAlert(true);
        //     }
        // }) 

    }, [emailalert, fullnamealert, errorAlert, info, seconds, accountData, seconds]);

    async function updateEmployer(value) {
        try{
            const payload = {
                fname: fname === "" ? accountData.fname : fname,
                lname: lname === "" ? accountData.lname : lname,
                email: email === "" ? accountData.email : email,
                password: password === "" ? accountData.password : password,
                role: role
            }
            const baseUrl = "http://localhost:8080/account/"
            const finalUrl = baseUrl+accID;
            await Axios(finalUrl, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
                data: JSON.stringify(payload)
            }).then(function(response){
                console.log(JSON.stringify(response.data))
                localStorage.setItem("account", JSON.stringify(response.data))
            })
            // await Axios(`"http://localhost:8080/account/${accID}"`, {
            //     method: "GET",
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            //     }
            // }).then(function (response) {
            //     console.log(response)
            // })
            setShowInfo(true);
        }catch(err){
            setError(JSON.stringify(err))
            setShowErrorAlert(true);
            console.log(err)
        }
    }
    function checkData(){
        console.log(accountData)
    }

    return (
        <Container maxWidth="sm">
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Employee credentials has been successfully updated!
                    </Alert>
                </Collapse>
                <Collapse in={emailalert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        This email is already taken. Please use a different one!
                    </Alert>
                </Collapse>
                <Collapse in={fullnamealert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Another employer with the same full name already exists. Please use a different one!
                    </Alert>
                </Collapse>
                <Collapse in={errorAlert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Error: {error}
                    </Alert>
                </Collapse>
            <Grid container alignItems="start" direction="column" sx={{ mt: 2, p: 2, border: 2, borderRadius: 2 }}>
                <Box>
                    <Grid item sx={{ mb: 2 }}>Update Employer Data</Grid>
                    <Grid item>Employer ID: {accountData.accID}</Grid>

                    <Grid container alignItems={"start"} direction="column" spacing={2} sx={{ mx: 1, mt: 2 }}>

                        <Grid item>First Name: <Input required value={fname} onChange={(event) => setFname(event.target.value)} sx={{ ml: 2, px: 2 }} placeholder={accountData.fname}></Input></Grid>
                        <Grid item>Last Name: <Input required value={lname} onChange={(event) => setLname(event.target.value)} sx={{ ml: 2, px: 2 }} placeholder={accountData.lname}></Input></Grid>
                        <Grid item>Email: <Input required value={email} onChange={(event) => setEmail(event.target.value)} sx={{ ml: 6, px: 2 }} placeholder={accountData.email}></Input></Grid>
                        <Grid item>Password: <Input required value={password} onChange={(event) => setPassword(event.target.value)} sx={{ ml: 2, px: 2 }} placeholder={accountData.password}></Input></Grid>
                        <Button variant="contained" sx={{ mx: 25, mt: 2 }} value={accountData.accID} onClick={(event) => updateEmployer(event.target.value)}>Update</Button>
                        <Button variant="contained" sx={{ mx: 25, mt: 2 }} onClick={(event) => checkData()}>Check Data</Button>
                    </Grid>
                </Box>
            </Grid>
        </Container>
    )
}