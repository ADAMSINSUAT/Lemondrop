import { Box, Stack, Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { employee } from '../../Database/employee';
import { useSelector, useDispatch } from 'react-redux';
import { setEmploymentType, setFirstName, setLastName, setAssociateCompany, setSalaryPerHour, addEmployee } from '../../store/reducers/employee';
import { setAccountPassword, setType, addAccount, setAccountFirstName, setAccountLastName,  setAccountEmail, setAccountAssociatedCompany } from '../../store/reducers/account';
import _ from 'lodash';
import { addAccount_id } from '../../store/reducers/company';
import Axios from "axios";

export default function AddEmployee() {
    const [empData, setEmpData] = useState(JSON.parse(localStorage.getItem("employees")));
    const [seconds, setSeconds] = useState(5);

    //const router = useRouter();
    // const [emailalert, setShowEmailAlert] = useState(false);
    // const [fullnamealert, setShowFullNameAlert] = useState(false);

    //Show error message that either email or password is incorrect
    const [accountAlert, setShowAccountAlert] = useState(false);

    //Show error message from post login request
    const [errorAlert, setShowErrorAlert] = useState(false);

    const [error, setError] = useState('');

    const [info, setShowInfo] = useState(false);

    const [addEmployeeClicked, setAddEmployeeClicked] = useState(false);

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlySalary, setHourlySalary] = useState('');
    const [role, setRole] = useState('');
    
    const accountData = JSON.parse(localStorage.getItem("account"));
    const compID = accountData.compID;
    // const employees = useSelector(state => state.employee);
    // const accounts = useSelector(state => state.account);
    // const logins = useSelector(state=> state.login);
    // const companies = useSelector(state => state.company);
    // const [company, setCompany] = useState([]);
    const employment_type = ['Fulltime', 'Parttime'];
    const dispatch = useDispatch();

    useEffect(() => {
        if (accountAlert === true || errorAlert === true || info === true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                // setShowEmailAlert(false);
                // setShowFullNameAlert(false);
                setShowAccountAlert(false);
                setShowErrorAlert(false);
                setShowInfo(false);
                setSeconds(5);
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

        // const employeeFilter = _.filter(empData, function (value) {
        //     return value;
        // });

        // _.map(employeeFilter, (value, index) => {
        //     if (employeeFilter[index] !== undefined) {
        //         if (employeeFilter[index].fname + employeeFilter[index].lname === fname + lname) {
        //             setShowFullNameAlert(true);
        //         }
        //         if(employeeFilter[index].email === email){
        //             setShowEmailAlert(true);
        //         }
        //     }
        // });


        // if(addEmployeeClicked){
        //     if (!emailalert && !fullnamealert) {
            
        //         dispatch(setEmploymentType(employees.employment_type));
        //         dispatch(setAccountAssociatedCompany(accounts.accountData[_.findIndex(accounts.accountData, ['email' ,logins.loginData[0].email])].associated_company));
        //         dispatch(setType('Employee'));
        //         dispatch(setAccountFirstName(employees.firstname));
        //         dispatch(setAccountLastName(employees.lastname));
        //         const accountLength = accounts.accountData.length;
        //         const accountID = accounts.accountData[accountLength - 1].account_id + 1;
        //         const getAccountIndex = _.findIndex(accounts.accountData, ['email', logins.loginData[0].email]);
        //         const getCompanyIndex = _.findIndex(companies.companyData, ['name', accounts.accountData[getAccountIndex].associated_company]);
        //         dispatch(addAccount());
        //         dispatch(addAccount_id({index:getCompanyIndex, id:accountID}));
        //         dispatch(addEmployee(accountID));
        //         setShowInfo(true);
    
        //         // dispatch(setFirstName(''));
        //         // dispatch(setLastName(''));
        //         // dispatch(setAccountEmail(''));
        //         // dispatch(setAccountPassword(''));
        //         // dispatch(setSalaryPerHour(''));
        //         // dispatch(setEmploymentType(''));
        //         // console.log(accountID);
        //         // console.log(companies.companyData[getCompanyIndex].account_id);
        //     }
        //     setAddEmployeeClicked(false);
        // }
        // console.log(seconds);
        // console.log(alert);
        // console.log(info);
    }, [seconds, accountAlert, errorAlert, info, addEmployeeClicked]);

    let id = employee[employee.length - 1].empID;

    async function handleaddEmployee(event) {
        event.preventDefault();
        let accountData;
        let employeeData;
        let newaccountData;

        try{
            let profPayload = {
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                role: "Employee"
            }
            
            await Axios("http://localhost:8080/account/", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
                data: JSON.stringify(profPayload)
            }).then(function (response) {
                if (response.data === 'An account with the same name or email already exists!') {
                    setAccountAlert(true);
                    setShowInfo(false);
                    return;
                } else {
                    setAccountAlert(false);
                    setShowInfo(true);
                }
            }).finally(async () => {
                await Axios("http://localhost:8080/account/", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                    }
                }).then(function (response) {
                    accountData = _.filter(response.data, (data) => data.role === "Employee")
                    newaccountData = _.filter(response.data, (data) => data.fname + data.lname === fname + lname);
                }).then(() => {
                    _.map(newaccountData, async(data) => {

                        let empPayload = {
                            hourlySalary: hourlySalary,
                            empType: role,
                            accID: data.accID,
                            compID: compID
                        };



                        await Axios("http://localhost:8080/employee/", {
                            method: "POST",
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                            },
                            data: await JSON.stringify(empPayload)
                        }).then(function (empResponse) {
                            if (empResponse.data === "That account ID is already registered as an employee") {
                                setError("Employee is already registered!");
                                setShowErrorAlert(true);
                            } else {
                                setShowAccountAlert(false);
                                setShowInfo(true);
                                setFname('');
                                setLname('');
                                setEmail('');
                                setPassword('');
                                setHourlySalary('');
                                setRole('');
                            }
                        }).finally(async () => {
                            await Axios("http://localhost:8080/employee/", {
                                method: "GET",
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                                }
                            }).then(function (response) {
                                employeeData = response.data;

                                const merged = _(employeeData).keyBy('accID').merge(_.keyBy(accountData, 'accID')).values().value();
                                // console.log(employeeData, accountData);
                                // console.log(merged);
                                localStorage.setItem("employees", JSON.stringify(merged));
                            })
                        })
                    })
                })
            })
        }catch(err){
            console.log(err)
            // setError(err);
            // setShowErrorAlert(true);
        }
        //setAddEmployeeClicked(true);
    }

    function checkData() {
        
    }


    return (
        <Container maxWidth="sm">
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Employee has been successfully added!
                    </Alert>
                </Collapse>
                <Collapse in={accountAlert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Error: An account with the same name or email already exists!
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
                        This email is already taken. Please use a different one!
                    </Alert>
                </Collapse>
                <Collapse in={fullnamealert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        Another employee with the same full name already exists. Please use a different one!
                    </Alert>
                </Collapse> */}
            <form onSubmit={handleaddEmployee}>
                <Grid container alignItems="center" direction="column" sx={{ mt: 2, p: 2, border: 2 }} maxWidth="md" spacing={2}>
                    <Typography>Add Employee Form</Typography>
                    <Grid item>Enter First Name: <Input required value={fname} onChange={(event) => setFname(event.target.value)} sx={{ ml: 4 }} ></Input></Grid>
                    <Grid item>Enter Last Name: <Input required value={lname} onChange={(event) => setLname(event.target.value)} sx={{ ml: 4 }}></Input></Grid>
                    <Grid item>Enter Email: <Input required value={email} onChange={(event) => setEmail(event.target.value)} sx={{ ml: 9 }}></Input></Grid>
                    <Grid item>Enter Password: <Input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} sx={{ ml: 5 }}></Input></Grid>
                    <Grid item>Enter Hourly Salary: <Input type='number' required value={hourlySalary} onChange={(event) => setHourlySalary(event.target.value)} sx={{ ml: 2 }}></Input></Grid>
                    <Grid item>Select Employment Type:</Grid>
                    <Select required value={role} onChange={(event) => setRole(event.target.value)}>
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