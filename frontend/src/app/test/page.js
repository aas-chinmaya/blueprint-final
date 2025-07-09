// 'use client'

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTeamsByEmployeeId } from '@/store/features/in-project/teamSlice';

// export default function MyTeams({ employeeId="AAS-IA-004-25" }) {
//   const dispatch = useDispatch();

//   const { teamsByEmployee, status, error } = useSelector((state) => state.team);

//   useEffect(() => {
//     if (employeeId) {
//       dispatch(fetchTeamsByEmployeeId(employeeId));
//     }
//   }, [dispatch, employeeId]);

//   if (status === 'loading') return <p>Loading teams...</p>;
//   if (status === 'failed') return <p>Error: {error}</p>;


// console.log('Teams by Employee:', teamsByEmployee);
//   return (
//     <div className="p-4">
      
//     </div>
//   );
// }





// 'use client'

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProjectsByEmployeeId } from '@/store/features/in-project/projectSlice';

// export default function MyProjects({ employeeId="AAS-IA-004-25" }) {
//   const dispatch = useDispatch();
 

//   const {
//     employeeProjects,
//     status,
//     error,
//   } = useSelector((state) => state.project);

//   useEffect(() => {
//     if (employeeId) {
//       dispatch(fetchProjectsByEmployeeId(employeeId));
//     }
//   }, [dispatch, employeeId]);

//   if (status.fetchEmployeeProjects === 'loading') return <p>Loading projects...</p>;
//   if (status.fetchEmployeeProjects === 'failed') return <p>Error: {error.fetchEmployeeProjects}</p>;
// console.log('Projects by Employee:', employeeProjects);
//   return (
//     <div className="p-4">
     
//     </div>
//   );
// }




'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTaskByEmployeeId,
  selectAllTaskListByEmployeeId,
  selectTaskStatus,
  selectTaskError,
} from '@/store/features/in-project/TaskSlice';

export default function TaskByEmployee({ employeeId = "AAS-IA-08-25" }) {
  const dispatch = useDispatch();

  const tasks = useSelector(selectAllTaskListByEmployeeId);
  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);

  useEffect(() => {
    if (employeeId) {
      dispatch(getAllTaskByEmployeeId(employeeId));
    }
  }, [dispatch, employeeId]);

  if (status === 'loading') return <p>Loading tasks...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
console.log('Tasks by Employee:', tasks);
  return (
    <div className="p-4">
      
    </div>
  );
}
