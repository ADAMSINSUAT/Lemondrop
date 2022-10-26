import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format, differenceInHours, differenceInMinutes } from 'date-fns'

export const employeeStore = createSlice({
    name: 'employee',
    initialState: {
        name: '',
        findId: '',
        employment_type: '',
        account_id: '',
        firstname: '',
        lastname: '',
        associated_company: '',
        salary_per_hour: '',
        absence: [],
        leaves: [],
        overtime: [],

        employeeData: [
            {
            employment_type: 'Fulltime-Employee',
            account_id: 1,
            firstname: 'Adam',
            lastname: 'Sinsuat',
            associated_company: 'Lemondrop',
            salary_per_hour: 25,
            absence: [{
                reason: 'Sick',
                date_started: `10/12/2022`,
                date_ended: `10/12/2022`,
            }],
            leaves: [
                {
                    reason: 'Family Emergency',
                    date_started: `10/06/2022`,
                    date_ended: `10/08/2022`,
                },
            ],
            overtime: [{
                date_and_time_started: '10/19/2022 06:00:00 AM',
                date_and_time_ended: '10/19/2022 08:00:00 PM',
            }],
            total_leaves: 0,
            total_absences: 0,
            total_overtime: 0,
            daily_wage: 0,
            monthyl_salary: 0,
        },
        ],
        employees:[],
    },
    reducers: {
        setEmploymentType: (state, action) => {
            const employment = action.payload;
            state.employment_type = employment;
        },
        setFirstName: (state, action) => {
           const firstname = action.payload;
           state.firstname = firstname;
        },
        setLastName: (state, action) => {
           const lastname = action.payload;
           state.lastname = lastname;
        },
        setAssociateCompany: (state, action) => {
           const associated_company = action.payload;
           state.associated_company = associated_company;
        },
        setSalaryPerHour: (state, action) => {
           const salary_per_hour = action.payload;
           state.salary_per_hour = parseInt(salary_per_hour);
        },
        addEmployee: (state, action) => {
            let index = state.employeeData.length;
            let id = parseInt(action.payload);
            state.account_id = id;
            const array = {
               employment_type: state.employment_type,
               account_id: state.account_id, 
               firstname: state.firstname, 
               lastname: state.lastname, 
               associated_company: state.associated_company, 
               salary_per_hour: parseInt(state.salary_per_hour), 
               absence: state.absence,
               leaves: state.leaves,
               overtime: state.overtime,
               total_leaves: 0,
               total_absences: 0,
               total_overtime: 0,
               daily_wage: 0,
               monthy_salary: 0,
            }
            console.log(array)
            state.employeeData.push(array);
            state.account_id = '';
            state.employment_type = '';
            state.firstname = '';
            state.lastname = '';
            state.associated_company = '';
            state.salary_per_hour = '';
        },
        deleteEmployee: (state, action) => {
            const id = action.payload;
            _.remove(state.employeeData, function(value){
                return value.account_id === parseInt(id);
            })
        },
        updateEmployee: (state, action) => {
            const index = action.payload;
            if(state.firstname ===''){
                state.firstname= state.employeeData[index].firstname;
            }
            if(state.lastname ===''){
                state.lastname = state.employeeData[index].lastname
            }
            if(state.salary_per_hour ==='' || state.salary_per_hour===0){
                state.salary_per_hour = state.employeeData[index].salary_per_hour;
            }

            state.employeeData[index] = { ...state.employeeData[index], firstname: state.firstname, lastname: state.lastname, salary_per_hour: state.salary_per_hour };

            state.firsname = '';
            state.lastname = '';
            state.salary_per_hour = '';
        },
        addLeaves: (state, action) =>{
            const {account_id, leaveArray} = action.payload;
            const index = _.findIndex(state.employeeData, ['account_id', parseInt(account_id)]);
            console.log(index);
            console.log(leaveArray);
            if (index !== -1) {
                state.employeeData[index].leaves.push(leaveArray);
            }
        },
        addOvertimes: (state, action) =>{
            const {account_id, overtimeArray} = action.payload;
            const index = _.findIndex(state.employeeData, ['account_id', parseInt(account_id)]);
            console.log(index);
            console.log(overtimeArray);
            if (index !== -1) {
                state.employeeData[index].overtime.push(overtimeArray);
            }
        },
        addAbsences: (state, action) =>{
            const {account_id, absenceArray} = action.payload;
            const index = _.findIndex(state.employeeData, ['account_id', parseInt(account_id)]);
            console.log(index);
            console.log(absenceArray);
            if (index !== -1) {
                state.employeeData[index].absence.push(absenceArray);
            }
        },
        computeLeaves: (state, action) => {
            //Get the current date
            const date = new Date();

            //Get companyData that matches account_ID
            const companies = action.payload;

            let empIndex = '';

            let compute;

            let result;
            
            if(companies.account_id.length>0){
                _.map(companies.account_id, (value, index)=>{
                    empIndex =_.findIndex(state.employeeData, ['account_id', parseInt(value)])
                    console.log(empIndex);
                    if (empIndex !== -1) {
                            //Array for holding same months of leave date_started and leave date_ended
                           const sameMonth = [];
                            _.forEach(state.employeeData[empIndex].leaves, function (empValue) {
                                if (isSameMonth(date, parse(empValue.date_started, 'MM/dd/yyyy', new Date()))) {
                                    console.log(empValue.date_and_time_started);
                                    sameMonth.push(empValue.date_started);
                                }
                            })
                            console.log(sameMonth);
                            compute = companies.leaves - sameMonth.length;
                            result = compute > 0 ? compute : 0;

                            state.employeeData[empIndex] = { ...state.employeeData[empIndex], total_leaves: result }
                    }
                });
            }
        },
        computeAbsences: (state, action) => {
            //Get the current date
            const date = new Date();

            //Get companyData that matches account_ID
            const companies = action.payload;

            let empIndex = '';

            let computeLeaves;

            let computeAbsences;

            let result;
            
            if(companies.account_id.length>0){
                _.map(companies.account_id, (value, index)=>{
                    empIndex =_.findIndex(state.employeeData, ['account_id', parseInt(value)])

                    if (empIndex !== -1) {
                        if (state.employeeData[empIndex].absence.length > 0) {
                            //Array for holding same months of absence date_started and absence date_ended
                            const sameMonthAbsence = [];
                            const sameMonthLeave = [];
                            _.forEach(state.employeeData[empIndex].absence, function (empValue) {
                                if (isSameMonth(date, parse(empValue.date_started, 'MM/dd/yyyy', new Date()))) {
                                    sameMonthAbsence.push(empValue.date_started);
                                }
                            })
                            
                                _.forEach(state.employeeData[empIndex].leaves, function (empValue) {
                                    if (isSameMonth(date, parse(empValue.date_ended, 'MM/dd/yyyy', new Date()))) {
                                        sameMonthLeave.push(empValue.date_ended);
                                    }
                                })
                            console.log(sameMonthAbsence.length);
                            console.log(sameMonthLeave.length);

                            computeLeaves = sameMonthLeave.length - companies.leaves;

                            computeAbsences = sameMonthAbsence.length + (computeLeaves > 0 ? computeLeaves : 0);

                            state.employeeData[empIndex] = { ...state.employeeData[empIndex], total_absences: computeAbsences }
                        }
                    }
                });
            }
        },
        computeOvertime: (state, action) => {
            //Get the current date
            const date = new Date();

            //Get companyData that matches account_ID
            const companies = action.payload;

            let empIndex = '';

            let compute;

            let result;
            
            if(companies.account_id.length>0){
                _.map(companies.account_id, (value, index)=>{
                    empIndex =_.findIndex(state.employeeData, ['account_id', parseInt(value)])

                    if (empIndex !== -1) {
                        if(state.employeeData[empIndex].overtime.length>0){
                            //Array for holding same months of overtime date_started and overtime date_ended
                            const sameMonthOvertimeStart = [];
                            const sameMonthOvertimeEnd = [];
                            _.forEach(state.employeeData[empIndex].overtime, function (empValue) {
                                if (isSameMonth(date, parse(empValue.date_and_time_started, 'MM/dd/yyyy hh:mm:ss a', new Date()))) {
                                    sameMonthOvertimeStart.push(empValue.date_and_time_started);
                                }
                                if (isSameMonth(date, parse(empValue.date_and_time_started, 'MM/dd/yyyy hh:mm:ss a', new Date()))) {
                                    sameMonthOvertimeEnd.push(empValue.date_and_time_ended);
                                }
                            })

                            let totalOvertime = 0;
                            _.forEach(sameMonthOvertimeStart, (value, index)=>{
                                totalOvertime+=differenceInHours(parse(sameMonthOvertimeEnd[index], 'MM/dd/yyyy hh:mm:ss a', new Date()), parse(sameMonthOvertimeStart[index], 'MM/dd/yyyy hh:mm:ss a', new Date()));
                            })
                            console.log(totalOvertime)
                            //compute = companies.overtime_limit - totalOvertime;
    
                            result = totalOvertime > companies.overtime_limit ? companies.overtime_limit: totalOvertime;

                            state.employeeData[empIndex] = { ...state.employeeData[empIndex], total_overtime: result }
                        }
                    }
                });
            }
        },
        computeDailyWage: (state, action)=>{
            const id = parseInt(action.payload);

            const empIndex = _.findIndex(state.employeeData, ['account_id', id]);

            let dailywage;

            if(state.employeeData[empIndex].employment_type === 'Fulltime-Employee'){
                dailywage = parseInt(state.employeeData[empIndex].salary_per_hour) * 8;
                state.employeeData[empIndex] = {...state.employeeData[empIndex], daily_wage: dailywage};
            }
            if(state.employeeData[empIndex].employment_type === 'Parttime-Employee'){
                dailywage = parseInt(state.employeeData[empIndex].salary_per_hour) * 4;
                state.employeeData[empIndex] = {...state.employeeData[empIndex], daily_wage: dailywage};
            }
        },
        computeMonthlySalary: (state, action)=>{
            const id = parseInt(action.payload);

            const empIndex = _.findIndex(state.employeeData, ['account_id', id]);

            let monthlysalary;

            monthlysalary = (state.employeeData[empIndex].daily_wage*20) + (state.employeeData[empIndex].total_overtime * (0.20*state.employeeData[empIndex].salary_per_hour)) + (state.employeeData[empIndex].total_leaves * state.employeeData[empIndex].daily_wage) - (state.employeeData[empIndex].total_absences * state.employeeData[empIndex].daily_wage);

            state.employeeData[empIndex] = {...state.employeeData[empIndex], monthly_salary: monthlysalary};
        },
    }
})

export const { addLeaves, addOvertimes, addAbsences, setEmploymentType, setFirstName, setLastName, setAssociateCompany, setSalaryPerHour, addEmployee, updateEmployee, deleteEmployee, computeLeaves, computeOvertime, computeAbsences, computeDailyWage, computeMonthlySalary, employeeData, getEmployeeData } = employeeStore.actions;

export default employeeStore.reducer;