import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './features/authSlice';
// import sidebarReducer from './features/sidebarSlice';
// import viewAllTeamReducer from './features/viewallteamSlice';
// import projectOnboardingReducer from './features/projectonboardingSlice';
// import fetchallProjectsReducer from './features/fetchallProjectsSlice'; 
// import viewProjectsByIdReducer from './features/viewProjectsByIdSlice';
// import projectReducer from './features/projectSlice';
// import clientReducer from './features/clientSlice'; // Import your client slice
// import dashboardReducer from './features/dashboardSlice';

// import teamMembersReducer from './features/teamMembersSlice';
// import viewTeamByProjectIdReducer from './features/viewTeamByProjectIdSlice';
// import taskReducer from './features/TaskSlice';
// import notificationReducer from './features/notificationSlice';
// import bugReducer from './features/bugSlice';
// import userReducer from './features/userSlice';
// import dashReducer from './features/dashSlice';
// import meetingReducer from './features/meetingSlice';
import contactReducer from './features/contactSlice';
// import teamReducer from './features/teamSlice';
// import momReducer from './features/momSlice';
// import slotReducer from './features/master/slotMasterSlice';
// // import slotReducer from './features/calender/slotSlice';
// import meetingCalendarReducer from './features/calender/meetingCalendarSlice';
import quotationReducer from './features/quotationSlice';

// import serviceReducer from './features/master/serviceMasterSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  // sidebar: sidebarReducer,
  
  // viewAllTeam: viewAllTeamReducer,
  // projectOnboarding: projectOnboardingReducer,
  // fetchallProjects: fetchallProjectsReducer,
  // projectView: viewProjectsByIdReducer,
  // client:clientReducer,
  // project:projectReducer,
  // dashboard:dashboardReducer,
  // task:taskReducer,

  // teamMembers: teamMembersReducer,
  // projectTeam: viewTeamByProjectIdReducer,
  // notifications: notificationReducer,
  // bugs: bugReducer,
  // user: userReducer,
  // dash: dashReducer,
  // meetings: meetingReducer,
  contact: contactReducer,
  // team: teamReducer,
  // mom: momReducer,


  // slots: slotReducer,
  // meetingCalendar: meetingCalendarReducer,



  // //master
  //   slots: slotReducer,
    services: serviceReducer,
    quotation : quotationReducer,

});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
