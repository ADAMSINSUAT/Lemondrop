import { configureStore, combineReducers } from '@reduxjs/toolkit';
import employeeReducer from './reducers/employee.js';
import companyReducer from './reducers/company.js';
import loginReducer from './reducers/login.js';
import accountReducer from './reducers/account.js';
import employerReducer from './reducers/employer.js';
import leaveReducer from './reducers/leave.js';
import overtimeReducer from './reducers/overtime.js';
import absenceReducer from './reducers/absence.js';
import { persistReducer} from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined"? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: storage
}

const reducers = combineReducers({
  employee: employeeReducer,
  employer: employerReducer,
  company: companyReducer,
  login: loginReducer,
  account: accountReducer,
  leave: leaveReducer,
  overtime: overtimeReducer,
  absence: absenceReducer,
})

const persistedReducers = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
})