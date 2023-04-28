import { Collapse, Alert, AlertTitle, Modal, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccount } from '../../store/reducers/account';
import { deleteEmployee } from '../../store/reducers/employee';
import { deleteCompany } from '../../store/reducers/company';
import _, { filter } from 'lodash';

export default function CompanyPage(){
    const companies = useSelector(state=>state.company);
    const accounts = useSelector(state=>state.account);
    const employees = useSelector(state=>state.employee);
    const dispatch = useDispatch();
    const router = useRouter();
    const [seconds, setSeconds] = useState(2);
    const [info, setShowInfo] = useState(false);
    const [open, setOpen] = useState(false);
    const [companyID, setCompanyID] = useState('')
    const handleClose = () => {
        setAccountList([]);
        setCompanyID('');
        setOpen(false);
    };
    const accountArr = [];
    const [accountList, setAccountList] = useState([]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      

    useEffect(()=>{
        if (info===true) {
            if (seconds > 0) {
                setTimeout(() => setSeconds(seconds - 1), 1000);
            } else {
                setShowInfo(false);
                setSeconds(2);
            }
        }
        
        if(accountList.length>0){
            setOpen(true);
        }

    }, [seconds, accountArr]);

    async function redirectUpdateCompany(value){
        router.push({
            pathname: '/admin',
            query: {id: value},
        })
    }

    async function passID(compID){
        const compIDs = compID.split(',');
        _.forEach(compIDs, function(value){
            _.map(accounts.accountData, function(accValue){
                if(accValue.account_id === parseInt(value)){
                    const companyIndex = _.findIndex(companies.companyData, ['name', accValue.associated_company]);
                    if (companyIndex !== -1) {
                        //console.log(parseInt(companies.companyData[companyIndex].id));
                        const compID = parseInt(companies.companyData[companyIndex].id);
                        setCompanyID(compID);
                    }
                   accountArr.push(accValue);
                }
            })
        })
        if(accountArr.length>0){
            await setAccountList(accountArr);
        }
        
        await setOpen(true);
    }

    async function handleDelete(){
        _.forEach(accountList, function(value){
            const id = parseInt(value.account_id);
            dispatch(deleteAccount(id));
            dispatch(deleteEmployee(id));
            dispatch(deleteCompany(companyID));
        })
    }

    return (
        <Container maxWidth="md" sx={{ border: 2}}>
            <Collapse in={info}>
                    <Alert severity="info" visible="false">
                        <AlertTitle>Info</AlertTitle>
                        Company has been successfully deleted!
                    </Alert>
                </Collapse>
            <Typography align="center" sx={{ border: 2, width: 500, ml: 22, mt: 2 }}>Company List Page</Typography>

            <Grid container columnSpacing={2}>
            </Grid>

            <Grid justifyContent="center" container sx={{my:2}}>
                <Grid item>
                    <Grid item>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Are you sure you you would like to delete this Company?
                                </Typography> 
                                {accountList.length>0? <Typography>Hi there!</Typography> : <Typography>Hello there!</Typography>}
                                    <Typography sx={{mt:2}}>The following employers/employees will be deleted also.</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Account ID:</TableCell>
                                            <TableCell>Account Name:</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {_.map(accountList, (value, index)=>
                                            <TableRow key={index}>
                                                <TableCell>{value.account_id}</TableCell>
                                                <TableCell>{value.firstname} {value.lastname}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <Button variant="contained" onClick={handleClose} sx={{mt:1}}>Cancel</Button><Button variant="contained" onClick={(event)=>handleDelete(event.target.value)} sx={{mt:1, ml:20}}>Delete</Button>
                            </Box>
                        </Modal>
                    </Grid>
                    <TableContainer sx={{ border: 2, borderRadius: 2, width: 850 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Company ID</TableCell>
                                    <TableCell align="center">Company Name</TableCell>
                                    <TableCell align="center">Account IDs</TableCell>
                                    <TableCell align="center">Company Leaves Limit</TableCell>
                                    <TableCell align="center">Company Overtime Limit</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(companies.companyData, (value, index) =>

                                    <TableRow key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{value.id}</TableCell>
                                        <TableCell align="center" color='#f9faa33'>{value.name}</TableCell>
                                        <TableCell align="center" color='#f9faa33'>{value.account_id.join(', ')}</TableCell>
                                        <TableCell align="center">{value.leaves}</TableCell>
                                        <TableCell align="center">{value.overtime_limit}</TableCell>
                                        <TableCell align="center"><br /><Button variant="contained" value={value.id} onClick={(event)=>redirectUpdateCompany(event.target.value)}>Update</Button><br/><Button sx={{my:1}} variant="contained" value={value.account_id} onClick={(event)=>passID(event.target.value)}>Delete</Button></TableCell>
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