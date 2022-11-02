import { Select, MenuItem, Collapse, Alert, AlertTitle, Typography, Paper, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Modal, Stack, Box, Grid, Container, Button, InputLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab, TextField } from '@mui/material';
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
import Axios from "axios";

export default function Employer() {
    const accountData = JSON.parse(localStorage.getItem("account"));

    // const [lvID, setLvID] = useState('');
    // const [absID, setAbsID] = useState('');
    // const [ovtID, setOvtID] = useState('');

    const [empData, setEmpData] = useState(JSON.parse(localStorage.getItem("employees")));

    const [leaves, setLeaves] = useState();
    const [absences, setAbsences] = useState();
    const [overtimes, setOvertimes] = useState();

    async function getLeaves(){

        try {
            _.map(empData, async (mergeData, index) => {
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
                    console.log(response.data)
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
            _.map(empData, async (mergeData, index) => {
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
            _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/overtimes/";
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
                    console.log(response.data)
                    empData[index].total_overtimes = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function getDailyWage(){

        try {
            _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/dailywage/";
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
                    empData[index].dailywage = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function getMonthlyWage(){

        try {
            _.map(empData, async (mergeData, index) => {
                const baseUrl = "http://localhost:8080/employee/monthlywage/";
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
                    empData[index].monthlywage = response.data;
                    setEmpData(empData)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }
    const leavesData = async() => {
        await Axios("http://localhost:8080/employee/leave", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            }
        }).then(function(response){
            setLeaves(response.data)
        })
    }
    const overtimesData = async() => {
        await Axios("http://localhost:8080/employee/overtime", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            }
        }).then(function(response){
            setOvertimes(response.data)
        })
    }
    const absencesData = async() => {
        await Axios("http://localhost:8080/employee/absence", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            }
        }).then(function(response){
            setAbsences(response.data)
        })
    }
    
    function redirectToDetails(details){
        router.push(`/employee/${details}`)
    }

    function redirectToUpdate(update){
        router.push({
            pathname:`/employee`,
            query: {id: update},
        });
    }


    const [value, setValue] = useState();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [dtAbsenceStart, setDTAbsenceStart] = useState(format(new Date(), 'MM/dd/yyyy'));
    const [dtAbsenceEnd, setDTAbsenceEnd] = useState(format(new Date(), 'MM/dd/yyyy'));
    const [dtAbsReasons, setDTAbsReason] = useState('');

    const [leaveID, setLeaveID] = useState('');
    const [overtimeID, setOvertimeID] = useState('');

    const [absenceClicked, setAbsenceClicked] = useState(false);

    const [empID, setEmpID] = useState('');

    const handleClose = () => {
        setOpen(false);
        setAbsenceClicked(false);
        setShowBeforeDayAlert(false);
        setShowSameDayAlert(false);
        setEmpID('');
        setDTAbsReason('');
        setDTAbsenceStart(format(new Date(), 'MM/dd/yyyy'));
        setDTAbsenceEnd(format(new Date(), 'MM/dd/yyyy'));
    };
    
    const [leaveApproveClicked, setLeaveApproveClicked] = useState(false);
    const [overtimeApproveClicked, setOvertimeApproveClicked] = useState(false);

    const [showBeforeDayAlert, setShowBeforeDayAlert] = useState(false);
    const [showSameDayAlert, setShowSameDayAlert] = useState(false);
    //const id = accountData.accID;
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
        getLeaves();
        getAbsences();
        getOvertimes();
        getDailyWage();
        getMonthlyWage();
        leavesData();
        overtimesData();
        absencesData();

        const formattedAbsenceStart = parse(dtAbsenceStart, 'MM/dd/yyyy', new Date());
        const formattedAbsenceEnd  = parse(dtAbsenceEnd, 'MM/dd/yyyy', new Date());

        const isBeforeDate = isBefore(formattedAbsenceStart, formattedAbsenceEnd);
        const isSameDate = isSameDay(formattedAbsenceStart, formattedAbsenceEnd);

        const absenceAsync = async () => {
            try{
                if (absenceClicked) {
                    if (isSameDate) {
                        setShowSameDayAlert(true);
                        setAbsenceClicked(false);
                        // const payload = {
                        //     empID: empID,
                        //     date_started: `'${dtAbsenceStart}'`,
                        //     date_ended: `'${dtAbsenceEnd}'`,
                        //     reason: dtAbsReasons,
                        // }
    
                        // await Axios("http://localhost:8080/employee/absence", {
                        //     method: "POST",
                        //     headers: {
                        //         'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                        //     },
                        //     data: JSON.stringify(payload)
                        // }).then(async function(response){
                        //     if(response.data === "Save successfully"){
                        //         await getAbsences();
                        //         await getMonthlyWage();
                        //         await absencesData();
                        //     }
                        // })
    
                        // setShowBeforeDayAlert(false);
                        // handleClose();
                    }
                    else {
                        if (!isBeforeDate) {
                            setShowBeforeDayAlert(true);
                        }
                        else {
    
                            const payload = {
                                empID: empID,
                                date_started: `'${dtAbsenceStart}'`,
                                date_ended: `'${dtAbsenceEnd}'`,
                                reason: dtAbsReasons,
                            }
        
                            await Axios("http://localhost:8080/employee/absence", {
                                method: "POST",
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                                },
                                data: JSON.stringify(payload)
                            }).then(async function(response){
                                if(response.data === "Save successfully"){
                                    await getAbsences();
                                    await getMonthlyWage();
                                    await absencesData();
                                }
                            })
    
                            setShowBeforeDayAlert(false);
                            handleClose();
                        }
                    }
    
                    setAbsenceClicked(false);
                }
            }catch(err){
                console.log(err)
            }
        }
        absenceAsync();
    }, [empData, leaveApproveClicked, overtimeApproveClicked, absenceClicked])

    function redirectToAddEmployee(){
        router.push('/employee/form');
    }

    function handleLogout(event){
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        localStorage.removeItem("account");
        localStorage.removeItem("employees")
        router.push('/login')
    }

    async function handleRedirectToProfile(event, value){
        await router.push('/profile');
    }

    const employmentdetails = [...employer];

    async function handleConfirmLeave(lvID) {
        const payload = {
            lvID: lvID,
            approved: "Confirmed"
        };

        await Axios("http://localhost:8080/employee/leave/", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            getLeaves();
            getMonthlyWage();
            leavesData();
        })
        console.log(empData);
    }

    async function handleDenyLeave(lvID){
        const payload = {
            lvID: lvID,
            approved: "Denied"
        };

        await Axios("http://localhost:8080/employee/leave/", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            console.log(response);
            getLeaves();
            getMonthlyWage();
            leavesData();
        })
        console.log(empData)
    };

    async function handleDeleteLeave(lvID){
        const payload = {
            lvID: lvID
        };

        await Axios("http://localhost:8080/employee/leave/", {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            console.log(response);
            getLeaves();
            getMonthlyWage();
            leavesData();
        })
    }

    async function handleConfirmOvertime(ovtID) {
        const payload = {
            ovtID: ovtID,
            approved: "Confirmed"
        };

        await Axios("http://localhost:8080/employee/overtime/", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            getOvertimes();
            getMonthlyWage();
            overtimesData();
        })
        console.log(empData)
    }

    async function handleDenyOvertime(ovtID) {
        const payload = {
            ovtID: ovtID,
            approved: "Denied"
        };

        await Axios("http://localhost:8080/employee/overtime/", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            getOvertimes();
            getMonthlyWage();
            overtimesData();
        })
        console.log(empData)
    }

    async function handleDeleteOvertime(ovtID){
        const payload = {
            overtimeID: overtimeID
        };

        await Axios("http://localhost:8080/employee/overtime/", {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(payload)
        }).then(async function(response){
            console.log(response);
            getOvertimes();
            getMonthlyWage();
            overtimesData();
        })
    }

    async function handleAddAbsence(event){
        event.preventDefault();
        setAbsenceClicked(true);
    }

    async function handleDeleteAbsence(value){
        try {
            const absID = value;
            await Axios("http://localhost:8080/employee/absence/", {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
                data: {
                    absID: JSON.stringify(absID)
                }
            })
            await absencesData();
            await getMonthlyWage();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleEmpDelete(empID, accID){
        let accountData;
        let employeeData;

        const empbaseUrl = "http://localhost:8080/employee/";
        const empfinUrl = empbaseUrl + empID;
        await Axios(empfinUrl, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
        }).then(function(response){
            console.log(response.data)
        }).finally(async () => {
            await Axios("http://localhost:8080/employee/", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                }
            }).then(function(response){
                employeeData = response.data;
            });
        })

        const accbaseUrl = "http://localhost:8080/account/";
        const accfinUrl = accbaseUrl + accID;
        await Axios(accfinUrl, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
        }).then(function(response){
            console.log(response.data)
        }).finally(async () => {
            await Axios("http://localhost:8080/account/", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                }
            }).then(function (response) {
                accountData = _.filter(response.data, (data) => data.role === "Employee");

                const merged = _(employeeData).keyBy('accID').merge(_.keyBy(accountData, 'accID')).values().value();
                console.log(employeeData, accountData);
                console.log(merged);
                localStorage.setItem("employees", JSON.stringify(merged));
            });
        });
        
        setEmpData(JSON.parse(localStorage.getItem("employees")));
        console.log(setEmpData)
    }
    async function checkData(){
        // getLeaves();
        // getAbsences();
        // getOvertimes();
        // getDailyWage();
        // getMonthlyWage();
        // leavesData();
        // overtimesData();
        // absencesData();
        console.log(empData)
    }

    return (
        <Container maxWidth="lg" sx={{border:2, p:2}}>
            <Stack direction="row" spacing={118} alignItems="center" justifyContent="center">
                <Button variant="contained" onClick={(event) => handleRedirectToProfile(event.target.value)}>{ accountData.fname + " " + accountData.lname}</Button>
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
                                <Collapse in={showSameDayAlert}>
                                        <Alert severity="error" visible="false">
                                            <AlertTitle>Error</AlertTitle>
                                            Invalid date! Date Start cannot be on the same day as Date End
                                        </Alert>
                                    </Collapse>
                                <Typography>Select Employee:</Typography>
                                <Select required value={empID} onChange={(event)=>setEmpID(event.target.value)}>
                                    {_.map(empData, (value, index)=>
                                    <MenuItem key={index} value={value.empID}>{value.fname} {value.lname}</MenuItem>
                                    )}
                                </Select>
                                <DatePicker required id='date-started' label='Date Start' renderInput={(params) => <TextField {...params} />} value={dtAbsenceStart} onChange={(newDate) => setDTAbsenceStart(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                <DatePicker required id='date-ended' label='Date End' renderInput={(params) => <TextField {...params} />} value={dtAbsenceEnd} onChange={(newDate) => setDTAbsenceEnd(format(new Date(newDate), 'MM/dd/yyyy'))} />
                                <TextField required variant="outlined" id='reason' label='Reason' value={dtAbsReasons} onChange={(event) => setDTAbsReason(event.target.value)}></TextField>
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
                    <TableContainer component={Paper} sx={{border: 2}}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell align="center">Last Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Password</TableCell>
                                    <TableCell align="center">Hourly Salary</TableCell>
                                    <TableCell align="center">Remaining Leaves</TableCell>
                                    <TableCell align="center">Total Absents</TableCell>
                                    <TableCell align="center">Total Overtimes (HRs)</TableCell>
                                    <TableCell align="center">Daily Wage (Pesos)</TableCell>
                                    <TableCell align="center">Monthly Salary (Pesos)</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(empData, (row, index) =>
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.fname}
                                        </TableCell>
                                        <TableCell align="center" color='#f9faa33'>{row.lname}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.password}</TableCell>
                                        <TableCell align="center">{row.hourlySalary}</TableCell>
                                        <TableCell align="center">{row.total_leaves}</TableCell>
                                        <TableCell align="center">{row.total_absences}</TableCell>
                                        <TableCell align="center">{row.total_overtimes}</TableCell>
                                        <TableCell align="center">{row.dailywage}</TableCell>
                                        <TableCell align="center">{row.monthlywage}</TableCell>
                                        <TableCell align="center"><Stack direction="column" spacing={2}><Button variant="contained" value={row.accID} onClick={(event) => redirectToDetails(event.target.value)}>Details</Button><Button variant="contained" value={row.accID} onClick={(event) => redirectToUpdate(event.target.value)}>Update</Button><Button variant="contained" onClick={(event) => handleEmpDelete(row.empID, row.accID)}>Delete</Button></Stack></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
                <Stack direction="column" alignItems="center" spacing={2} sx={{border:2}}>
                    <Typography>Leaves Request List</Typography>
                    <TableContainer sx={{ border: 2, width:'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Employee ID</TableCell>
                                    <TableCell align="center">Leave ID</TableCell>
                                    <TableCell align="center">Reason</TableCell>
                                    <TableCell align="center">Date Started</TableCell>
                                    <TableCell align="center">Date Ended</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(leaves, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.empID}</TableCell>
                                        <TableCell align="center">{value.lvID}</TableCell>
                                        <TableCell align="center">{value.reason}</TableCell>
                                        <TableCell align="center">{value.date_started}</TableCell>
                                        <TableCell align="center">{value.date_ended}</TableCell>
                                        <TableCell align="center">{value.approved}</TableCell>
                                        <TableCell align="center"><Stack direction="column" spacing={2}><Button variant="contained" value={value.lvID} onClick={(event)=>handleConfirmLeave(event.target.value)}>Approve Leave</Button><Button variant="contained" value={value.lvID} onClick={(event)=>handleDenyLeave(event.target.value)}>Deny Leave</Button><Button variant="contained" value={value.lvID} onClick={(event)=>handleDeleteLeave(event.target.value)}>Delete Leave</Button></Stack></TableCell>
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
                                    <TableCell align="center">Employee ID</TableCell>
                                    <TableCell align="center">Overtime ID</TableCell>
                                    <TableCell align="center">Date and Time Started</TableCell>
                                    <TableCell align="center">Date and Time Ended</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(overtimes, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.empID}</TableCell>
                                        <TableCell align="center">{value.ovtID}</TableCell>
                                        <TableCell align="center">{value.date_and_time_started}</TableCell>
                                        <TableCell align="center">{value.date_and_time_ended}</TableCell>
                                        <TableCell align="center">{value.approved}</TableCell>
                                        <TableCell align="center">{<Stack direction="column" spacing={2}><Button  variant="contained" value={value.ovtID} onClick={(event)=>handleConfirmOvertime(event.target.value)}>Approve Overtime</Button><Button  variant="contained" value={value.ovtID} onClick={(event)=>handleDenyOvertime(event.target.value)}>Deny Overtime</Button><Button  variant="contained" value={value.ovtID} onClick={(event)=>handleDeleteOvertime(event.target.value)}>Delete Overtime</Button></Stack>}</TableCell>
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
                                    <TableCell align="center">Employee ID</TableCell>
                                    <TableCell align="center">Absence ID</TableCell>
                                    <TableCell align="center">Date Started</TableCell>
                                    <TableCell align="center">Date Ended</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {_.map(absences, (value, index) =>
                                    <TableRow key={index}>
                                        <TableCell align="center">{value.empID}</TableCell>
                                        <TableCell align="center">{value.absID}</TableCell>
                                        <TableCell align="center">{value.date_started}</TableCell>
                                        <TableCell align="center">{value.date_ended}</TableCell>
                                        <TableCell align="center"><Button variant="contained" value={value.absID} onClick={(event)=>handleDeleteAbsence(event.target.value)}>Delete Absence</Button></TableCell>
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