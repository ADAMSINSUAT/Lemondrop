import { Stack, Button, Container, Collapse, Alert, AlertTitle, Grid, Typography, Input, InputLabel, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';;
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setFullName, setFirstName, setLastName } from '../store/reducers/login';
import { setAccountFullName, setAccountEmail, setAccountPassword, updateAccount, setAccountFirstName, setAccountLastName, updateLogin } from '../store/reducers/account';
import { updateEmployee } from '../store/reducers/employee';

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

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            return value.account_id !== logins.loginData.account_id
        });

        console.log(filter)
        _.map(filter, (value, index)=>{
            if (filter[index].email === accounts.email) {
                setShowEmailAlert(true);
            }
            if(filter[index].fullname === accounts.fullname){
                setShowFullNameAlert(true);
            }
        }) 

        const accIndex = _.findIndex(accounts.accountData, ['account_id', logins.loginData[0].account_id]);
        if(accounts.firstname===''){
            setAccountFirstName(accounts.accountData[accIndex].firstname);
        }
        if(accounts.lastname===''){
            setAccountLastName(accounts.accountData[accIndex].lastname);
        }
        if(accounts.email === ''){
            setAccountEmail(accounts.accountData[accIndex].email);
        }
        if(accounts.password===''){
            setAccountPassword(accounts.accountData[accIndex].password);
        }
    }, [emailalert, fullnamealert, info, seconds, firstname, lastname, email, password, employees, accounts, empData, seconds]);

    function updateEmployer(event) {
        event.preventDefault();

        if (!emailalert && !fullnamealert) {
            dispatch(updateAccount(parseInt(logins.loginData[0].account_id)));
            dispatch(setPassword(accounts.password));
            dispatch(setEmail(accounts.email));
            dispatch(setFullName(accounds.firstname+' '+accounts.lastname));
            dispatch(updateLogin());
            setShowInfo(true);
        }
    }

    return (
        <Container maxWidth="sm">
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Account credentials has been successfully updated!
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
                        Another account with the same full name already exists. Please use a different one!
                    </Alert>
                </Collapse>
            <form onSubmit={updateEmployer}>
                <Grid container alignItems="start" direction="column" sx={{ mt: 2, p: 2, border: 2, borderRadius: 2 }}>
                    {accounts.accountData.filter(emp => emp.account_id === logins.loginData[0].account_id).map((data, index) => (
                        <Stack direction="column" spacing={2} key={index}>
                            <Grid item sx={{ mb: 2 }}>Update Account Data</Grid>
                            <Grid item>Account ID: {data.account_id}</Grid>
                            <Grid item>Account Type: {data.type}</Grid>
                        </Stack>
                    ))}
                    <Grid container alignItems={"start"} direction="column" spacing={2} sx={{ mx: 1, mt:2 }}>
                        
                        <Grid item>First Name: <Input value={accounts.firstname} onChange={(event) => dispatch(setAccountFirstName(event.target.value))} sx={{ ml: 2, px: 2 }}></Input></Grid>
                        <Grid item>Last Name: <Input value={accounts.lastname} onChange={(event) => dispatch(setAccountLastName(event.target.value))} sx={{ ml: 2, px: 2 }}></Input></Grid>
                        <Grid item>Email: <Input value={accounts.email} onChange={(event) => dispatch(setAccountEmail(event.target.value))} sx={{ ml: 6, px: 2 }}></Input></Grid>
                        <Grid item>Password: <Input type="password" value={accounts.password} onChange={(event) => dispatch(setAccountPassword(event.target.value))} sx={{ ml: 2, px: 2 }}></Input></Grid>

                        <Button type="submit" variant="contained" sx={{ mx: 25, mt: 2 }}>Update</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}
