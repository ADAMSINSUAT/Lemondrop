import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, Stack} from '@mui/material';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Form from '../pages/employee';
import { employee } from '../Database/employee';
import { React, useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { computeLeaves, deleteEmployee } from '../store/reducers/employee';
import {deleteAccount_id} from '../store/reducers/company';
import { deleteAccount } from '../store/reducers/account';
import UpdateProfile from '../pages/employee/update';
import _ from 'lodash';


export default function EmployeeTable(props) {
    const employees = useSelector(state=>state.employee);
    const companies = useSelector(state=>state.company);
    const accounts = useSelector(state=>state.account);
    const leaves = useSelector(state=>state.employee);
    const dispatch = useDispatch();

    const [detailsID, setDetailsID] = useState();
    const [editID, setEditID] = useState('');
    const router = useRouter();

    const [rows, setRows] = useState([]);

    const idArray = [];
    const compLeavesArray = [];
    const compIDArray = [];

     _.forEach(employees.employeeData, function(value){
        idArray.push(value.account_id);
     });

     _.forEach(companies.companyData, function(value){
        compLeavesArray.push(value.leaves);
        compIDArray.push(value.account_id);
     })

    // const companyFilter = _.filter(companies.companyData, ["account_id", id]);

    // const companyID = _.map(companyFilter, 'account_id')
    // const companyLeaves = _.map(companyFilter, 'leaves');

    useEffect(() => {
        if (rows.length !== employees.employeeData.length) {
            const newData = employees.employeeData.map((obj, index) => {
                return (rows[index]) ? { ...obj, ...rows[index] } : obj
            })
            setRows(newData);
        }
        
        // const id = employees.employeeData.map(employee=>employee.account_id);
        // const filter = companies.companyData.filter((company)=>company.account_id===`${id}`);
        // _.forEach(idArray, function(value){
        //     console.log(value)
        // })
        // dispatch(computeLeaves({leaves: parseInt(compLeavesArray), userID: parseInt(idArray)}));

    }, [employee, rows]);

    function redirectToDetails(details){
        router.push(`/employee/${details}`)
        // router.push({
        //     pathname:`/employee`,
        //     query: {id: details}
        // });
    }
    function redirectToUpdate(update){
        router.push({
            pathname:`/employee`,
            query: {id: update},
        });
        // router.push(`/employee/update`, `/employee/form?id=${update}`)
    }
    function handleDelete(id){
        dispatch(deleteAccount_id(id));
        dispatch(deleteEmployee(id));
        dispatch(deleteAccount(id));
    }
    // console.log();
    // console.log();
    return (
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
                    {_.filter(employees.employeeData, ['employment_type', 'Fulltime-Employee' || 'employment_type', 'Parttime-Employee']).map((row, index) => 
                        <TableRow
                            key={row.account_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.firstname}
                            </TableCell>
                            <TableCell align="center" color='#f9faa33'>{row.lastname}</TableCell>
                            <TableCell align="center">{accounts.accountData[_.findIndex(accounts.accountData, ['account_id', row.account_id])].email}</TableCell>
                            <TableCell align="center">{accounts.accountData[_.findIndex(accounts.accountData, ['account_id', row.account_id])].password}</TableCell>
                            <TableCell align="center">{row.salary_per_hour}</TableCell>
                            <TableCell align="center">{row.total_leaves}</TableCell>
                            <TableCell align="center">{row.total_absences}</TableCell>
                            <TableCell align="center">{row.total_overtime}</TableCell>
                            <TableCell align="center">{row.daily_wage}</TableCell>
                            <TableCell align="center">{row.monthly_salary}</TableCell>
                            <TableCell align="center"><Stack direction="column" spacing={2}><Button variant="contained" value={row.account_id} onClick={(event)=>redirectToDetails(event.target.value)}>Details</Button><Button variant="contained"  value={row.account_id} onClick={(event)=>redirectToUpdate(event.target.value)}>Update</Button><Button variant="contained"  value={row.account_id} onClick={(event)=>handleDelete(event.target.value)}>Delete</Button></Stack></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}