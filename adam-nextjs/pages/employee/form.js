import { Box, Stack, Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { employee } from '../../Database/employee';
import { useSelector, useDispatch } from 'react-redux';
import { setEmploymentType, setFirstName, setLastName, setAssociateCompany, setSalaryPerHour, addEmployee } from '../../store/reducers/employee';
import { setAccountPassword, setType, addAccount, setAccountFirstName, setAccountLastName,  setAccountEmail, setAccountAssociatedCompany } from '../../store/reducers/account';
import _ from 'lodash';
import { addAccount_id } from '../../store/reducers/company';

export default function AddEmployee() {
    const [seconds, setSeconds] = useState(3);
    const router = useRouter();
    const [emailalert, setShowEmailAlert] = useState(false);
    const [fullnamealert, setShowFullNameAlert] = useState(false);
    const [info, setShowInfo] = useState(false);

    const [addEmployeeClicked, setAddEmployeeClicked] = useState(false);

    const employees = useSelector(state => state.employee);
    const accounts = useSelector(state => state.account);
    const logins = useSelector(state=> state.login);
    const companies = useSelector(state => state.company);
    const [company, setCompany] = useState([]);
    const employment_type = ['Fulltime-Employee', 'Parttime-Employee'];
    const dispatch = useDispatch();

    useEffect(() => {
        if (emailalert === true || fullnamealert === true || info === true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowEmailAlert(false);
                setShowFullNameAlert(false);
                setShowInfo(false);
                setSeconds(3);
            }
        }

        // if (companies.companyData.length !== company.length) {
        //     const newData = _.map(companies.companyData, (value, index) => {
        //         return companies.companyData[index].name
        //         //return {company[index]} ? {...value.name ,companies.companyData[index].name} : value.name;
        //         //return {...companies.companyData[index]}? {...value, ...companies.companyData[index]} : value;
        //     })
        //     setCompany(newData);
        // }

        const employeeFilter = _.filter(employees.employeeData, function (value) {
            return value;
        });
        const accountFilter = _.filter(accounts.accountData, function (value) {
            return value;
        });

        _.map(employeeFilter, (value, index) => {
            if (employeeFilter[index] !== undefined) {
                if (employeeFilter[index].firstname + employeeFilter[index].lastname === employees.firstname + employees.lastname) {
                    setShowFullNameAlert(true);
                }
            }
        });

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

        if(addEmployeeClicked){
            if (!emailalert && !fullnamealert) {
            
                dispatch(setEmploymentType(employees.employment_type));
                dispatch(setAccountAssociatedCompany(accounts.accountData[_.findIndex(accounts.accountData, ['email' ,logins.loginData[0].email])].associated_company));
                dispatch(setType('Employee'));
                dispatch(setAccountFirstName(employees.firstname));
                dispatch(setAccountLastName(employees.lastname));
                const accountLength = accounts.accountData.length;
                const accountID = accounts.accountData[accountLength - 1].account_id + 1;
                const getAccountIndex = _.findIndex(accounts.accountData, ['email', logins.loginData[0].email]);
                const getCompanyIndex = _.findIndex(companies.companyData, ['name', accounts.accountData[getAccountIndex].associated_company]);
                dispatch(addAccount());
                dispatch(addAccount_id({index:getCompanyIndex, id:accountID}));
                dispatch(addEmployee(accountID));
                setShowInfo(true);
    
                // dispatch(setFirstName(''));
                // dispatch(setLastName(''));
                // dispatch(setAccountEmail(''));
                // dispatch(setAccountPassword(''));
                // dispatch(setSalaryPerHour(''));
                // dispatch(setEmploymentType(''));
                // console.log(accountID);
                // console.log(companies.companyData[getCompanyIndex].account_id);
            }
            setAddEmployeeClicked(false);
        }
        // console.log(seconds);
        // console.log(alert);
        // console.log(info);
    }, [seconds, emailalert, fullnamealert, info, addEmployeeClicked]);

    let id = employee[employee.length - 1].empID;

    function handleaddEmployee(event) {
        event.preventDefault();
        setAddEmployeeClicked(true);
    }

    function checkData() {
        // console.log(employees.addEmployeeData);
        // console.log(employees.employeeData[0].firstname + employees.employeeData[0].lastname)
        // console.log(company)
        console.log(employees.employeeData);
        console.log(companies.companyData);
        console.log(accounts.accountData);
    }


    return (
        <Container maxWidth="sm">
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Employee has been successfully added!
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
            <form onSubmit={handleaddEmployee}>
                <Grid container alignItems="center" direction="column" sx={{ mt: 2, p: 2, border: 2 }} maxWidth="md" spacing={2}>
                    <Typography>Add Employee Form</Typography>
                    <Grid item>Enter First Name: <Input required value={employees.firstname} onChange={(event) => dispatch(setFirstName(event.target.value))} sx={{ ml: 4 }} ></Input></Grid>
                    <Grid item>Enter Last Name: <Input required value={employees.lastname} onChange={(event) => dispatch(setLastName(event.target.value))} sx={{ ml: 4 }}></Input></Grid>
                    <Grid item>Enter Email: <Input required value={accounts.email} onChange={(event) => dispatch(setAccountEmail(event.target.value))} sx={{ ml: 9 }}></Input></Grid>
                    <Grid item>Enter Password: <Input required type="password" value={accounts.password} onChange={(event) => dispatch(setAccountPassword(event.target.value))} sx={{ ml: 5 }}></Input></Grid>
                    <Grid item>Enter Hourly Salary: <Input required value={employees.salary_per_hour} onChange={(event) => dispatch(setSalaryPerHour(event.target.value))} sx={{ ml: 2 }}></Input></Grid>
                    <Grid item>Select Employment Type:</Grid>
                    <Select required value={employees.employment_type} onChange={(event) => dispatch(setEmploymentType(event.target.value))}>
                        {_.map(employment_type, (value, index) =>
                            <MenuItem key={index} value={value}>{value}</MenuItem>
                        )}
                    </Select>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Employee</Button>
                </Grid>
            </form>
            <Button onClick={checkData} variant="contained" sx={{ mt: 2 }}>Check Data</Button>
        </Container>
    )
}