import { Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setCompanyName, setCompanyLeaves, setCompanyOverTime, addCompany } from '../../store/reducers/company';
import _ from 'lodash';

export default function AddCompany() {
    const [seconds, setSeconds] = useState(3);
    const router = useRouter();
    const [companynamealert, setShowCompanyAlert] = useState(false);
    const [info, setShowInfo] = useState(false);
    const companies = useSelector(state => state.company);
    const dispatch = useDispatch();

    useEffect(() => {
        if (companynamealert === true || info === true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowCompanyAlert(false);
                setShowInfo(false);
                setSeconds(3);
            }
        }

        const companyFilter = _.filter(companies.companyData, function (value) {
            return value;
        });
    
        _.map(companyFilter, (value, index) => {
            if (companyFilter[index] !== undefined) {
                if (companyFilter[index].name === companies.name) {
                    setShowCompanyAlert(true);
                }
            }
        });
    }, [seconds, companynamealert, info, companies]);

    async function addcompany() {
        if (!companynamealert) {
            await setShowInfo(true);
            await dispatch(addCompany());
        }
    }

    function checkData() {
        console.log(companies.companyData);
    }
    return (
        <Container maxWidth="sm">
                <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Employer has been successfully added!
                    </Alert>
                </Collapse>
                <Collapse in={companynamealert}>
                    <Alert severity="error" visible="false">
                        <AlertTitle>Error</AlertTitle>
                        This company name already exists! Please use a different name...
                    </Alert>
                </Collapse>
                <Grid alignItems="center" container direction="column" sx={{ mt: 2, p: 2, border: 2 }}>
                    <Typography>Add Company Form</Typography>
                    <Grid container direction="column" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>Enter Company Name: <Input required value={companies.name} onChange={(event) => dispatch(setCompanyName(event.target.value))} sx={{ ml: 2 }} ></Input></Grid>
                        <Grid item>Enter Leaves Limit: <Input required value={companies.leaves} onChange={(event) => dispatch(setCompanyLeaves(event.target.value))} sx={{ ml: 5 }} ></Input></Grid>
                        <Grid item>Enter Overtime Limit: <Input required value={companies.overtime_limit} onChange={(event) => dispatch(setCompanyOverTime(event.target.value))} sx={{ ml: 4 }}></Input></Grid>
                    </Grid>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={(event)=>addcompany()}>Add Company</Button>
                    <Button onClick={checkData} variant="contained" sx={{ mt: 2 }}>Check Data</Button>
                </Grid>
        </Container>
    )
}