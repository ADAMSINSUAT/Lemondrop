import { Box, Select, MenuItem, Collapse, AlertTitle, Alert, Container, InputLabel, Input, Grid, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setCompanyName, setCompanyLeaves, setCompanyOverTime, addCompany, updateCompany } from '../../store/reducers/company';
import _ from 'lodash';

export default function UpdateCompany() {
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
            return value.id !== parseInt(router.query.id);
        });

        _.map(companyFilter, (value, index) => {
            if (companyFilter[index] !== undefined) {
                if (companyFilter[index].name === companies.name) {
                    setShowCompanyAlert(true);
                }
            }
        });
    }, [seconds, companynamealert, info, companies]);

    async function updatecompany(value) {
        if (!companynamealert) {
            await setShowInfo(true);
            await dispatch(updateCompany(value));
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
                <Typography>Update Company Form</Typography>
                {_.filter(companies.companyData, ['id', parseInt(router.query.id)]).map((data, index) => (
                    <Box key={index}>
                        <Grid container alignItems={"start"} direction="column" spacing={2} sx={{ mx: 1, mt: 2 }}>
                            <Grid item><Typography>Company ID: {data.id}</Typography></Grid>
                            <Grid item>Enter Company Name: <Input required value={companies.name} onChange={(event) => dispatch(setCompanyName(event.target.value))} sx={{ ml: 2 }} placeholder={data.name}></Input></Grid>
                            <Grid item>Enter Leaves Limit: <Input required value={companies.leaves} onChange={(event) => dispatch(setCompanyLeaves(event.target.value))} sx={{ ml: 5 }} placeholder={data.leaves.toString()}></Input></Grid>
                            <Grid item>Enter Overtime Limit: <Input required value={companies.overtime_limit} onChange={(event) => dispatch(setCompanyOverTime(event.target.value))} sx={{ ml: 4 }} placeholder={data.overtime_limit.toString()}></Input></Grid>

                            <Grid item><Button variant="contained" sx={{ mx:20, mt: 2, textsize: 2 }} value={data.id} onClick={(event) => updatecompany(event.target.value)}>Update Company</Button></Grid>
                            <Grid item><Button onClick={checkData} variant="contained" sx={{ mx: 20, mt: 2 }}>Check Data</Button></Grid>
                        </Grid>
                        </Box>
                    ))}
            </Grid>
        </Container>
    )
}