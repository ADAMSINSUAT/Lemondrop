import { Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { employee } from '../../Database/employee';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountEmail, setAccountPassword, setAccountFullName, setAccountFirstName, setAccountLastName, setType, addAccount, setAccountAssociatedCompany } from '../../store/reducers/account';
import {setEmployerEmployment, setEmployerAccount_ID, setEmployerAssociated_Company, setEmployerEmail, setEmployerPassword} from '../../store/reducers/employer'
import _ from 'lodash';
import { addAccount_id } from '../../store/reducers/company';

export default function AddEmployer() {
    const [seconds, setSeconds] = useState(3);
    const router = useRouter();
    const [emailalert, setShowEmailAlert] = useState(false);
    const [fullnamealert, setShowFullNameAlert] = useState(false);
    const [info, setShowInfo] = useState(false);

    const employees = useSelector(state => state.employee);
    const accounts = useSelector(state => state.account);
    const companies = useSelector(state => state.company);
    const [company, setCompany] = useState([]);
    const [assocCompany, setAssocCompany] = useState('');
    //const company = [];
    const dispatch = useDispatch();

    // const companyList = 
    // _.map(companies.companyData, (value, index)=>{
    //     console.log(value.name);
    // })

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

        if (companies.companyData.length !== company.length) {
            const newData = _.map(companies.companyData, (value, index) => {
                return companies.companyData[index].name
            })
            setCompany(newData);
        }

        const accountFilter = _.filter(accounts.accountData, function (value) {
            return value;
        });

        _.map(accountFilter, (value, index)=>{

            if (accountFilter[index].type === 'Employer') {
                if (accountFilter[index] !== undefined) {
                    if (accountFilter[index].email === accounts.email) {
                        setShowEmailAlert(true);
                    }
                }
                if (accountFilter[index] !== undefined) {
                    if (accountFilter[index].firstname + accountFilter[index].lastname === accounts.firstname + accounts.lastname) {
                        setShowFullNameAlert(true);
                    }
                }
            }
        })
    }, [seconds, emailalert, fullnamealert, info, employees, accounts, company, companies, assocCompany]);

    let id = employee[employee.length - 1].empID;

    async function addEmployer(event) {
        event.preventDefault();
        await dispatch(setType('Employer'))
        if (!emailalert && !fullnamealert) {
            await setShowInfo(true);
            const accountLength = accounts.accountData.length;
            const accountID = accounts.accountData[accountLength -1].account_id;
            const getCompanyIndex = _.findIndex(companies.companyData, ['name', assocCompany]);
            await dispatch(setAccountAssociatedCompany(assocCompany))
            await dispatch(addAccount());
            await dispatch(addAccount_id({index: getCompanyIndex, id: accountID}))
        }
    }

    function checkData() {
        console.log(accounts.accountData)
        console.log(companies.companyData);
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
                <Grid alignItems="center" container direction="column" sx={{ mt: 2, p: 2, border: 2 }}>
                    <Typography>Add Employer Form</Typography>
                    <Grid container direction="column" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>Enter First Name: <Input value={accounts.firstname} onChange={(event) => dispatch(setAccountFirstName(event.target.value))} sx={{ ml: 4 }} ></Input></Grid>
                        <Grid item>Enter Last Name: <Input value={accounts.lastname} onChange={(event) => dispatch(setAccountLastName(event.target.value))} sx={{ ml: 4 }} ></Input></Grid>
                        <Grid item>Enter Email: <Input value={accounts.email} onChange={(event) => dispatch(setAccountEmail(event.target.value))} sx={{ ml: 9 }}></Input></Grid>
                        <Grid item>Enter Password: <Input type="password" value={accounts.password} onChange={(event) => dispatch(setAccountPassword(event.target.value))} sx={{ ml: 5 }}></Input></Grid>
                    </Grid>
                    <Typography>Choose a company: </Typography>
                    <Select value={assocCompany} onChange={(event) => setAssocCompany(event.target.value)}>
                    {_.map(companies.companyData,((val, index) => 
                    <MenuItem key={index} value={val.name}>{val.name}</MenuItem>))}
                    </Select>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Employer</Button>
                    <Button onClick={checkData} variant="contained" sx={{ mt: 2 }}>Check Data</Button>
                </Grid>
            </form>
        </Container>
    )
}