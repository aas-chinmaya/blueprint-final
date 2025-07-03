"use client";

import CpcDashboard from "@/components/dashboard/dashboardcontainer/CpcDashboard";
import EmployeeDashboard from "@/components/dashboard/dashboardcontainer/EmployeeDashboard";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const {
    userData,
    employeeData,
    loading: userLoading,
  } = useSelector((state) => state.user) || {};

  const currentUser = {
    // role: "employee", // Change to 'employee' or 'team_lead' for testing
    role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
    name: employeeData?.name,
  };


  return (
    <>
      {/* {currentUser.role === "cpc" ? (
        <CpcDashboard currentUser={currentUser} />
      ) : (
        <EmployeeDashboard currentUser={currentUser} />
      )} */}
    </>
  );
}
