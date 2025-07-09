'use client';

import {
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTaskByEmployeeId,
  selectAllTaskListByEmployeeId,
} from "@/store/features/in-project/TaskSlice";
import {
  fetchProjectsByEmployeeId,
} from "@/store/features/in-project/projectSlice";
import { fetchTeamsByEmployeeId } from "@/store/features/in-project/teamSlice";
import { fetchBugByEmployeeId } from "@/store/features/in-project/bugSlice";

const CardSkeleton = () => (
  <Card className="@container/card animate-pulse">
    <CardHeader>
      <CardDescription><span className="inline-block h-4 w-50 bg-muted rounded" /></CardDescription>
      <CardTitle className="text-2xl font-semibold"><span className="inline-block h-8 w-16 bg-muted rounded" /></CardTitle>
      <CardAction><span className="inline-block h-6 w-16 bg-muted rounded-full" /></CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium"><span className="inline-block h-4 w-32 bg-muted rounded" /></div>
      <div className="text-muted-foreground"><span className="inline-block h-4 w-40 bg-muted rounded" /></div>
    </CardFooter>
  </Card>
);

export function SectionCardEmployee({ employeeId }) {
  const dispatch = useDispatch();
  const { teamsByEmployee, status, error } = useSelector((state) => state.team);
  const tasks = useSelector(selectAllTaskListByEmployeeId);
  const isTasksLoading = status.fetchAllTaskByEmployeeId === 'loading';
  const {employeeProjects} = useSelector((state) => state.project);
  const isProjectsLoading = status.fetchEmployeeProjects === 'loading';
  // const bugs = useSelector((state) => state.bugs.selectBugsByEmployeeId);
  // const isBugLoading = status.bugs.loading.selectBugLoadingByEmployeeId  === 'loading';
const bugs = useSelector((state) => state.bugs.bugsByEmployeeId);
const isBugLoading = useSelector((state) => state.bugs.loading.bugsByEmployeeId);
// console.log("bugs",employeeProjects, bugs,teamsByEmployee);  
  
   useEffect(() => {
     if (employeeId) {
       dispatch(fetchTeamsByEmployeeId(employeeId));
      dispatch(fetchProjectsByEmployeeId(employeeId));
      dispatch(getAllTaskByEmployeeId(employeeId));
      dispatch(fetchBugByEmployeeId(employeeId));


     }
   }, [dispatch, employeeId]);
 

  const ProjectsCard = useMemo(() => (
    isProjectsLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects I Worked</CardDescription>
          <CardTitle className="text-2xl font-semibold">{employeeProjects.length}</CardTitle>
          <CardAction><Badge variant="outline"><IconTrendingUp /> +12.5%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Trending up this month <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
    )
  ), []);

  const TasksCard = useMemo(() => (
    isTasksLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>My Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold">{tasks.length}</CardTitle>
          <CardAction><Badge variant="outline"><IconTrendingUp /> +12.5%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Strong user retention <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
    )
  ), []);
  
  const BugCard = useMemo(() => (
    isBugLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Bug Found</CardDescription>
          <CardTitle className="text-2xl font-semibold">{bugs.length}</CardTitle>
          <CardAction><Badge variant="outline"><IconTrendingUp /> +12.5%</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Strong user retention <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
    )
  ), []);

  const GrowthCard = useMemo(() => (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Growth Rate</CardDescription>
        <CardTitle className="text-2xl font-semibold">4.5%</CardTitle>
        <CardAction><Badge variant="outline"><IconTrendingUp /> +4.5%</Badge></CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium">Steady performance increase <IconTrendingUp className="size-4" /></div>
        <div className="text-muted-foreground">Meets growth projections</div>
      </CardFooter>
    </Card>
  ), []);



  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {ProjectsCard}
      {TasksCard}
      {BugCard}
      {GrowthCard}
    </div>
  );
}
