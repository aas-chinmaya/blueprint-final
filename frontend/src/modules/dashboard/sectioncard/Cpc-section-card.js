


'use client';

import {
  IconTrendingDown,
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
  getAllTaskList,
} from "@/store/features/in-project/TaskSlice";
import {
  fetchAllProjects,
} from "@/store/features/in-project/projectSlice";
import {
  fetchClients,
} from "@/store/features/pre-project/clientSlice";
import { useCountUp } from "@/hooks/useCountUp"; // Make sure path is correct

// Skeleton Loader
const CardSkeleton = () => (
  <Card className="@container/card animate-pulse">
    <CardHeader>
      <CardDescription>
        <span className="inline-block h-4 w-50 bg-muted rounded" />
      </CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        <span className="inline-block h-8 w-16 bg-muted rounded" />
      </CardTitle>
      <CardAction>
        <span className="inline-block h-6 w-16 bg-muted rounded-full" />
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        <span className="inline-block h-4 w-32 bg-muted rounded" />
      </div>
      <div className="text-muted-foreground">
        <span className="inline-block h-4 w-40 bg-muted rounded" />
      </div>
    </CardFooter>
  </Card>
);

export function SectionCardCPC() {
  const dispatch = useDispatch();
  const [loadedCards, setLoadedCards] = useState({
    projects: false,
    clients: false,
    tasks: false,
    growth: true,
  });

  // Selectors
  const { projects, status: projectStatus } = useSelector((state) => state.project);
  const { allTaskList, status: taskStatus } = useSelector((state) => state.task);
  const {
    clients,
    fetchClientsLoading,
  } = useSelector((state) => state.client);

  const clientsStatus = fetchClientsLoading
    ? "loading"
    : clients?.length
    ? "succeeded"
    : "idle";

  const counts = useMemo(() => ({
    projects: projects?.length || 0,
    clients: Array.isArray(clients) ? clients.length : 0,
    tasks: allTaskList?.length || 0,
  }), [projects, clients, allTaskList]);

  const fetchAllData = useCallback(() => {
    const promises = [];

    if (clientsStatus === "idle" || !clients?.length) {
      promises.push(dispatch(fetchClients()).unwrap().catch(() => []));
    }
    if (projectStatus === "idle" || !projects?.length) {
      promises.push(dispatch(fetchAllProjects()).unwrap().catch(() => []));
    }
    if (taskStatus === "idle" || !allTaskList?.length) {
      promises.push(dispatch(getAllTaskList()).unwrap().catch(() => []));
    }

    Promise.allSettled(promises).catch(console.error);
  }, [dispatch, clientsStatus, projectStatus, taskStatus, clients, projects, allTaskList]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setLoadedCards((prev) => ({
      ...prev,
      projects: projects !== null,
      clients: !fetchClientsLoading && clients !== null,
      tasks: taskStatus === "succeeded" && allTaskList !== null,
    }));
  }, [projectStatus, fetchClientsLoading, taskStatus, projects, clients, allTaskList]);

  const isProjectsLoading = projectStatus === "loading" || !loadedCards.projects;
  const isClientsLoading = fetchClientsLoading || !loadedCards.clients;
  const isTasksLoading = taskStatus === "loading" || !loadedCards.tasks;

  // Animated Counts
  const animatedProjects = useCountUp(counts.projects);
  const animatedClients = useCountUp(counts.clients);
  const animatedTasks = useCountUp(counts.tasks);

  const ProjectsCard = useMemo(() => (
    isProjectsLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold">{animatedProjects}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> +12.5%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Trending up this month <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
    )
  ), [isProjectsLoading, animatedProjects]);

  const ClientsCard = useMemo(() => (
    isClientsLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold">{animatedClients}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingDown /> -20%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Down 20% this period <IconTrendingDown className="size-4" /></div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
    )
  ), [isClientsLoading, animatedClients]);

  const TasksCard = useMemo(() => (
    isTasksLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold">{animatedTasks}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> +12.5%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Strong user retention <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Engagement exceeds targets</div>
        </CardFooter>
      </Card>
    )
  ), [isTasksLoading, animatedTasks]);

  const GrowthCard = useMemo(() => (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Growth Rate</CardDescription>
        <CardTitle className="text-2xl font-semibold">4.5%</CardTitle>
        <CardAction>
          <Badge variant="outline"><IconTrendingUp /> +4.5%</Badge>
        </CardAction>
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
      {ClientsCard}
      {TasksCard}
      {GrowthCard}
    </div>
  );
}
