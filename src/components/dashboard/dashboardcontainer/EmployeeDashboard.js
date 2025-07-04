"use client";
import { SectionCardEmployee } from "@/components/dashboard/section-cards";
import {  ChartAreaInteractiveEmployee } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EmployeeDashboard() {
  const dispatch = useDispatch();

    const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};
const currentUser = {
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
 
};

 
  return (
    <div className="space-y-6">

      <SectionCardEmployee />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractiveEmployee />
      </div>
      <DataTable  />
    </div>
    
   
  );
}
