import { Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { employee } from '../../Database/employee';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountEmail, setAccountPassword, setAccountFullName, setAccountFirstName, setAccountLastName, setType, addAccount, setAccountAssociatedCompany } from '../../store/reducers/account';
import {setEmployerEmployment, setEmployerAccount_ID, setEmployerAssociated_Company, setEmployerEmail, setEmployerPassword} from '../../store/reducers/employer'
import _ from 'lodash';
import { addAccount_id } from '../../store/reducers/company';
import Axios from "axios";

export default function AddEmployer() {
    const [seconds, setSeconds] = useState(5);
    const router = useRouter();
    const [emailalert, setShowEmailAlert] = useState(false);
    const [fullnamealert, setShowFullNameAlert] = useState(false);
    const [error, setError] = useState('');
    const [errorAlert, setShowErrorAlert] = useState(false);
    const [addInfo, setAddInfo] = useState('')
    const [info, setShowInfo] = useState(false);

    const [company, setCompany] = useState(JSON.parse(localStorage.getItem("companies")));

    const [compID, setCompID] = useState('');
    //const [compID, setCompID]
    // const employees = useSelector(state => state.employee);
    // const accounts = useSelector(state => state.account);
    // const companies = useSelector(state => state.company);
    //const [company, setCompany] = useState([]);
    const [assocCompany, setAssocCompany] = useState('');
    //const company = [];
    const dispatch = useDispatch();

    const [employers, setEmployers] = useState(JSON.parse(localStorage.getItem("employers")))
   
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlySalary, setHourlySalary] = useState('');
    const role = "Employer";
    const employment_type = ['Fulltime', 'Parttime'];

    useEffect(() => {
        if (emailalert === true || fullnamealert === true || info === true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowEmailAlert(false);
                setShowFullNameAlert(false);
                setShowInfo(false);
                setSeconds(5);
            }
        }

        // if (companies.companyData.length !== company.length) {
        //     const newData = _.map(companies.companyData, (value, index) => {
        //         return companies.companyData[index].name
        //     })
        //     setCompany(newData);
        // }

        // const accountFilter = _.filter(accounts.accountData, function (value) {
        //     return value;
        // });

        // _.map(accountFilter, (value, index)=>{

        //     if (accountFilter[index].type === 'Employer') {
        //         if (accountFilter[index] !== undefined) {
        //             if (accountFilter[index].email === accounts.email) {
        //                 setShowEmailAlert(true);
        //             }
        //         }
        //         if (accountFilter[index] !== undefined) {
        //             if (accountFilter[index].firstname + accountFilter[index].lastname === accounts.firstname + accounts.lastname) {
        //                 setShowFullNameAlert(true);
        //             }
        //         }
        //     }
        // })
    }, [seconds, emailalert, fullnamealert, info, employers]);

    async function addEmployer(event) {
        event.preventDefault();
        let accountData;
        let employeeData;


        try{
            let profPayload = {
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                role: "Employer"
            }

            await Axios("http://localhost:8080/account/", {
                method: "POST",
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
                    accountData = _.filter(response.data, (data) => data.role === "Employer" && (data.fname + data.lname === fname + lname));
                }).then(() => {
                    _.map(accountData,  async (data, index) => {
                        // const insertAccount = _.filter(accountData, (data)=>data.fname + data.lname === fname + lname)
                        let empPayload = {
                            accID: accountData.accID,
                            compID: compID
                        };

                        console.log(empPayload)
                        await Axios("http://localhost:8080/employer/", {
                            method: "POST",
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                            },
                            data: JSON.stringify(empPayload)
                        }).then(function (empResponse) {
                            if(empResponse.data === "That account ID is already registered as an employee"){
                                setError("Employee is already registered!");
                                setShowErrorAlert(true);
                            }else{
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
                            await Axios("http://localhost:8080/employer/", {
                                method: "GET",
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                                }
                            }).then(function(response){
                                employeeData = response.data;

                                const merged = _(employeeData).keyBy('accID').merge(_.keyBy(accountData, 'accID')).values().value();
                                console.log(employeeData, accountData);
                                console.log(merged);
                                localStorage.setItem("employers", JSON.stringify(merged));
                            })
                        })
                    })
                })
            })
        }catch(err){
            console.log(err)
            setError(err);
            setShowErrorAlert(true);
        }
        await Axios("http")
    }

    function checkData() {
        
    }


    return (
        <Container maxWidth="sm">
            <form onSubmit={addEmployer}>
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Employer has been successfully added!
                    </Alert>
                </Collapse>
                <Collapse in={errorAlert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        error: {error}
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
                        Another employer with the same full name already exists. Please use a different one!
                    </Alert>
                </Collapse> */}
                <Grid container alignItems="center" direction="column" sx={{ mt: 2, p: 2, border: 2 }} maxWidth="md" spacing={2}>
                    <Typography>Add Employee Form</Typography>
                    <Grid item>Enter First Name: <Input required value={fname} onChange={(event) => setFname(event.target.value)} sx={{ ml: 4 }} ></Input></Grid>
                    <Grid item>Enter Last Name: <Input required value={lname} onChange={(event) => setLname(event.target.value)} sx={{ ml: 4 }}></Input></Grid>
                    <Grid item>Enter Email: <Input required value={email} onChange={(event) => setEmail(event.target.value)} sx={{ ml: 9 }}></Input></Grid>
                    <Grid item>Enter Password: <Input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} sx={{ ml: 5 }}></Input></Grid>
                    <Grid item>Enter Hourly Salary: <Input required value={hourlySalary} onChange={(event) => setHourlySalary(event.target.value)} sx={{ ml: 2 }}></Input></Grid>
                    <Grid item>Select Company: </Grid>
                    <Select required value={compID} onChange={(event) => setCompID(event.target.value)}>
                        {_.map(company, (value, index) =>
                            <MenuItem key={index} value={value.compID}>{value.compName}</MenuItem>
                        )}
                    </Select>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Employee</Button>
                </Grid>
            </form>
        </Container>
    )
}