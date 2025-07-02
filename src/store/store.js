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

// Import your client slice
// import projectReducer from './features/projectSlice';
// import teamReducer from './features/teamSlice';
import taskReducer from './features/TaskSlice';
// import bugReducer from './features/bugSlice';
import causeReducer from './features/causeSlice';


// import viewAllTeamReducer from './features/viewallteamSlice';
// import projectOnboardingReducer from './features/projectonboardingSlice';
// import fetchallProjectsReducer from './features/fetchallProjectsSlice'; 
// import viewProjectsByIdReducer from './features/viewProjectsByIdSlice';
// import dashboardReducer from './features/dashboardSlice';

// import teamMembersReducer from './features/teamMembersSlice';
// import viewTeamByProjectIdReducer from './features/viewTeamByProjectIdSlice';
// import dashReducer from './features/dashSlice';
// import slotReducer from './features/calender/slotSlice';

//master table
import slotReducer from './features/master/slotMasterSlice';
import serviceReducer from './features/master/serviceMasterSlice';
import industriesReducer from './features/master/industriesMasterSlice';
const rootReducer = combineReducers({

  //shared reducers
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,

  
  //modules reducers
  
  contact: contactReducer,
  meetings: meetingReducer,
  meetingCalendar: meetingCalendarReducer,
  mom: momReducer,
  quotation : quotationReducer,
  client:clientReducer,
  // project:projectReducer,
  // task:taskReducer,
  // team: teamReducer,
  // bugs: bugReducer,
  // report: reportReducer,
  cause: causeReducer,
  //dashboard
  // dash: dashReducer,
  
  
  //master table reducers
  slots: slotReducer,
  services: serviceReducer,
  industries:industriesReducer




  //to be change or deleted
  // viewAllTeam: viewAllTeamReducer,
  // projectOnboarding: projectOnboardingReducer,
  // fetchallProjects: fetchallProjectsReducer,
  // projectView: viewProjectsByIdReducer,
  // dashboard:dashboardReducer,

  // teamMembers: teamMembersReducer,
  // projectTeam: viewTeamByProjectIdReducer,







});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
