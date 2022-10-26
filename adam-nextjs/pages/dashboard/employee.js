import { Collapse, Alert, AlertTitle, TextField, Modal, Table, TableCell, TableRow, TableHead, TableBody, Typography, Avatar, Stack, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import EmployeeTable from '../../Components/EmployeeTable';
import { employer } from '../../Database/employer';
import { computeLeaves, computeOvertime, computeAbsences } from '../../store/reducers/employee';
import { getCompany } from '../../store/reducers/company';
import { employee } from '../../Database/employee';
import { ContactlessOutlined } from '@mui/icons-material';
import { logoutUser } from '../../store/reducers/login';
import _ from 'lodash';
import { deepOrange, deepGreen, deepPurple, white, green } from '@mui/material/colors';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {format, isBefore, isSameSecond, isSameMinute, isSameHour, isSameDay, isEqual, parseISO, parse} from 'date-fns';
import { setLeaveAccountID, setLeaveReason, setLeaveDateStarted, setLeaveDateEnded, requestLeave, deleteLeave, updateLeave, confirmLeave, afteConfirmLeave, denyLeave } from '../../store/reducers/leave';
import { setOvertimeAccountID, setOvertimeDateStarted, setOvertimeDateEnded, requestOvertime, deleteOvertime, updateOvertime, confirmOvertime, afteConfirmOvertime, denyOvertime } from '../../store/reducers/overtime';

export default function Employer() {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employee);
    const companies = useSelector(state => state.company);
    const accounts = useSelector(state=>state.account);
    const logins = useSelector(state => state.login);
    const leaves = useSelector(state=>state.leave);
    const [value, setValue] = useState();
    const router = useRouter();
    const [openLeave, setLeaveOpen] = useState(false);
    const [openOvertime, setOvertimeOpen] = useState(false);

    const [dtLeaveStart, setDTLeaveStart] = useState(format(new Date(), 'MM/dd/yyyy'));
    const [dtLeaveEnd, setDTLeaveEnd] = useState(format(new Date(), 'MM/dd/yyyy'));

    const [dtOvertimeStart, setDTOvertimeStart] = useState(new Date());
    const [dtOvertimeEnd, setDTOvertimeEnd] = useState(new Date());

    const [showSameDayAlert, setShowSameDayAlert] = useState(false);
    const [showBeforeDayAlert, setShowBeforeDayAlert] = useState(false);
    const [showIncorrectTimeAlert, setShowIncorrectTimeAlert] = useState(false);

    const[leaveClicked, setLeaveClicked] = useState(false);
    const [overtimeClicked, setOvertimeClicked] = useState(false);

    const dateOvertime = format(new Date(), 'MM/dd/yyyy');

    const handleClose = () => 
    {
        dispatch(setLeaveReason(''));
        setLeaveOpen(false);
        setOvertimeOpen(false);
        setShowBeforeDayAlert(false);
        setShowIncorrectTimeAlert(false);
        setDTLeaveStart(format(new Date(), 'MM/dd/yyy'));
        setDTLeaveEnd(format(new Date(), 'MM/dd/yyy'));
        setDTOvertimeStart(new Date());
        setDTOvertimeEnd(new Date());
    };

    const id = logins.loginData.length>0?logins.loginData[0].account_id: '';
    const companyList = [];

    let associated_comp;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 'auto',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    // _.forEach(companies.companyData, (compValue, index)=>{
    //     if(compValue.account_id !== ''){
    //         _.forEach(compValue, function(accValue){
    //             if(accValue === logins.loginData.account_id){
    //                 associated_comp = compValue.name
    //             }
    //         })
    //     }
    // })
    
    const [profileData , setProfileData] = useState([]);

    useEffect(() =>{
        if (profileData.length !== employees.employeeData.length) {
            const newData = employees.employeeData.map((data, index) => {
                return (profileData[index]) ? { ...data, ...profileData[index] } : data;
            })
            setProfileData(newData);
        }
        
        _.forEach(companies.companyData, function(value){
            companyList.push(value);
        })

        _.forEach(companyList, function(value){
            dispatch(computeLeaves(value));
        })

        _.forEach(companyList, function(value){
            dispatch(computeAbsences(value));
        })

        const formattedLeaveStart = parse(dtLeaveStart, 'MM/dd/yyyy', new Date());
        const formattedLeaveEnd  = parse(dtLeaveEnd, 'MM/dd/yyyy', new Date());

        if(leaveClicked){
            if(isBefore(formattedLeaveEnd, formattedLeaveStart )){
                setShowBeforeDayAlert(true);
                setLeaveClicked(false);
            }
            else{
                dispatch(setLeaveDateStarted(dtLeaveStart));
                dispatch(setLeaveDateEnded(dtLeaveEnd));
                dispatch(requestLeave(id));
                setShowBeforeDayAlert(false);
                setLeaveClicked(false);
                setLeaveOpen(false);
            }
        }

        const formattedOvertimeStart = new Date(dtOvertimeStart);
        const formattedOvertimeEnd  = new Date(dtOvertimeEnd);

        const ifBeforeHour = isBefore(formattedOvertimeStart, formattedOvertimeEnd);

        if(overtimeClicked){

            if(!ifBeforeHour){
                setShowIncorrectTimeAlert(true);
            }
            else{
                dispatch(setOvertimeDateStarted(format(formattedOvertimeStart, 'MM/dd/yyyy hh:mm:ss a')));
                dispatch(setOvertimeDateEnded(format(formattedOvertimeEnd, 'MM/dd/yyyy hh:mm:ss a')));
                dispatch(requestOvertime(id));
                setShowIncorrectTimeAlert(false);
                setOvertimeOpen(false);
            }
            setOvertimeClicked(false);
        }
    }, [showBeforeDayAlert, showIncorrectTimeAlert, leaveClicked, overtimeClicked])

    function handleLogout(event){
        dispatch(logoutUser());
        router.push('/login')
    }

    async function handleRedirectToProfile(event, value){
        await router.push({
            pathname: '/employer/form',
            query: {id: value},
        })
    }

    function handleRequestLeave(event){
        event.preventDefault();
        setLeaveClicked(true);
    }

    function handleRequestOvertime(event){
        event.preventDefault();
        setOvertimeClicked(true);
    }

    function checkData(){
        console.log(leaves.leavesData);
    }
    
    
    const employmentdetails = [...employer];

    return (
        <Box maxWidth="md" sx={{mx:20, my:2}}>
            <Grid container direction='row' sx={{ border: 2, p:2, width:670 }} spacing={2}>
                <Stack direction="row" spacing={50}>
                    <Button variant="contained" value={logins.loginData.length > 0 ? parseInt(id) : <Box></Box>} onClick={(event) => handleRedirectToProfile(event.target.value)}>{logins.loginData.length > 0 ? logins.loginData[0].fullname : ''} </Button>
                    <Button variant="contained" onClick={(event) => handleLogout()}>Log out </Button>
                </Stack>

                <Stack direction="row" sx={{mt:5}} spacing={2}>
                    <Button variant="contained" onClick={()=>setLeaveOpen(true)}>Request Leave</Button>
                    <Button variant="contained" onClick={()=>setOvertimeOpen(true)}>Request Overtime</Button>
                    <Button variant="contained" onClick={()=>checkData()}>Check Data</Button>
                </Stack>

                <Modal open={openLeave} onClose={handleClose} id='leave'>
                    <Box sx={style}>
                        <Typography sx={{ mx: 16 }}>Request Leave</Typography>
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <form onSubmit={handleRequestLeave}>
                                <Stack direction="column" spacing={3}>
                                    <Collapse in={showBeforeDayAlert}>
                                        <Alert severity="error" visible="false">
                                            <AlertTitle>Error</AlertTitle>
                                            Invalid date! Date Start must be before Date End
                                        </Alert>
                                    </Collapse>
                                    <DatePicker required id='date-started' label='Date Start' renderInput={(params) => <TextField {...params} />} value={dtLeaveStart} onChange={(newDate) => setDTLeaveStart(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                    <DatePicker required id='date-ended' label='Date End' renderInput={(params) => <TextField {...params} />} value={dtLeaveEnd} onChange={(newDate) => setDTLeaveEnd(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                    <TextField required variant="outlined" id='reason' label='Reason' value={leaves.reason} onChange={(event)=>dispatch(setLeaveReason(event.target.value))}></TextField>
                                    <Button variant="contained" type="submit">Request Leave</Button>
                                </Stack>
                            </form>
                        </LocalizationProvider>
                    </Box>
                </Modal>

                <Modal open={openOvertime} onClose={handleClose} id='leave'>
                    <Box sx={style}>
                        <Typography sx={{ mx: 16 }}>Request Overtime</Typography>
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <form onSubmit={handleRequestOvertime}>
                                <Stack direction="column" spacing={3}>
                                    <Collapse in={showIncorrectTimeAlert}>
                                        <Alert severity="error" visible="false">
                                            <AlertTitle>Error</AlertTitle>
                                            Invalid time! Time Start must be before than Time End
                                        </Alert>
                                    </Collapse>
                                    <TimePicker id='time-started' label='Time Start' renderInput={(params) => <TextField {...params} />} value={dtOvertimeStart} views={['hours', 'minutes', 'seconds']} inputFormat={"hh:mm:ss a"} onChange={(newDate) => setDTOvertimeStart(new Date(newDate), "hh:mm:ss a")} />
                                    <TimePicker id='time-ended' label='Time End' renderInput={(params) => <TextField {...params} />} value={dtOvertimeEnd} views={['hours', 'minutes', 'seconds']} inputFormat={"hh:mm:ss a"} onChange={(newDate) => setDTOvertimeEnd(new Date(newDate), "hh:mm:ss a")} />
                                    <Button variant="contained" type="submit">Request Overtime</Button>
                                </Stack>
                            </form>
                        </LocalizationProvider>
                    </Box>
                </Modal>
                {/* <Grid item><Button variant="contained" value={logins.loginData.length > 0 ? logins.loginData[0].account_id : ''} onClick={(event) => handleRedirectToProfile(event.target.value)}>{logins.loginData.length > 0 ? logins.loginData[0].fullname : ''} </Button></Grid>
                <Grid item><Button variant="contained" onClick={(event) => handleLogout()}>Log out </Button></Grid> */}

                {logins.loginData.length>0?_.filter(employees.employeeData, ['account_id', parseInt(id)]).map((value, index) =>
                    <Box key={index} sx={{mt:2}}>
                        <Stack direction="row" spacing={2}>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Leaves remaining: {value.total_leaves}</Typography>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Total Overtime: {value.total_overtime}</Typography>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Total Absences: {value.total_absences}</Typography>
                        </Stack>
                    </Box>
                ): <Box></Box>}
            </Grid>

            <Grid container justifyContent="center" direction="row" sx={{mt:2, p:2, border:2, width:670, ml:-2}}>
                <Stack direction="column" spacing={5}>
                    <Grid container justifyContent="center" direction="row">
                        <Grid item><Typography>Leaves Table</Typography></Grid>

                       
                                <Table sx={{ border: 2 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date Started: </TableCell>
                                            <TableCell>Date Ended: </TableCell>
                                            <TableCell>Reason: </TableCell>
                                        </TableRow>
                                    </TableHead>
                            <TableBody>
                                {logins.loginData.length > 0 ? _.filter(employees.employeeData, ['account_id', parseInt(id)]).map((value) =>
                                    _.map(value.leaves, (newvalue, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{newvalue.date_started}</TableCell>
                                            <TableCell>{newvalue.date_ended}</TableCell>
                                            <TableCell>{newvalue.reason}</TableCell>
                                        </TableRow>

                                    )
                                ) : <TableRow></TableRow>}
                            </TableBody>
                                </Table>

                    </Grid>

                    <Grid container justifyContent="center" direction="row">
                        <Grid item><Typography>Absences Table</Typography></Grid>
                        <Table sx={{ border: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date Started: </TableCell>
                                    <TableCell>Date Ended: </TableCell>
                                    <TableCell>Reason: </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logins.loginData.length > 0 ? _.filter(employees.employeeData, ['account_id', parseInt(logins.loginData[0].account_id)]).map((value) =>
                                    _.map(value.absence, (newvalue, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{newvalue.date_started}</TableCell>
                                            <TableCell>{newvalue.date_ended}</TableCell>
                                            <TableCell>{newvalue.reason}</TableCell>
                                        </TableRow>
                                    )
                                ) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>

                    </Grid>

                    <Grid container justifyContent="center" direction="row">
                        <Grid item><Typography>Overtime Table</Typography></Grid>
                        <Table sx={{ border: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date Started: </TableCell>
                                    <TableCell>Date Ended: </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {logins.loginData.length > 0 ? _.filter(employees.employeeData, ['account_id', parseInt(logins.loginData[0].account_id)]).map((value) =>
                                    _.map(value.overtime, (newvalue, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{newvalue.date_and_time_started}</TableCell>
                                            <TableCell>{newvalue.date_and_time_ended}</TableCell>
                                        </TableRow>
                                    )
                                ) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>

                    </Grid>
                </Stack>
            </Grid>
        </Box>
    )
}