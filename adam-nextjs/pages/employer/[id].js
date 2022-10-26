import { Box, Button, Container, Collapse, Alert, AlertTitle, Grid, Typography, Input, InputLabel, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';;
import { useSelector, useDispatch } from 'react-redux';
import { setAccountFullName, setAccountEmail, setAccountPassword, updateAccount, setAccountFirstName, setAccountLastName} from '../../store/reducers/account';

export default function UpdateProfile(props) {
    const dispatch = useDispatch();
    const employees = useSelector(state=>state.employee)
    const logins = useSelector(state=>state.login);
    const accounts = useSelector(state=>state.account)
    //Timeout for the notification
    const [seconds, setSeconds] = useState(2);

    //Get the id supplied by the router
    const router = useRouter();
    const id = router.query.id;
    // const element = router.query.id;
    // const id = element.replace(/\D/g, '');

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [fullnamealert, setShowFullNameAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    //Variable to hold the employee data
    const [empData, setEmpData] = useState([]);

    // const [firstname, setFirstName] = useState('');
    // const [lastname, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    useEffect(() => {

        if ((emailalert===true || fullnamealert===true) || info===true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowEmailAlert(false);
                setShowFullNameAlert(false);
                setShowInfo(false);
                setSeconds(2);
            }
        }

        const filter = _.filter(accounts.accountData, function(value){
            return value.account_id !== parseInt(router.query.id)
        });

        _.map(filter, (value, index)=>{
            if (filter[index].email === accounts.email) {
                setShowEmailAlert(true);
            }
            if (filter[index].firstname + filter[index].lastname === accounts.firstname + accounts.lastname) {
                setShowFullNameAlert(true);
            }
        }) 

    }, [emailalert, fullnamealert, info, seconds, accounts, employees, empData, seconds]);

    function updateEmployer(value) {
        if (!emailalert && !fullnamealert) {
            dispatch(updateAccount(value));
            setShowInfo(true);
        }
    }
    function checkData(){
        console.log(accounts.accountData)
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
                <Grid container alignItems="start" direction="column" sx={{ mt: 2, p: 2, border: 2, borderRadius: 2 }}>
                    {_.filter(accounts.accountData, ['account_id', parseInt(router.query.id)]).map((data, index) => (
                        <Box key={index}>
                            <Grid item sx={{ mb: 2 }}>Update Employer Data</Grid>
                            <Grid item>Employer ID: {data.account_id}</Grid>

                            <Grid container alignItems={"start"} direction="column" spacing={2} sx={{ mx: 1, mt: 2 }}>

                                <Grid item>First Name: <Input value={accounts.firstname} onChange={(event) => dispatch(setAccountFirstName(event.target.value))} sx={{ ml: 2, px: 2 }} placeholder={data.firstname}></Input></Grid>
                                <Grid item>Last Name: <Input value={accounts.lastname} onChange={(event) => dispatch(setAccountLastName(event.target.value))} sx={{ ml: 2, px: 2 }} placeholder={data.lastname}></Input></Grid>
                                <Grid item>Email: <Input value={accounts.email} onChange={(event) => dispatch(setAccountEmail(event.target.value))} sx={{ ml: 6, px: 2 }} placeholder={data.email}></Input></Grid>
                                <Grid item>Password: <Input value={accounts.password} onChange={(event) => dispatch(setAccountPassword(event.target.value))} sx={{ ml: 2, px: 2 }} placeholder={data.password}></Input></Grid>
                                <Button variant="contained" sx={{ mx: 25, mt: 2 }} value={data.account_id} onClick={(event)=>updateEmployer(event.target.value)}>Update</Button>
                                <Button variant="contained" sx={{ mx: 25, mt: 2 }} onClick={(event)=>checkData()}>Check Data</Button>
                            </Grid>
                        </Box>
                    ))}
                </Grid>
        </Container>
    )
}