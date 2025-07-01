'use client'

import { useSelector } from "react-redux"

import PerformanceReport from "./team/PerformanceReport"
import TaskStatusReport from "./team/TaskStatusReport"
import ResourceUtilization from "./team/ResourceUtilization"

import MyTaskReport from "./employee/MyTaskReport"
import MyHoursReport from "./employee/MyHoursReport"
import MyProgressChart from "./employee/MyProgressChart"

export default function ReportDashboard() {
//   const { user } = useSelector((state) => state.auth)
//   const { user } = useSelector((state) => state.auth)
const user={
    designation: "cpc" // Example designation, replace with actual user data
    // designation: "teamLead" // Example designation, replace with actual user data
}
  if (!user?.designation) return <div>Loading reports...</div>

  const isTeamLead = ["teamLead", "cpc", "manager"].includes(user.designation)
  const isEmployee = user.designation === "employee"

  return (
    <div className="grid gap-6">
      {isTeamLead && (
        <>
          <PerformanceReport />
          <TaskStatusReport />
          <ResourceUtilization />
        </>
      )}

      {isEmployee && (
        <>
          <MyTaskReport />
          <MyHoursReport />
          <MyProgressChart />
        </>
      )}
    </div>
  )
}
