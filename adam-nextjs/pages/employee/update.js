import { Box, Select, MenuItem, Button, Container, Collapse, Alert, AlertTitle, Grid, Typography, Input, InputLabel, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { employee } from '../../Database/employee';
import { WifiPasswordTwoTone } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setEmploymentType, setFirstName, setLastName, setSalaryPerHour, updateEmployee } from '../../store/reducers/employee';
import {setAccountPassword, setType, addAccount, deleteAccount, updateAccount, setAccountFullName, setAccountFirstName, setAccountLastName,  setAccountEmail, setAccountAssociatedCompany} from '../../store/reducers/account';
import _ from 'lodash';
import Axios from "axios";

export default function UpdateProfile(props) {
    const [empData, setEmpData] = useState(JSON.parse(localStorage.getItem("employees")));
    const accountData = JSON.parse(localStorage.getItem("account"));
    const compID = accountData.compID;
    // const employees = useSelector(state=>state.employee);
    // const accounts = useSelector(state=>state.account);
    // const companies = useSelector(state=>state.company);
    // const dispatch = useDispatch();
    //Timeout for the notification
    const [seconds, setSeconds] = useState(5);

    //Get the id supplied by the router
    const router = useRouter();
    const id = router.query.id;

    let empID;

    _.filter(empData, ["accID", router.query.id]).map((data)=>
    empID = data.empID
    )

    const [accountAlert, setShowAccountAlert] = useState(false);

    //Show error message from post login request
    const [errorAlert, setShowErrorAlert] = useState(false);

    const [error, setError] = useState('');

    const [accountError, setAccountError] = useState('');

    //Show error message that the email is already taken
    const [emailalert, setShowEmailAlert] = useState(false);

    //Show error message that the full name is already taken
    const [fullnamealert, setShowFullNameAlert] = useState(false);

    //Show additional info
    const [info, setShowInfo] = useState(false);

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlySalary, setHourlySalary] = useState('');
    const [role, setRole] = useState('');
    //Variable to hold the employee data
    // const [empData, setEmpData] = useState([]);

    // const [firstname, setFirstName] = useState('');
    // const [lastname, setLastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const employment_type = ['Fulltime', 'Parttime'];

    useEffect(() => {

        // const empIndex = employees.employeeData.findIndex((emp) => emp.account_id === parseInt(router.query.id));
        // console.log(empIndex)

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
                setSeconds(5);
            }
        }

        _.filter(empData, ["accID", router.query.id]).map((data=>{
            fname === "" ? setFname(data.fname) : "";
            lname === "" ? setLname(data.lname) : "";
            email === "" ? setEmail(data.email) : "";
            password === "" ? setPassword(data.password) : "";
            hourlySalary === "" ? setHourlySalary(data.hourlySalary) : "";
            role === "" ? setRole(data.empType) : "";
        }));
        //const filter = employees.employeeData.filter((emp) => emp.account_id !== parseInt(router.query.id));
        // const employeeFilter = _.filter(employees.employeeData, function (value) {
        //     return value.account_id !== parseInt(router.query.id);
        // });
        // const accountFilter = _.filter(accounts.accountData, function (value) {
        //     return value.account_id !== parseInt(router.query.id);
        // });
        // console.log(accountFilter)

        // _.map(accountFilter, (value, index) => {
        //     if (accountFilter[index] !== undefined) {
        //         if (accountFilter[index].type === 'Employee') {
        //             if (accountFilter[index].email === accounts.email) {
        //                 setShowEmailAlert(true);
        //             }
        //             if (accountFilter[index].firstname + accountFilter[index].lastname === employees.firstname + employees.lastname) {
        //                 setShowFullNameAlert(true);
        //             }
        //         }
        //     }
        // });

        // _.map(employeeFilter, (value, index) => {
        //     if (employeeFilter[index] !== undefined) {
        //         if (employeeFilter[index].firstname + employeeFilter[index].lastname === employees.firstname + employees.lastname) {
        //             setShowFullNameAlert(true);
        //         }
        //     }
        // });

    }, [emailalert, fullnamealert, info, seconds, empData]);


    async function handleUpdateEmployee(event) {
        event.preventDefault();
        try{

            let accountData;
            let employeeData;

            const profPayload = {
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                role: "Employee"
            }

            const empPayload ={
                hourlySalary: hourlySalary,
                empType: role
            }
    
            const baseAccUrl = "http://localhost:8080/account/";
            const finalAccUrl = baseAccUrl + router.query.id;

            const baseEmpUrl = "http://localhost:8080/employee/";
            const finalEmpUrl = baseEmpUrl + empID;

            console.log(finalEmpUrl)
            await Axios(finalAccUrl, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
                data: JSON.stringify(profPayload)
            }).finally(async () => {
                await Axios("http://localhost:8080/account/", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                    }
                }).then(function (response) {
                    accountData = _.filter(response.data, (data) => data.role === "Employee");
                }).then(() => {
                    _.filter(accountData, (data) => data.accID === router.query.id).map(async(data) => {
                        let empPayload = {
                            hourlySalary: hourlySalary,
                            empType: role,
                            accID: data.accID,
                            compID: compID
                        }
                        await Axios(finalEmpUrl, {
                            method: "PUT",
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                            },
                            data: JSON.stringify(empPayload)
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
                                console.log(employeeData, accountData);
                                console.log(merged);
                                localStorage.setItem("employees", JSON.stringify(merged));
                                setEmpData(JSON.parse(localStorage.getItem("employees")))
                            })
                        })
                    });
                })
            })
        }catch(err){
            console.log(err);
            setError(error);
            setShowErrorAlert(true);
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

                
            <form onSubmit={handleUpdateEmployee}>
                <Grid alignItems="center" container direction="column" sx={{ mt: 2, p: 2, border: 2 }}>
                    {_.filter(empData, ['accID', router.query.id]).map((data, index) =>
                        <Box key={index}>
                            <Typography>Update {data.firstname}'s Form</Typography>
                            <Grid container direction="column" spacing={2} sx={{ mt: 1 }}>
                                <Grid item>Enter First Name: <Input required value={fname} onChange={(event) => setFname(event.target.value)} sx={{ ml: 4 }} placeholder={data.fname}></Input></Grid>
                                <Grid item>Enter Last Name: <Input required value={lname} onChange={(event) => setLname(event.target.value)} sx={{ ml: 4 }} placeholder={data.lname}></Input></Grid>
                                <Grid item>Enter Email: <Input required value={email} onChange={(event) => setEmail(event.target.value)} sx={{ ml: 9 }} placeholder={data.email}></Input></Grid>
                                <Grid item>Enter Password: <Input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} sx={{ ml: 5 }} placeholder={data.password}></Input></Grid>
                                <Grid item>Enter Hourly Salary: <Input required value={hourlySalary} onChange={(event) => setHourlySalary(event.target.value)} sx={{ ml: 2 }} placeholder={data.hourlySalary}></Input></Grid>
                                <Grid item>Enter Employment Type:</Grid>
                                <Select required value={role} onChange={(event) => setRole(event.target.value)}>
                                    {_.map(employment_type, (value, index) =>
                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                    )}
                                </Select>
                                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Update Employee</Button>
                            </Grid>
                        </Box>
                    )}
                </Grid>
            </form>
        </Container >
    )
}