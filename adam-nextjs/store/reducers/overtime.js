import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format } from 'date-fns'

export const overtimeStore = createSlice({
    name: 'overtime',
    initialState: {
        account_ID: '',
        overtime_ID: '',
        date_and_time_started: '',
        date_and_time_ended: '',
        isConfirmed: 'Pending',
        overtimesData: [],
        accountOvertime: [],
    },
    reducers: {
        setOvertimeAccountID: (state, action)=>{
            const account_id = action.payload;
            state.account_ID = account_id;
        },
        setOvertimeDateStarted: (state, action) =>{
            const datestart = action.payload;
            state.date_and_time_started = datestart;
        },
        setOvertimeDateEnded: (state, action)=>{
            const dateend= action.payload;
            state.date_and_time_ended = dateend;
        },
        requestOvertime: (state, action)=>
        {
            const id = parseInt(action.payload);
            let overtimeID = 302210;
            let array;
            
            if (state.overtimesData.length > 0) {
               const overtimeLength = state.overtimesData.length;
               overtimeID = parseInt(state.overtimesData[overtimeLength -1 ].overtime_ID) + 1;
            }
            array = {
                account_ID: id,
                overtime_ID: parseInt(overtimeID),
                date_and_time_started: state.date_and_time_started,
                date_and_time_ended: state.date_and_time_ended,
                isConfirmed: state.isConfirmed,
            };
            state.overtimesData.push(array);
            state.account_ID = '';
            state.overtime_ID = '';
            state.date_and_time_started = '';
            state.date_and_time_ended = '';
            console.log(state.overtimesData);
        },
        deleteOvertime: (state, action) => {
            const id = action.payload;

            if(state.overtimesData.length>0){
                _.remove(state.overtimesData, function(value){
                    value.overtime_ID === parseInt(id);
                })
            }
        },
        updateOvertime: (state, action)=>{
            const id = action.payload;
            const overtimeIndex = _.findIndex(state.overtimesData, ['overtime_ID', parseInt(id)]);

            if(state.date_and_time_started ===''){
                state.date_and_time_started = state.overtimesData[overtimeIndex].date_and_time_started;
            }
            if(state.date_and_time_started ===''){
                state.date_and_time_started = state.overtimesData[overtimeIndex].date_and_time_started;
            }
            state.overtimesData[overtimeIndex] = {...state.overtimesData[overtimeIndex], reason: state.reason, date_and_time_started: parse(state.date_and_time_started, 'MM/dd/yyyy hh:mm:ss', new Date()), date_and_time_ended: parse(state.date_and_time_ended, 'MM/dd/yyyy hh:mm:ss', new Date())};
            state.account_ID = '';
            overtime_ID = '';
            state.date_and_time_started = '';
            state.date_and_time_ended = '';
        },
        confirmOvertime: (state, action)=>{
            const id = action.payload;
            const overtimeIndex = _.findIndex(state.overtimesData, ['overtime_ID', parseInt(id)]);
            state.overtimesData[overtimeIndex] = {...state.overtimesData[overtimeIndex], isConfirmed: 'Confirmed'};
            
            let array;
            array = {
                account_ID: state.overtimesData[overtimeIndex].account_ID,
                overtime_ID: state.overtimesData[overtimeIndex].overtime_ID,
                date_and_time_started: state.overtimesData[overtimeIndex].date_and_time_started,
                date_and_time_ended:  state.overtimesData[overtimeIndex].date_and_time_ended,
            }
            state.accountOvertime.push(array);
        },
        afteConfirmOvertime: (state, action)=>{
            const id = action.payload;

            _.remove(state.overtimesData, function(value){
                return value.overtime_ID === parseInt(id);
            })
        },
        denyOvertime: (state, action)=>{
            const id = action.payload;
            const overtimeIndex = _.findIndex(state.overtimesData, ['overtime_ID', parseInt(id)]);
            state.overtimesData[overtimeIndex] = {...state.overtimesData[overtimeIndex], isConfirmed: 'Denied'};
        },
    },
})

export const { setOvertimeAccountID, setOvertimeDateStarted, setOvertimeDateEnded, requestOvertime, deleteOvertime, updateOvertime, confirmOvertime, afteConfirmOvertime, denyOvertime } = overtimeStore.actions;

export default overtimeStore.reducer;