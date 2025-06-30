"use client"

import { useSelector } from "react-redux"
import { useMemo } from "react"

export function useUserCheck() {
  const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {}

  const currentUser = useMemo(() => {
    const role = employeeData?.designation?.toLowerCase()
    return {
      role,
      name: employeeData?.name || "Unknown",
      teamLeadId: employeeData?.teamLeadId || null,
      id: employeeData?.employeeId || null,
      email: employeeData?.email || userData?.email || null,
      isCpc: role === "cpc",
      isEmployee: role === "employee",
      isTeamLead: role === "team_lead" || role === "lead",
    }
  }, [employeeData, userData])

  return { currentUser, userLoading }
}




//sample uses

// "use client"

// import CpcTaskList from './CpcTaskList'
// import EmployeeTaskList from './EmployeeTaskList'
// import { useUserCheck } from "@/hooks/use-user-check"

// export default function AllTaskListByRole() {
//   const { currentUser, userLoading } = useUserCheck()

//   if (userLoading) return <div>Loading...</div>

//   return (
//     <div>
//       {currentUser.isCpc ? (
//         <CpcTaskList currentUser={currentUser} />
//       ) : (
//         <EmployeeTaskList currentUser={currentUser} />
//       )}
//     </div>
//   )
// }
