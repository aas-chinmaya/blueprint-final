'use client';

import { useState } from 'react';
import CpcTaskList from './CpcTaskList';
import EmployeeTaskList from './EmployeeTaskList';
import { useDispatch, useSelector } from "react-redux";





export default function AllTaskListByRole() {
      const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};


const currentUser = {
  // role: "employee", // Change to 'employee' or 'team_lead' for testing
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
  teamLeadId: 'TL001', // Set to null for employees without team lead role
};
  return (
    <div className="">
      {currentUser.role === "cpc" ? (
        <CpcTaskList  currentUser={currentUser} />
      ) : (
        <EmployeeTaskList  currentUser={currentUser} />
      )}
    </div>
  );
}