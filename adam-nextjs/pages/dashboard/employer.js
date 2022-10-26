import { Select, MenuItem, Collapse, Alert, AlertTitle, Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Modal, Stack, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import EmployeeTable from '../../Components/EmployeeTable';
import { employer } from '../../Database/employer';
import { computeLeaves, computeOvertime, computeAbsences, computeDailyWage, computeMonthlySalary, addLeaves, addOvertimes, addAbsences } from '../../store/reducers/employee';
import { getCompany } from '../../store/reducers/company';
import { employee } from '../../Database/employee';
import { ContactlessOutlined } from '@mui/icons-material';
import { logoutUser } from '../../store/reducers/login';
import { setLeaveAccountID, setReason, setDateStarted, setDateEnded, requestLeave, deleteLeave, updateLeave, confirmLeave,  denyLeave } from '../../store/reducers/leave';
import { setOvertimeAccountID, setOvertimeDateStarted, setOvertimeDateEnded, requestOvertime, deleteOvertime, updateOvertime, confirmOvertime,  denyOvertime } from '../../store/reducers/overtime';
import { setAbsenceAccountID, setAbsenceReason, setAbsenceDateStarted, setAbsenceDateEnded, addAbsence, deleteAbsence, updateAbsence, } from '../../store/reducers/absence';
import _ from 'lodash';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {format, isBefore, isSameDay, parse} from 'date-fns';


export default function Employer() {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employee);
    const companies = useSelector(state => state.company);
    const accounts = useSelector(state=>state.account);
    const logins = useSelector(state => state.login);
    const leaves = useSelector(state=>state.leave);
    const overtimes = useSelector(state=>state.overtime);
    const absences = useSelector(state=>state.absence);

    const [value, setValue] = useState();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [dtAbsenceStart, setDTAbsenceStart] = useState(format(new Date(), 'MM/dd/yyyy'));
    const [dtAbsenceEnd, setDTAbsenceEnd] = useState(format(new Date(), 'MM/dd/yyyy'));

    const [leaveID, setLeaveID] = useState('');
    const [overtimeID, setOvertimeID] = useState('');

    const [absenceClicked, setAbsenceClicked] = useState(false);

    const [empID, setEmpID] = useState('');

    const handleClose = () => {
        setOpen(false);
        setAbsenceClicked(false);
        setEmpID('');
        dispatch(setAbsenceReason(''));
        dispatch(setAbsenceDateStarted(''));
        dispatch(setAbsenceDateEnded(''));
        setDTAbsenceStart(format(new Date(), 'MM/dd/yyyy'));
        setDTAbsenceEnd(format(new Date(), 'MM/dd/yyyy'));
    };
    
    const [leaveApproveClicked, setLeaveApproveClicked] = useState(false);
    const [overtimeApproveClicked, setOvertimeApproveClicked] = useState(false);

    const [showBeforeDayAlert, setShowBeforeDayAlert] = useState(false);

    const id = logins.loginData.account_id;
    const companyList = [];

    //let associated_comp;

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
            dispatch(computeOvertime(value));
        })

        _.forEach(companyList, function(value){
            dispatch(computeAbsences(value));
        })

        _.forEach(employees.employeeData, function(value){
            dispatch(computeDailyWage(value.account_id));
        })

        _.forEach(employees.employeeData, function(value){
            dispatch(computeMonthlySalary(value.account_id));
        })

        if (leaveApproveClicked) {
            const leaveIndex = _.findIndex(leaves.leavesData, ['leave_ID', parseInt(leaveID)])
            let array;

            array = {
                reason: leaves.leavesData[leaveIndex].reason,
                date_started: leaves.leavesData[leaveIndex].date_started,
                date_ended: leaves.leavesData[leaveIndex].date_ended,
            }

            const accid = leaves.leavesData[leaveIndex].account_ID;

            dispatch(addLeaves({ account_id: accid, leaveArray: array }));

            _.forEach(companyList, function(value){
                dispatch(computeLeaves(value));
            })
            setLeaveID('');
            setLeaveApproveClicked(false);
        }

        if (overtimeApproveClicked) {
            const overtimeIndex = _.findIndex(overtimes.overtimesData, ['overtime_ID', parseInt(overtimeID)])
            let array;

            array = {
                date_and_time_started: overtimes.overtimesData[overtimeIndex].date_and_time_started,
                date_and_time_ended: overtimes.overtimesData[overtimeIndex].date_and_time_ended,
            }

            const accid = overtimes.overtimesData[overtimeIndex].account_ID;

            dispatch(addOvertimes({ account_id: accid, overtimeArray: array }));

            _.forEach(companyList, function(value){
                dispatch(computeOvertime(value));
            })
            setOvertimeID('');
            setOvertimeApproveClicked(false);
        }

        const formattedAbsenceStart = parse(dtAbsenceStart, 'MM/dd/yyyy', new Date());
        const formattedAbsenceEnd  = parse(dtAbsenceEnd, 'MM/dd/yyyy', new Date());

        const isBeforeDate = isBefore(formattedAbsenceStart, formattedAbsenceEnd);
        const isSameDate = isSameDay(formattedAbsenceStart, formattedAbsenceEnd);

        const absenceAsync = async () => {

            if (absenceClicked) {
                if (isSameDate) {

                    await dispatch(setAbsenceDateStarted(dtAbsenceStart));
                    await dispatch(setAbsenceDateEnded(dtAbsenceStart));

                    let array;

                    array = {
                        reason: absences.reason,
                        date_started: dtAbsenceStart,
                        date_ended: dtAbsenceStart,
                    }

                    console.log(array);

                    const accid = empID;

                    await dispatch(addAbsences({ account_id: accid, absenceArray: array }));

                    await dispatch(addAbsence(empID));

                    setShowBeforeDayAlert(false);
                    handleClose();
                }
                else {
                    if (!isBeforeDate) {
                        setShowBeforeDayAlert(true);
                    }
                    else {

                        await dispatch(setAbsenceDateStarted(dtAbsenceStart));
                        await dispatch(setAbsenceDateEnded(dtAbsenceStart));

                        let array;

                        array = {
                            reason: absences.reason,
                            date_started: dtAbsenceStart,
                            date_ended: dtAbsenceStart,
                        }

                        console.log(array);

                        const accid = empID;

                        await dispatch(addAbsences({ account_id: accid, absenceArray: array }));

                        await dispatch(addAbsence(empID));

                        setShowBeforeDayAlert(false);
                        handleClose();
                    }
                }
                _.forEach(companyList, function (value) {
                    dispatch(computeAbsences(value));
                })

                setAbsenceClicked(false);
            }
        }
        absenceAsync();
    }, [leaves, overtimes, leaveApproveClicked, overtimeApproveClicked, absenceClicked])

    function redirectToAddEmployee(){
        router.push('/employee/form');
    }

    function handleLogout(event){
        dispatch(logoutUser());
        router.push('/login')
    }

    async function handleRedirectToProfile(event, value){
        await router.push('/profile');
    }

    const employmentdetails = [...employer];

    async function handleConfirmLeave(id) {
        await dispatch(confirmLeave(id));
        await setLeaveID(id);
        await setLeaveApproveClicked(true);

        console.log(leaves.accountLeave.length);
    }

    async function handleConfirmOvertime(id) {
        await dispatch(confirmOvertime(id));
        await setOvertimeID(id);
        await setOvertimeApproveClicked(true);

        console.log(overtimes.overtimesData.length);
    }

    async function handleAddAbsence(event){
        event.preventDefault();
        setAbsenceClicked(true);
        console.log(empID)
    }

    function checkData(){
        console.log(companies.companyData);
        console.log(employees.employeeData);
        console.log(accounts.accountData);
    }

    return (
        <Container maxWidth="lg" sx={{border:2, p:2}}>
            <Stack direction="row" spacing={118} alignItems="center" justifyContent="center">
                <Button variant="contained" value={logins.loginData.length > 0 ? logins.loginData[0].account_id : ''} onClick={(event) => handleRedirectToProfile(event.target.value)}>{logins.loginData.length > 0 ? logins.loginData[0].fullname : ''} </Button>
                <Button variant="contained" onClick={(event) => handleLogout()} sx={{ ml: 75 }}>Log out </Button>
            </Stack><br />

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form onSubmit={handleAddAbsence}>
                            <Stack direction="column" spacing={2}>
                                <h3>Add Employee Absence</h3>
                                <Collapse in={showBeforeDayAlert}>
                                    <Alert severity="error" visible="false">
                                        <AlertTitle>Error</AlertTitle>
                                        Invalid date! Date Start must be before Date End
                                    </Alert>
                                </Collapse>
                                <Typography>Select Employee:</Typography>
                                <Select required value={empID} onChange={(event)=>setEmpID(event.target.value)}>
                                    {_.map(employees.employeeData, (value, index)=>
                                    <MenuItem key={index} value={value.account_id}>{value.firstname} {value.lastname}</MenuItem>
                                    )}
                                </Select>
                                <DatePicker required id='date-started' label='Date Start' renderInput={(params) => <TextField {...params} />} value={dtAbsenceStart} onChange={(newDate) => setDTAbsenceStart(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                <DatePicker required id='date-ended' label='Date End' renderInput={(params) => <TextField {...params} />} value={dtAbsenceEnd} onChange={(newDate) => setDTAbsenceEnd(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                <TextField required variant="outlined" id='reason' label='Reason' value={absences.reason} onChange={(event) => dispatch(setAbsenceReason(event.target.value))}></TextField>
                                <Button variant="contained" type="submit">Add Absence</Button>
                            </Stack>
                        </form>
                    </LocalizationProvider>
                </Box>
            </Modal>

            <Stack direction="row" spacing={2} sx={{my:2}}>
                <Button variant="contained" onClick={(event) => redirectToAddEmployee(event)}>To Add Employee Form</Button>
                <Button variant="contained" onClick={(event) => setOpen(true)}>Set Absence</Button>
                <Button variant="contained" onClick={(event)=>checkData()}>Check Data</Button>
            </Stack>

            <Stack direction="column" spacing={2} alignItems="center">
                
                <Stack direction="column" spacing={2} alignItems="center" sx={{border:2}}>
                    <Typography>Employee List</Typography>
                <EmployeeTable />
                </Stack>
                <Stack direction="column" alignItems="center" spacing={2} sx={{border:2}}>
                    <Typography>Leaves Request List</Typography>
                    <TableContainer sx={{ border: 2, width:'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Employee Account ID</TableCell>
                                    <TableCell align="center">Leave ID</TableCell>
                                    <TableCell align="center">Reason</TableCell>
                                    <TableCell align="center">Date Started</TableCell>
                                    <TableCell align="center">Date Ended</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(leaves.leavesData, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.account_ID}</TableCell>
                                        <TableCell align="center">{value.leave_ID}</TableCell>
                                        <TableCell align="center">{value.reason}</TableCell>
                                        <TableCell align="center">{value.date_started}</TableCell>
                                        <TableCell align="center">{value.date_ended}</TableCell>
                                        <TableCell align="center">{value.isConfirmed}</TableCell>
                                        <TableCell align="center">{value.isConfirmed!=="Pending" ? <Stack direction="column" spacing={2}><Button disabled variant="contained" value={value.leave_ID} onClick={(event)=>handleConfirmLeave(event.target.value)}>Approve Leave</Button><Button disabled variant="contained">Deny Leave</Button></Stack>: <Stack direction="column" spacing={2}><Button variant="contained" value={value.leave_ID} onClick={(event)=>handleConfirmLeave(event.target.value)}>Approve Leave</Button><Button variant="contained">Deny Leave</Button></Stack>}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>

                <Stack direction="column" alignItems="center" spacing={2} sx={{border:2}}>
                    <Typography>Overtimes Request List</Typography>
                    <TableContainer sx={{ border: 2, width:'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Employee Account ID</TableCell>
                                    <TableCell align="center">Leave ID</TableCell>
                                    <TableCell align="center">Date and Time Started</TableCell>
                                    <TableCell align="center">Date and Time Ended</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(overtimes.overtimesData, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.account_ID}</TableCell>
                                        <TableCell align="center">{value.overtime_ID}</TableCell>
                                        <TableCell align="center">{value.date_and_time_started}</TableCell>
                                        <TableCell align="center">{value.date_and_time_ended}</TableCell>
                                        <TableCell align="center">{value.isConfirmed}</TableCell>
                                        <TableCell align="center">{value.isConfirmed!=="Pending" ? <Stack direction="column" spacing={2}><Button disabled variant="contained" value={value.overtime_ID} onClick={(event)=>handleConfirmOvertime(event.target.value)}>Approve Overtime</Button><Button disabled variant="contained">Deny Overtime</Button></Stack>: <Stack direction="column" spacing={2}><Button variant="contained" value={value.overtime_ID} onClick={(event)=>handleConfirmOvertime(event.target.value)}>Approve Overtime</Button><Button variant="contained">Deny Overtime</Button></Stack>}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>

                <Stack direction="column" alignItems="center" spacing={2} sx={{border:2}}>
                    <Typography>Absences Request List</Typography>
                    <TableContainer sx={{ border: 2, width:'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Employee Account ID</TableCell>
                                    <TableCell align="center">Leave ID</TableCell>
                                    <TableCell align="center">Date Started</TableCell>
                                    <TableCell align="center">Date Ended</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(absences.absencesData, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.account_ID}</TableCell>
                                        <TableCell align="center">{value.absence_ID}</TableCell>
                                        <TableCell align="center">{value.date_started}</TableCell>
                                        <TableCell align="center">{value.date_ended}</TableCell>
                                        <TableCell align="center"><Stack direction="column" spacing={2}><Button variant="contained">Update Absence</Button><Button variant="contained">Delete Absence</Button></Stack></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Stack>
        </Container>
    )
}