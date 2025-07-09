'use client';

import { useState } from 'react';
import CpcTaskList from '@/modules/TaskModules/CpcTaskList';
import EmployeeTaskList from '@/modules/TaskModules/EmployeeTaskList';
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";





export default function AllTaskListByRole() {
  const { currentUser, loading, isCpc } = useCurrentUser();

  if (loading) {
    return <div className="p-8 font-semibold">Loading dashboard...</div>;
  }
  return (
    <div className="">
      {isCpc? (
        <CpcTaskList  currentUser={currentUser} />
      ) : (
        <EmployeeTaskList  currentUser={currentUser} />
      )}
    </div>
  );
}