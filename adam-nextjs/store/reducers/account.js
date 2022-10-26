import {createSlice} from "@reduxjs/toolkit";

export const accountStore = createSlice({
    name: 'account',
    initialState:{
        findId: '',
        account_id: '',
        email: '',
        fullname: '',
        firstname: '',
        lastname: '',
        password: '',
        type: '',
        associated_company: '',
        accountData: [
            {
                account_id: 1,
                associated_company: 'Lemondrop',
                firstname: 'Adam',
                lastname: 'Sinsuat',
                email: 'adamsinsuat@gmail.com',
                password: 'adam123',
                type: 'Employee',
            },
            {
                account_id: 2,
                associated_company: 'Lemondrop',
                firstname: 'Joe',
                lastname: 'Frazer',
                email: 'joefrazer@gmail.com',
                password: 'joe123',
                type: 'Employer',
            },
            {
                account_id: 3,
                fullname: 'Admin',
                email: 'admin',
                password: 'admin123',
                type: 'Admin',
            },
        ]
    },
    reducers:{
        setAccountFullName: (state, action) =>{
            const fullname = action.payload;
            state.fullname = fullname;
        },
        setAccountFirstName: (state, action) =>{
            const firstname = action.payload;
            state.firstname = firstname;
        },
        setAccountLastName: (state, action) =>{
            const lastname = action.payload;
            state.lastname = lastname;
        },
        setAccountEmail: (state, action) =>{
            const email = action.payload;
            state.email = email;
        },
        setAccountPassword: (state, action) =>{
            const password = action.payload;
            state.password = password;
        },
        setType: (state, action) =>{
            const employeetype = action.payload;
            state.type = employeetype;
        },
        setAccountAssociatedCompany: (state, action)=>{
            const associated_company = action.payload;
            state.associated_company = associated_company;
        },
        addAccount: (state)=>{
            const accountIndex = state.accountData.length;
            let id = state.accountData[accountIndex - 1].account_id + 1;
            state.account_id = id;
            let array;
            if(state.type === 'Employee'){
                array = {
                    account_id: state.account_id,
                    associated_company: state.associated_company,
                    firstname: state.firstname,
                    lastname: state.lastname,
                    email: state.email,
                    password: state.password,
                    type: state.type,
                };
            }
            if(state.type === 'Employer'){
                array = {
                    account_id: state.account_id,
                    associated_company: state.associated_company,
                    email: state.email,
                    firstname: state.firstname,
                    lastname: state.lastname,
                    password: state.password,
                    type: state.type,
                };
            }
            // if(state.type === 'Admin'){
            //     array = {
            //         account_id: state.account_id,

            //         email: state.email,
            //         password: state.password,
            //         type: state.type,
            //     };
            // }
            state.accountData.push(array);
            state.email = '';
            state.fullname = '';
            state.firstname ='';
            state.lastname = '';
            state.password = '';
            state.type = '';
        },
        deleteAccount: (state, action)=>{
            const accountID = parseInt(action.payload);
            _.remove(state.accountData, function(value){
                return value.account_id === accountID
            })
        },
        updateAccount: (state, action)=>{
            const id = action.payload;
            const index = _.findIndex(state.accountData, ['account_id', parseInt(id)]);
            if (state.accountData[index].type === 'Employee') {
                if(state.email === ''){
                    state.email = state.accountData[index].email;
                }
                if(state.password === ''){
                    state.password = state.accountData[index].password;
                }
                state.accountData[index] = { ...state.accountData[index], email: state.email, password: state.password } 
            }
            if (state.accountData[index].type === 'Employer') {
                if(state.firstname === ''){
                    state.firstname = state.accountData[index].firstname;
                }
                if(state.lastname === ''){
                    state.lastname = state.accountData[index].lastname;
                }
                if(state.email === ''){
                    state.email = state.accountData[index].email;
                }
                if(state.password === ''){
                    state.password = state.accountData[index].password;
                }
                state.accountData[index] = { ...state.accountData[index], firstname: state.firstname, lastname: state.lastname, email: state.email, password: state.password }
               
            }
            if (state.accountData[index].type === 'Admin') {
                state.accountData[index] = { ...state.accountData[index], fullname: state.fullname, email: state.email, password: state.password } 
            } 
            state.email = '';
            state.fullname = '';
            state.firstname ='';
            state.lastname = '';
            state.password = '';
            state.type = '';
        }
    }
})

export const {setAccountPassword, setType, addAccount, deleteAccount, updateAccount, setAccountFullName, setAccountFirstName, setAccountLastName,  setAccountEmail, setAccountAssociatedCompany} = accountStore.actions;

export default accountStore.reducer;