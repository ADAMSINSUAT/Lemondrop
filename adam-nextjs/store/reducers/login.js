import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format } from 'date-fns'

export const loginStore = createSlice({
    name: 'login',
    initialState: {
        account_id: '',
        fullname: '',
        employment_type: '',
        email: '',
        password: '',
        // loginData: {
        //     account_id: 2,
        //     fullname: 'Joe Frazer',
        //     employment_type: 'Employer',
        //     email: 'joefrazer@gmail.com',
        //     password: 'joe123',
            
        // },
        loginData: [],
    },
    reducers: {
        setAccount_ID: (state, action) =>{
            const id = action.payload;
            state.account_id = id;
        },
        setFullName: (state, action) =>{
            const fullname = action.payload;
            state.fullname = fullname;
        },
        setEmployment_Type: (state, action) =>{
            const employmentType = action.payload;
            state.employment_type = employmentType;
        },
        setEmail: (state, action) =>{
            const email = action.payload;
            state.email = email;
        },
        setPassword: (state, action) =>{
            const password = action.payload;
            state.password = password;
        },
        updateLogin: (state, action)=>{
            state.loginData[0] = {...state.loginData[0], email: state.email, password: state.password, fullname: state.fullname};
            state.email = '';
            state.password = '';
            state.fullname = '';
        },
        loginUser: (state)=>{
            let array= {
                account_id: state.account_id,
                fullname: state.fullname,
                employment_type: state.employment_type,
                email: state.email,
                password: state.password
            };
            state.loginData.push(array);
            state.account_id ='';
            state.email = '';
            state.employment_type = '';
            state.fullname = '';
            state.password = '';
        },
        logoutUser: (state, action)=>{
            // const {account_id} = action.payload;
            // const loginIndex = _.findIndex(state.loginData, ['account_id', account_id])
            state.loginData.splice(0, 1);
        },
    }
})

export const { loginUser, logoutUser, updateLogin, setAccount_ID, setFullName, setEmployment_Type, setEmail, setPassword } = loginStore.actions;

export default loginStore.reducer;