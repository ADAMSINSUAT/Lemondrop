import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';
import { isEqual, isSameMonth, parseISO, parse, format } from 'date-fns'

export const absenceStore = createSlice({
    name: 'absence',
    initialState: {
        account_ID: '',
        absence_ID: '',
        reason: '',
        date_started: '',
        date_ended: '',
        absencesData: [],
    },
    reducers: {
        setAbsenceAccountID: (state, action)=>{
            const account_id = action.payload;
            state.account_ID = account_id;
        },
        setAbsenceReason: (state, action)=>{
            const reason = action.payload;
            state.reason = reason;
        },
        setAbsenceDateStarted: (state, action) =>{
            const datestart = action.payload;
            state.date_started = datestart;
        },
        setAbsenceDateEnded: (state, action)=>{
            const dateend= action.payload;
            state.date_ended = dateend;
        },
        addAbsence: (state, action)=>
        {
            const id = parseInt(action.payload);
            let absenceID = 402210;
            let array;
            
            if (state.absencesData.length > 0) {
               const absenceLength = state.absencesData.length;
               absenceID = parseInt(state.absencesData[absenceLength -1 ].absence_ID) + 1;
            }
            array = {
                account_ID: id,
                absence_ID: parseInt(absenceID),
                reason: state.reason,
                date_started: state.date_started,
                date_ended: state.date_ended,
                date_created: format(new Date(), 'MM/dd/yyyy'),
            };
            state.absencesData.push(array);
            state.account_ID = '';
            state.absence_ID = '';
            state.reason = '';
            state.date_started = '';
            state.date_ended = '';
            console.log(state.absencesData)
        },
        deleteAbsence: (state, action) => {
            const id = action.payload;

            if(state.absencesData.length>0){
                _.remove(state.absencesData, function(value){
                    value.absence_ID === parseInt(id);
                })
            }
        },
        updateAbsence: (state, action)=>{
            const id = action.payload;
            const absenceIndex = _.findIndex(state.absencesData, ['absence_ID', parseInt(id)]);

            if(state.reason ===''){
                state.reason = state.absencesData[absenceIndex].reason;
            }
            if(state.date_started ===''){
                state.date_started = state.absencesData[absenceIndex].date_started;
            }
            if(state.date_started ===''){
                state.date_started = state.absencesData[absenceIndex].date_started;
            }
            state.absencesData[absenceIndex] = {...state.absencesData[absenceIndex], reason: state.reason, date_started: state.date_started, date_ended: state.date_ended};
            state.account_ID = '';
            absence_ID = '';
            state.reason = '';
            state.date_started = '';
            state.date_ended = '';
        },
    },
})

export const { setAbsenceAccountID, setAbsenceReason, setAbsenceDateStarted, setAbsenceDateEnded, addAbsence, deleteAbsence, updateAbsence, } = absenceStore.actions;

export default absenceStore.reducer;