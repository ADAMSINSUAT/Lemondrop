import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format } from 'date-fns'

export const employerStore = createSlice({
    name: 'employer',
    initialState: {
        employment_type: '',
        account_id: '',
        fullname: '',
        email: '',
        password: '',
        associated_company: '',
        employerData: [
            {
            employment_type: 'Employer',
            account_id: 2,
            fullname: 'Joe Frazer',
            email: 'joefrazer@gmail.com',
            password: 'joe123',
            associated_company: 'Lemondrop',
            },
        ],
    },
    reducers: {
        setEmployerEmployment: (state, action)=>{
            const employment = action.payload;
            state.employment_type = employment;
        },
        setEmployerAccount_ID: (state, action)=>{
            const account_id = action.payload;
            state.account_id = account_id;
        },
        setEmployerEmail: (state, action)=>{
            const email = action.payload;
            state.email = email;
        },
        setEmployerPassword: (state, action)=>{
            const password = action.payload;
            state.password = password;
        },
        setEmployerAssociated_Company: (state, action)=>{
            const company = action.payload;
            state.associated_company = company;
        },
        addEmployer: (state)=>{
            let array = {
                employment_type: state.employment_type,
                account_id: state.account_id,
                fullname: state.fullname,
                email: state.email,
                password: state.password,
                associated_company: state.associated_company,
            }

            state.employerData.push(array);

            state.employment_type = '';
            state.account_id = '';
            state.fullname = '',
            state.email = '';
            state.password = '';
            state.associated_company = '';
        },
        updateEmployer: (state, action)=>{
            const index = action.payload;
            state.employerData[index] = {...state.employerData[index], fullname:state.fullname, email: state.email, password: state.password, associated_company: state.company};
            state.employment_type = '';
            state.account_id = '';
            state.fullname = '',
            state.email = '';
            state.password = '';
            state.associated_company = '';
        },
        deleteEmployer: (state, action)=>{
            const index = action.payload;
            state.employerData.splice(index, 1);
        },
    }
})

export const { setEmployerEmployment, setEmployerAccount_ID, setEmployerAssociated_Company, setEmployerEmail, setEmployerPassword, addEmployer, updateEmployer, deleteEmployer  } = employerStore.actions;

export default employerStore.reducer;