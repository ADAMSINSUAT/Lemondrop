import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format } from 'date-fns'

export const leaveStore = createSlice({
    name: 'leave',
    initialState: {
        account_ID: '',
        leave_ID: '',
        reason: '',
        date_started: '',
        date_ended: '',
        isConfirmed: 'Pending',
        leavesData: [],
        accountLeave: [],
    },
    reducers: {
        setLeaveAccountID: (state, action)=>{
            const account_id = action.payload;
            state.account_ID = account_id;
        },
        setLeaveReason: (state, action)=>{
            const reason = action.payload;
            state.reason = reason;
        },
        setLeaveDateStarted: (state, action) =>{
            const datestart = action.payload;
            state.date_started = datestart;
        },
        setLeaveDateEnded: (state, action)=>{
            const dateend= action.payload;
            state.date_ended = dateend;
        },
        requestLeave: (state, action)=>
        {
            const id = parseInt(action.payload);
            let leaveID = 202210;
            let array;
            
            if (state.leavesData.length > 0) {
               const leaveLength = state.leavesData.length;
               leaveID = parseInt(state.leavesData[leaveLength -1 ].leave_ID) + 1;
            }
            array = {
                account_ID: id,
                leave_ID: parseInt(leaveID),
                reason: state.reason,
                date_started: state.date_started,
                date_ended: state.date_ended,
                isConfirmed: state.isConfirmed,
            };
            state.leavesData.push(array);
            state.account_ID = '';
            state.leave_ID = '';
            state.reason = '';
            state.date_started = '';
            state.date_ended = '';
            console.log(state.leavesData)
        },
        deleteLeave: (state, action) => {
            const id = action.payload;

            if(state.leavesData.length>0){
                _.remove(state.leavesData, function(value){
                    value.leave_ID === parseInt(id);
                })
            }
        },
        updateLeave: (state, action)=>{
            const id = action.payload;
            const leaveIndex = _.findIndex(state.leavesData, ['leave_ID', parseInt(id)]);

            if(state.reason ===''){
                state.reason = state.leavesData[leaveIndex].reason;
            }
            if(state.date_started ===''){
                state.date_started = state.leavesData[leaveIndex].date_started;
            }
            if(state.date_started ===''){
                state.date_started = state.leavesData[leaveIndex].date_started;
            }
            state.leavesData[leaveIndex] = {...state.leavesData[leaveIndex], reason: state.reason, date_started: parse(state.date_started, 'MM/dd/yyyy', new Date()), date_ended: parse(state.date_ended, 'MM/dd/yyyy', new Date())};
            state.account_ID = '';
            leave_ID = '';
            state.reason = '';
            state.date_started = '';
            state.date_ended = '';
        },
        confirmLeave: (state, action)=>{
            const id = action.payload;
            const leaveIndex = _.findIndex(state.leavesData, ['leave_ID', parseInt(id)]);
            state.leavesData[leaveIndex] = {...state.leavesData[leaveIndex], isConfirmed: 'Confirmed'};
            
            // let array;
            // array = {
            //     account_ID: state.leavesData[leaveIndex].account_ID,
            //     leave_ID: state.leavesData[leaveIndex].leave_ID,
            //     reason: state.leavesData[leaveIndex].reason,
            //     date_started: state.leavesData[leaveIndex].date_started,
            //     date_ended:  state.leavesData[leaveIndex].date_ended,
            // }
            // state.accountLeave.push(array);
        },
        afterConfirmLeave: (state, action)=>{
            const id = action.payload;
            const index = _.findIndex(state.leavesData, ['leave_ID', parseInt(id)]);
            state.accountLeave.splice(index, 1);
            // _.filter(state.leavesData, function(value){
            //     return value.leave_ID !== parseInt(id)
            // })
            // _.remove(state.leavesData, function(value){
            //     return value.leave_ID === parseInt(id);
            // })
        },
        denyLeave: (state, action)=>{
            const id = action.payload;
            const leaveIndex = _.findIndex(state.leavesData, ['leave_ID', parseInt(id)]);
            state.leavesData[leaveIndex] = {...state.leavesData[leaveIndex], isConfirmed: 'Denied'};
        },
    },
})

export const { setLeaveAccountID, setLeaveReason, setLeaveDateStarted, setLeaveDateEnded, requestLeave, deleteLeave, updateLeave, confirmLeave, afterConfirmLeave, denyLeave } = leaveStore.actions;

export default leaveStore.reducer;