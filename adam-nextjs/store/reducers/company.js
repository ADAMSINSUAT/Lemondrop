import {createSlice} from "@reduxjs/toolkit";
//import { CLIENT_STATIC_FILES_PATH } from "next/dist/shared/lib/constants";

export const companyStore = createSlice({
    name: 'company',
    initialState:{
        findId: '',
        id: '',
        name: '',
        leaves: '',
        overtime_limit: '',
        companyData:[{
            id: 1,
            name: 'Lemondrop',
            leaves: 2,
            account_id: [1, 2],
            overtime_limit: 5,
        },
        {
            id: 2,
            name: 'Apple',
            leaves: 10,
            account_id: [],
            overtime_limit: 25,
        },
    ]
    },
    reducers:{
        setCompanyName: (state, action) =>{
            const companyname = action.payload;
            state.name = companyname;
        },
        setCompanyLeaves: (state, action) =>{
            const companyleaves = action.payload;
            state.leaves = companyleaves;
        },
        setCompanyOverTime: (state, action) =>{
            const companyovertime = action.payload;
            state.overtime_limit = companyovertime;
        },
        addCompany: (state)=>{
            let index = state.companyData.length;
            let id = state.companyData[index - 1].id +1 ;
            console.log(id)
            state.id = id;
            const array = {
                id: state.id,
                name: state.name,
                leaves: state.leaves,
                account_id: [],
                overtime_limit: state.overtime_limit,
            };
            state.companyData.push(array);
            state.id = '';
            state.name = '';
            state.leaves = '';
            state.account_id = '';
            state.overtime_limit = '';
        },
        addAccount_id: (state, action)=>{
            const {index, id} = action.payload;
            state.companyData[index].account_id.push(parseInt(id));
            state.id = '';
            state.name = '';
            state.leaves = '';
            state.account_id = '';
            state.overtime_limit = '';
        },
        deleteAccount_id: (state, action)=>{
            const accountID = parseInt(action.payload);

            //let accountIndex;
            
            _.map(state.companyData, (value, index)=>{
               _.remove(value.account_id, function(accID){
                return accID === accountID;
               });
            });

            // _.map(state.companyData, (value, index) => {
            //     value.account_id.splice(accountIndex, 1);
            // })
            //state.companyData.account_id.splice(accountIndex, 1);
        },
        deleteCompany: (state, action)=>{
            const id = parseInt(action.payload);
            _.remove(state.companyData, function(value){
                value.id === id;
            })
        },
        updateCompany: (state, action)=>{
            const id = action.payload;
            const index = _.findIndex(state.companyData, ['id', parseInt(id)]);
            console.log(index);
            state.companyData[index] = {...state.companyData[index], name: state.name, leaves: state.leaves, overtime_limit: state.overtime_limit};
            state.id = '';
            state.name = '';
            state.leaves = '';
            state.account_id = '';
            state.overtime_limit = '';
        },
    }
});

export const {setCompanyName, setCompanyLeaves, setCompanyOverTime, addCompany, deleteCompany, updateCompany, companyData, addAccount_id, deleteAccount_id} = companyStore.actions;

export default companyStore.reducer;