import { Stack, Modal, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { computeLeaves } from '../../store/reducers/employee';
import { setCompanyName, setCompanyLeaves, setCompanyOverTime, addCompany } from '../../store/reducers/company';
import { setAccountFullName, setAccountEmail, setAccountPassword, updateAccount, setAccountFirstName, setAccountLastName} from '../../store/reducers/account';
import { logoutUser } from '../../store/reducers/login';
import _ from 'lodash';

export default function Admin() {
    const router = useRouter();
    const employees = useSelector(state => state.employee);
    const employer = useSelector(state=>state.employer);
    const companies = useSelector(state => state.company);
    const accounts = useSelector(state => state.account);
    const logins = useSelector(state=>state.login);
    const dispatch = useDispatch();

    //const companyArr = [];
    const accountArr = [];
    const [companyArr, setCompanyArr] = useState([]);
    const getAccountList = _.filter(accounts.accountData, ['type', 'Employer']);

    

    dispatch(setAccountFirstName(''));
    dispatch(setAccountLastName(''));
    dispatch(setAccountEmail(''));
    dispatch(setAccountPassword(''));

    dispatch(setCompanyName(''));
    dispatch(setCompanyLeaves(''));
    dispatch(setCompanyOverTime(''));

    // _.forEach(companies.companyData, function (value) {
    //     companyArr.push({ name: value.name, ids: value.account_id });
    // });

    

    const accountMap = _.map(getAccountList, (value, index) => {
        return (
            <TableRow key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                    {value.fullname}
                </TableCell>
                <TableCell align="center" color='#f9faa33'>{value.email}</TableCell>
                <TableCell align="center">{value.password}</TableCell>



                <TableCell align="center"><button value={value.account_id}>Details</button><br /><button value={value.account_id}>Update</button></TableCell>
            </TableRow>
        )
    })
    // useEffect(() => {
    //     if(companyArr.length !== companies.companyData){
    //         const newData = _.map(companies.companyData, (value, index)=>{
    //             return {...companies.companyData[index]}? {...value, ...companies.companyData[index]} : value;
    //         })
    //         setCompanyArr(newData)
    //     }
        
        
    // }, [])

    function redirectToAddEmployer() {
        router.push('/employer')
    }

    function handleEmployerUpdate(value){
        router.push({
            pathname: '/employer',
            query: {id: value}
        })
    }

    function redirectToAddCompany(){
        router.push('/admin');
    }

    function redirectToCompanyList(){
        router.push('/admin/CompanyList');
    }

    function handleLogout(event){
        dispatch(logoutUser());
        router.push('/login')
    }

    async function handleRedirectToProfile(event, value){
        await router.push('/profile');
    }

    return (
        <Container maxWidth="md" sx={{ border: 2}}>
            
            <Stack direction="row" spacing={85} sx={{mt:2}}>
            <Button variant="contained" value={logins.loginData.length > 0 ? logins.loginData[0].account_id : ''} onClick={(event) => handleRedirectToProfile(event.target.value)}>{logins.loginData.length > 0 ? logins.loginData[0].fullname : ''} </Button>
            <Button variant="contained" onClick={(event) => handleLogout()} sx={{ ml: 75 }}>Log out </Button>
            </Stack>

            <Grid container columnSpacing={2}>
            <Grid item><Button variant="contained" onClick={redirectToAddEmployer} sx={{mt:10}}>Add Employer</Button></Grid>
            <Grid item><Button variant="contained" onClick={redirectToAddCompany} sx={{mt:10}}>Add Company</Button></Grid>
            <Grid item><Button variant="contained" onClick={redirectToCompanyList} sx={{mt:10}}>To Company List</Button></Grid>
            {/* <Grid item><Button variant="contained" onClick={redirectToCompanyList} sx={{mt:10}}>To Company List</Button></Grid> */}
            </Grid>

            <Grid justifyContent="center" container sx={{my:2}}>
                <Grid item>
                    <TableContainer sx={{ border: 2, borderRadius: 2, width: 850 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Password</TableCell>
                                    <TableCell align="center">Associated Company</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(getAccountList, (value, index) =>

                                    <TableRow key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {value.firstname} {value.lastname}
                                        </TableCell>
                                        <TableCell align="center" color='#f9faa33'>{value.email}</TableCell>
                                        <TableCell align="center">{value.password}</TableCell>
                                        <TableCell align="center">{companies.companyData[_.findIndex(companies.companyData, ['name', value.associated_company])].name}</TableCell>
                                        
                                        {/* {_.map(companies.companyData, (compValue) => {
                                            _.map(compValue.account_id, (newValue) =>
                                                <Box key={index}>
                                                    <TableCell align="center">{compValue.name}</TableCell>
                                                </Box>
                                            )
                                        })} */}
                                        {/* {newValue === value.account_id ? <TableCell align="center">{compValue.name}</TableCell> : ''} */}
                                        {/* {_.map(companies.companyData, (newvalue)=><TableCell align="center">{newvalue.name}</TableCell>)} */}
                                        {/* {_.map(companies.companyData, (newvalue, newindex) => <Box key={newindex}> {_.map(newvalue.account_id, (finalvalue, finalindex) => <Box key={finalindex}> {finalvalue === value.account_id ? <TableCell align="center">{newvalue.name}</TableCell> : ''} </Box>)} </Box>)} */}
                                        {_.map()}
                                        <TableCell align="center"><br /><Button variant="contained" value={value.account_id} onClick={(event)=>handleEmployerUpdate(event.target.value)}>Update</Button></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    )
}