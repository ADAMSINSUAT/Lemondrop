import { Select, MenuItem, Button, Container, Collapse, Alert, AlertTitle, Grid, Typography, Input, InputLabel, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { employee } from '../../Database/employee';
import { WifiPasswordTwoTone } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setEmploymentType, setFirstName, setLastName, setSalaryPerHour, updateEmployee } from '../../store/reducers/employee';
import {setAccountPassword, setType, addAccount, deleteAccount, updateAccount, setAccountFullName, setAccountFirstName, setAccountLastName,  setAccountEmail, setAccountAssociatedCompany} from '../../store/reducers/account';
import _ from 'lodash';

export default function UpdateProfile(props) {
    const employees = useSelector(state=>state.employee);
    const accounts = useSelector(state=>state.account);
    const companies = useSelector(state=>state.company);
    const dispatch = useDispatch();
    //Timeout for the notification
    const [seconds, setSeconds] = useState(2);

    //Get the id supplied by the router
    const router = useRouter();
    const id = router.query.id;

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [fullnamealert, setShowFullNameAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    //Variable to hold the employee data
    // const [empData, setEmpData] = useState([]);

    // const [firstname, setFirstName] = useState('');
    // const [lastname, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const employment_type = ['Fulltime-Employee', 'Parttime-Employee'];
    console.log(employees.employeeData)
    useEffect(() => {

        const empIndex = employees.employeeData.findIndex((emp) => emp.account_id === parseInt(router.query.id));
        console.log(empIndex)

        //console.log(employees.employeeData[empIndex].firstname);
        // if (firstname === '') {
        //     setFirstName(employees.employeeData[empIndex].firstname);
        // }
        // if (lastname === '') {
        //     setLastName(employees.employeeData[empIndex].lastname);
        // }
        // if (email === '') {
        //     setEmail(empData[empIndex].email);
        // }
        // if (password === '') {
        //     setPassword(empData[empIndex].password);
        // }

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

        //const filter = employees.employeeData.filter((emp) => emp.account_id !== parseInt(router.query.id));
        const employeeFilter = _.filter(employees.employeeData, function(value){
            return value.account_id !== parseInt(router.query.id);
        });
        const accountFilter = _.filter(accounts.accountData, function(value){
            return value.account_id !== parseInt(router.query.id);
        });
        console.log(accountFilter)

        _.map(accountFilter, (value, index)=>{
            if (accountFilter[index] !== undefined) {
                if(accountFilter[index].type === 'Employee'){
                    if (accountFilter[index].email === accounts.email) {
                        setShowEmailAlert(true);
                    }
                    if (accountFilter[index].firstname + accountFilter[index].lastname === employees.firstname + employees.lastname) {
                        setShowFullNameAlert(true);
                    }
                }
            }
        });

        _.map(employeeFilter, (value, index) => {
            if (employeeFilter[index] !== undefined) {
                if (employeeFilter[index].firstname + employeeFilter[index].lastname === employees.firstname + employees.lastname) {
                    setShowFullNameAlert(true);
                }
            }
        });

    }, [emailalert, fullnamealert, info, seconds, employees]);


    function handleUpdateEmployee(event) {
        event.preventDefault();
        if (!emailalert && !fullnamealert) {
            const empIndex = _.findIndex(employees.employeeData, ['account_id', parseInt(id)]);

            dispatch(updateEmployee(parseInt(empIndex)));
            dispatch(updateAccount(parseInt(id)));
            setShowInfo(true);
        }
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
                        Another employee with the same full name already exists. Please use a different one!
                    </Alert>
                </Collapse>

            {employees.employeeData.filter((data) => data.account_id === parseInt(router.query.id)).map((data, index) => {
                <Typography>Update {data.firstname}'s Form</Typography>
            })}
            <form onSubmit={handleUpdateEmployee}>
                <Grid alignItems="center" container direction="column" sx={{ mt: 2, p: 2, border: 2 }}>

                    <Grid container direction="column" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>Enter First Name: <Input value={employees.firstname} onChange={(event) => dispatch(setFirstName(event.target.value))} sx={{ ml: 4 }} ></Input></Grid>
                        <Grid item>Enter Last Name: <Input value={employees.lastname} onChange={(event) => dispatch(setLastName(event.target.value))} sx={{ ml: 4 }}></Input></Grid>
                        <Grid item>Enter Email: <Input value={accounts.email} onChange={(event) => dispatch(setAccountEmail(event.target.value))} sx={{ ml: 9 }}></Input></Grid>
                        <Grid item>Enter Password: <Input type="password" value={accounts.password} onChange={(event) => dispatch(setAccountPassword(event.target.value))} sx={{ ml: 5 }}></Input></Grid>
                        <Grid item>Enter Hourly Salary: <Input value={employees.salary_per_hour} onChange={(event) => dispatch(setSalaryPerHour(event.target.value))} sx={{ ml: 2 }}></Input></Grid>
                        <Grid item>Enter Employment Type:</Grid>
                        <Select value={employees.employment_type} onChange={(event) => dispatch(setEmploymentType(event.target.value))}>
                            {_.map(employment_type, (value, index) =>
                                <MenuItem key={index} value={value}>{value}</MenuItem>
                            )}
                        </Select>
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Update Employee</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}