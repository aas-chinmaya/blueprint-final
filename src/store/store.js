import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from './features/shared/authSlice';
import notificationReducer from './features/shared/notificationSlice';
import userReducer from './features/shared/userSlice';

import contactReducer from './features/contactSlice';
import meetingReducer from './features/meetingSlice';
import meetingCalendarReducer from './features/calender/meetingCalendarSlice';
import momReducer from './features/momSlice';
import quotationReducer from './features/quotationSlice';
import clientReducer from './features/clientSlice';
import paymentReducer from './features/meeting/paymentSlice'

// Import your client slice
import projectReducer from './features/projectSlice';
import teamReducer from './features/teamSlice';
import taskReducer from './features/TaskSlice';
import bugReducer from './features/bugSlice';
import causeReducer from './features/causeSlice';


import dashboardReducer from './features/dashboardSlice';

import teamMembersReducer from './features/teamMembersSlice';
import viewTeamByProjectIdReducer from './features/viewTeamByProjectIdSlice';
import dashReducer from './features/dashSlice';

//master table
import slotReducer from './features/master/slotMasterSlice';
import serviceReducer from './features/master/serviceMasterSlice';
import industriesReducer from './features/master/industriesMasterSlice';
const rootReducer = combineReducers({

  //shared reducers
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,

  payment: paymentReducer,
  //modules reducers
  
  contact: contactReducer,
  meetings: meetingReducer,
  meetingCalendar: meetingCalendarReducer,
  mom: momReducer,
  quotation : quotationReducer,
  client:clientReducer,
  project:projectReducer,
  task:taskReducer,
  team: teamReducer,
  bugs: bugReducer,

  cause: causeReducer,
  //dashboard
  dash: dashReducer,
  dashboard:dashboardReducer,
  
  
  //master table reducers
  slots: slotReducer,
  services: serviceReducer,
  industries:industriesReducer,



  teamMembers: teamMembersReducer,
  projectTeam: viewTeamByProjectIdReducer,







});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
