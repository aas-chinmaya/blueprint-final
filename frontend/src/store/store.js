import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/shared/authSlice';
import notificationReducer from './features/shared/notificationSlice';
import userReducer from './features/shared/userSlice';

import contactReducer from './features/pre-project/contactSlice';
import meetingReducer from './features/pre-project/meetingSlice';
import meetingCalendarReducer from './features/calender/meetingCalendarSlice';
import momReducer from './features/pre-project/momSlice';
import quotationReducer from './features/pre-project/quotationSlice';
import clientReducer from './features/pre-project/clientSlice';
import paymentReducer from './features/meeting/paymentSlice'

// Import your client slice
import projectReducer from './features/in-project/projectSlice';
import teamReducer from './features/in-project/teamSlice';
import taskReducer from './features/in-project/TaskSlice';
import bugReducer from './features/in-project/bugSlice';
import causeReducer from './features/pre-project/causeSlice';

//dashbaord & reports
import dashboardReducer from './features/dashboard/dashboardSlice';
import dashReducer from './features/dashboard/dashSlice';

import teamMembersReducer from './features/in-project/teamMembersSlice';
import viewTeamByProjectIdReducer from './features/in-project/viewTeamByProjectIdSlice';

//master table
import slotReducer from './features/master/slotMasterSlice';
import serviceReducer from './features/master/serviceMasterSlice';
import industriesReducer from './features/master/industriesMasterSlice';

 const store = configureStore({
  reducer: {
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
  
  },
})
export default store;