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
import Axios from "axios";

export default function Employer() {
    //const dispatch = useDispatch();

    const [empData, setEmpData] = useState(JSON.parse(localStorage.getItem("empData")));

    let empID;
    _.map(empData, (data)=>{
        empID = data.empID
    })

    const accountData = JSON.parse(localStorage.getItem("account"));
    //const [accountData, setAccountData] = useState(JSON.parse(localStorage.getItem("account")));

    const [leaveReason, setLeaveReason] = useState('');

    async function getLeaves(){

        try {
            await _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/leaves/";
                let finalUrl = baseUrl + empData[index].empID;
                const month = format(new Date(), "MM/dd/yyyy");
    
                await Axios(finalUrl, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                    },
                    data: {
                        "month": JSON.stringify(month)
                    }
                }).then(function (response) {
                    empData[index].total_leaves = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function getAbsences(){

        try {
            await _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/absences/";
                let finalUrl = baseUrl + empData[index].empID;
                const month = format(new Date(), "MM/dd/yyyy");
    
                await Axios(finalUrl, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                    },
                    data: {
                        "month": JSON.stringify(month)
                    }
                }).then(function (response) {
                    empData[index].total_absences = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function getOvertimes(){

        try {
            await _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/overtimes/";
                let finalUrl = baseUrl + empData[index].empID;
                const month = format(new Date(), "MM/dd/yyyy HH:mm:ss a");
    
                await Axios(finalUrl, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                    },
                    data: {
                        "month": JSON.stringify(month)
                    }
                }).then(function (response) {
                    empData[index].total_overtimes = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    getLeaves();
    getAbsences();
    getOvertimes();

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
        setLeaveReason('');
        setLeaveOpen(false);
        setOvertimeOpen(false);
        setShowSameDayAlert(false);
        setShowBeforeDayAlert(false);
        setShowIncorrectTimeAlert(false);
        setDTLeaveStart(format(new Date(), 'MM/dd/yyy'));
        setDTLeaveEnd(format(new Date(), 'MM/dd/yyy'));
        setDTOvertimeStart(new Date());
        setDTOvertimeEnd(new Date());
    };

    // const id = logins.loginData.length>0?logins.loginData[0].account_id: '';
    // const companyList = [];

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
        getLeaves();
        getAbsences();
        getOvertimes();
        // if (profileData.length !== employees.employeeData.length) {
        //     const newData = employees.employeeData.map((data, index) => {
        //         return (profileData[index]) ? { ...data, ...profileData[index] } : data;
        //     })
        //     setProfileData(newData);
        // }
        
        // _.forEach(companies.companyData, function(value){
        //     companyList.push(value);
        // })

        // _.forEach(companyList, function(value){
        //     dispatch(computeLeaves(value));
        // })

        // _.forEach(companyList, function(value){
        //     dispatch(computeAbsences(value));
        // })

        const leaveSend = async() =>{
            try{

                const formattedLeaveStart = parse(dtLeaveStart, 'MM/dd/yyyy', new Date());
                const formattedLeaveEnd  = parse(dtLeaveEnd, 'MM/dd/yyyy', new Date());
        
                if(leaveClicked){
                    if(isBefore(formattedLeaveEnd, formattedLeaveStart )){
                        setShowBeforeDayAlert(true);
                        setLeaveClicked(false);
                    }
                    if(isSameDay(formattedLeaveEnd, formattedLeaveStart )){
                        setShowSameDayAlert(true);
                        setLeaveClicked(false);
                    }
                    else{
                        const payload = {
                            empID: empID,
                            date_started: `'${dtLeaveStart}'`,
                            date_ended: `'${dtLeaveEnd}'`,
                            reason: leaveReason
                        }
                        await Axios("http://localhost:8080/employee/leave", {
                            method: "POST",
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                            },
                            data: JSON.stringify(payload)
                        }).then(function(response){
                            console.log(response)
                        })
                        setShowBeforeDayAlert(false);
                        setLeaveClicked(false);
                        setLeaveOpen(false);
                        handleClose();
                    }
                }
            }catch(err){
                console.log(err);
            }
        }

        const overtimeSend = async() =>{

            const formattedOvertimeStart = new Date(dtOvertimeStart);
            const formattedOvertimeEnd  = new Date(dtOvertimeEnd);
    
            const ifBeforeHour = isBefore(formattedOvertimeStart, formattedOvertimeEnd);
    
            if(overtimeClicked){
    
                if(!ifBeforeHour){
                    setShowIncorrectTimeAlert(true);
                }
                else{
                    const overtimeStartFormat = format(new Date(formattedOvertimeStart), "MM/dd/yyyy HH:mm:ss a");
                    const overtimeEndFormat = format(new Date(formattedOvertimeEnd), "MM/dd/yyyy HH:mm:ss a");

                    const payload = {
                        empID: empID,
                        date_and_time_started: `'${overtimeStartFormat}'`,
                        date_and_time_ended: `'${overtimeEndFormat}'`,
                    }
                    await Axios("http://localhost:8080/employee/overtime", {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                        },
                        data: JSON.stringify(payload)
                    }).then(function (response) {
                        console.log(response)
                    })
                    setShowIncorrectTimeAlert(false);
                    setOvertimeOpen(false);
                    handleClose();
                }
                setOvertimeClicked(false);
            }
        }

        leaveSend();
        overtimeSend();
    }, [empData, showBeforeDayAlert, showIncorrectTimeAlert, leaveClicked, overtimeClicked])

    function handleLogout(event){
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        localStorage.removeItem("account");
        localStorage.removeItem("empData");
        router.push('/login')
    }

    async function handleRedirectToProfile(event, value){
        await router.push({
            pathname: '/prfile',
            query: {id: empID},
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
        console.log(empData)
    }
    
    
    const employmentdetails = [...employer];

    return (
        <Box maxWidth="md" sx={{mx:20, my:2}}>
            <Grid container direction='row' sx={{ border: 2, p:2, width:670 }} spacing={2}>
                <Stack direction="row" spacing={50}>
                    <Button variant="contained" onClick={(event)=>handleRedirectToProfile()}>{accountData.fname+ " " + accountData.lname}</Button>
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
                                    <Collapse in={showSameDayAlert}>
                                        <Alert severity="error" visible="false">
                                            <AlertTitle>Error</AlertTitle>
                                            Invalid date! Date Start cannot be on the same day as Date End
                                        </Alert>
                                    </Collapse>
                                    <DatePicker required id='date-started' label='Date Start' renderInput={(params) => <TextField {...params} />} value={dtLeaveStart} onChange={(newDate) => setDTLeaveStart(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                    <DatePicker required id='date-ended' label='Date End' renderInput={(params) => <TextField {...params} />} value={dtLeaveEnd} onChange={(newDate) => setDTLeaveEnd(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                    <TextField required variant="outlined" id='reason' label='Reason' value={leaveReason} onChange={(event)=>setLeaveReason(event.target.value)}></TextField>
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

                {_.map(empData, (value, index) =>
                    <Box key={index} sx={{mt:2}}>
                        <Stack direction="row" spacing={2}>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Leaves remaining: {value.total_leaves}</Typography>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Total Overtime: {value.total_overtimes}</Typography>
                            <Typography textAlign="center" sx={{ bgcolor: deepOrange[300], width: 200, height: 100, p:4 }} style={{ color: deepPurple[800] }}>Total Absences: {value.total_absences}</Typography>
                        </Stack>
                    </Box>
                )}
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
                                {_.map(empData, (data, index)=> 
                                        <TableRow key={index}>
                                            <TableCell>{data.leaves.date_started}</TableCell>
                                            <TableCell>{data.leaves.date_ended}</TableCell>
                                            <TableCell>{data.leaves.reason}</TableCell>
                                        </TableRow>
                                )}
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
                                {_.map(empData, (data, index)=> 
                                        <TableRow key={index}>
                                            <TableCell>{data.absences.date_started}</TableCell>
                                            <TableCell>{data.absences.date_ended}</TableCell>
                                            <TableCell>{data.absences.reason}</TableCell>
                                        </TableRow>
                                )}
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

                                {_.map(empData, (data, index)=>
                                        <TableRow key={index}>
                                            <TableCell>{data.overtimes.date_and_time_started}</TableCell>
                                            <TableCell>{data.overtimes.date_and_time_ended}</TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>

                    </Grid>
                </Stack>
            </Grid>
        </Box>
    )
}