




import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
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
  getAllTaskByEmployeeId ,
} from "@/store/features/TaskSlice";
import { fetchClients, fetchAllProjects, fetchProjectsByEmployeeId } from "@/store/features/projectSlice";

// Skeleton Component for Cards
const CardSkeleton = () => (
  <Card className="@container/card animate-pulse">
    <CardHeader>
      <CardDescription>
        <span className="inline-block h-4 w-50 bg-muted rounded"></span>
      </CardDescription>

      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        <span className="inline-block h-8 w-16 bg-muted rounded"></span>
      </CardTitle>
      <CardAction>
        <span className="inline-block h-6 w-16 bg-muted rounded-full"></span>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        <span className="inline-block h-4 w-32 bg-muted rounded"></span>
      </div>
      <div className="text-muted-foreground">
        <span className="inline-block h-4 w-40 bg-muted rounded"></span>
      </div>
    </CardFooter>
  </Card>
);

export function SectionCards() {
  const dispatch = useDispatch();
  const { userData, employeeData, loading: userLoading } = useSelector((state) => state.user) || {};

  // Local state to track which cards are loaded
  const [loadedCards, setLoadedCards] = useState({
    projects: false,
    clients: false,
    tasks: false,
    growth: true, // Static card, always loaded
  });

  const { projects, status, error } = useSelector((state) => state.project);

  const { clients, status: clientsStatus, error: onboardingError } = useSelector((state) => state.project);

  const { allTaskList, status: taskStatus } = useSelector((state) => state.task);

  // Memoize current user to prevent unnecessary re-renders
  const currentUser = useMemo(
    () => ({
      role: employeeData?.designation,
      name: employeeData?.name,
    }),
    [employeeData?.designation, employeeData?.name]
  );

  // Memoize data counts to prevent recalculation
  const counts = useMemo(
    () => ({
      projects: projects?.length || 0,
      clients: Array.isArray(clients) ? clients.length : 0,
      tasks: allTaskList?.length || 0,
    }),
    [projects?.length, clients, allTaskList?.length]
  );

  // Optimized data fetching with priority for clients
  const fetchAllData = useCallback(
    async () => {
      try {
        const promises = [];

        // Priority fetch for clients
        if (clientsStatus === "idle" || !clients || (Array.isArray(clients) && clients.length === 0)) {
          promises.push(
            dispatch(fetchClients()).unwrap().catch((err) => {
              console.error("Clients fetch error:", err);
              return [];
            })
          );
        }

        // Other API calls
        if (status === "idle" || !projects) {
          promises.push(
            dispatch(fetchAllProjects()).unwrap().catch((err) => {
              console.error("Projects fetch error:", err);
              return [];
            })
          );
        }
        if (taskStatus === "idle" || !allTaskList) {
          promises.push(
            dispatch(getAllTaskList()).unwrap().catch((err) => {
              console.error("Tasks fetch error:", err);
              return [];
            })
          );
        }

        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [dispatch, status, taskStatus, projects, allTaskList, clients, clientsStatus]
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Update loaded state when data arrives
  useEffect(() => {
    setLoadedCards((prev) => ({
      ...prev,
      projects:  projects !== null,
      clients: clientsStatus === "succeeded" && clients !== null,
      tasks: taskStatus === "succeeded" && allTaskList !== null,
    }));
  }, [status, clientsStatus, taskStatus, projects, clients, allTaskList]);

  // Optimized loading states with fallbacks
  const isProjectsLoading = status === "loading" || !loadedCards.projects;
  const isTasksLoading = taskStatus === "loading" || !loadedCards.tasks;

  // Enhanced clients loading with timeout fallback
  const isClientsLoading = useMemo(
    () => {
      if (clients && Array.isArray(clients) && clients.length > 0) {
        return false;
      }
      return clientsStatus === "loading" || !loadedCards.clients;
    },
    [clientsStatus, loadedCards.clients, clients]
  );

  // Individual card components to reduce re-renders
  const ProjectsCard = useMemo(
    () =>
      isProjectsLoading ? (
        <CardSkeleton />
      ) : (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Project</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {counts.projects}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Visitors for the last 6 months</div>
          </CardFooter>
        </Card>
      ),
    [isProjectsLoading, counts.projects]
  );

  const ClientsCard = useMemo(() => {
    const clientCount = Array.isArray(clients) ? clients.length : 0;
    const hasClientsData = clients !== null && clients !== undefined;

    return isClientsLoading && !hasClientsData ? (
      <CardSkeleton />
    ) : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Client's</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {clientCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {clientsStatus === "loading" ? "Loading..." : "Down 20% this period"}{" "}
            <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {clientsStatus === "loading" ? "Fetching latest data" : "Acquisition needs attention"}
          </div>
        </CardFooter>
      </Card>
    );
  }, [isClientsLoading, clients, clientsStatus]);

  const TasksCard = useMemo(
    () =>
      isTasksLoading ? (
        <CardSkeleton />
      ) : (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Tasks</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {counts.tasks}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong user retention <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Engagement exceed targets</div>
          </CardFooter>
        </Card>
      ),
    [isTasksLoading, counts.tasks]
  );

  const GrowthCard = useMemo(
    () => (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    ),
    []
  );

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {ProjectsCard}
      {ClientsCard}
      {TasksCard}
      {GrowthCard}
    </div>
  );
}

export function SectionCardEmployee() {
  const dispatch = useDispatch();
  const { userData, employeeData, loading: userLoading } = useSelector((state) => state.user) || {};

  // Local state to track which cards are loaded
  const [loadedCards, setLoadedCards] = useState({
    projects: false,
    tasks: false,
    growth: true, // Static card, always loaded
  });

  const { employeeProjects, status: projectStatus, error: projectError } = useSelector(
    (state) => state.project
  );

  const { employeeTasks, status: taskStatus } = useSelector((state) => state.task);

  // Memoize current user to prevent unnecessary re-renders
  const currentUser = useMemo(
    () => ({
      role: employeeData?.designation,
      name: employeeData?.name,
      employeeId: employeeData?.employeeID,
    }),
    [employeeData?.designation, employeeData?.name, employeeData?.employeeID]
  );

  const employeeId = currentUser.employeeId;

  // Memoize data counts to prevent recalculation
  const counts = useMemo(
    () => ({
      employeeProjects: employeeProjects?.length || 0,
      tasks: employeeTasks?.length || 0,
    }),
    [employeeProjects?.length, employeeTasks?.length]
  );

  

  // Optimized data fetching
  const fetchAllData = useCallback(
    async () => {
      try {
        const promises = [];

        // Fetch projects by employee ID
        if (projectStatus === "idle" || !employeeProjects) {
          if (employeeId) {
            promises.push(
              dispatch(fetchProjectsByEmployeeId(employeeId)).unwrap().catch((err) => {
                console.error("Projects fetch error:", err);
                return [];
              })
            );
          }
        }

        // Fetch tasks by employee ID
        if (taskStatus === "idle" || !employeeTasks) {
          if (employeeId) {
            promises.push(
              dispatch(getAllTaskByEmployeeId(employeeId)).unwrap().catch((err) => {
                console.error("Tasks fetch error:", err);
                return [];
              })
            );
          }
        }

        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [dispatch, projectStatus, taskStatus, employeeProjects, employeeTasks, employeeId]
  );

  useEffect(() => {
    if (employeeId) {
      fetchAllData();
    }
  }, [fetchAllData, employeeId]);

  // Update loaded state when data arrives
  useEffect(() => {
    setLoadedCards((prev) => ({
      ...prev,
      projects: projectStatus === "succeeded" && employeeProjects !== null,
      tasks: taskStatus === "succeeded" && employeeTasks !== null,
    }));
  }, [projectStatus, taskStatus, employeeProjects, employeeTasks]);

  // Optimized loading states with fallbacks
  const isProjectsLoading = projectStatus === "loading" || !loadedCards.projects;
  const isTasksLoading = taskStatus === "loading" || !loadedCards.tasks;

  // Individual card components to reduce re-renders
  const ProjectsCards = useMemo(
    () =>
      isProjectsLoading ? (
        <CardSkeleton />
      ) : (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Project I Worked</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {counts.employeeProjects}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Visitors for the last 6 months</div>
          </CardFooter>
        </Card>
      ),
    [isProjectsLoading, counts.employeeProjects]
  );

  const TasksCards = useMemo(
    () =>
      isTasksLoading ? (
        <CardSkeleton />
      ) : (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>My Tasks</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {counts.tasks}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong user retention <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Engagement exceed targets</div>
          </CardFooter>
        </Card>
      ),
    [isTasksLoading, counts.tasks]
  );

  const GrowthCards = useMemo(
    () => (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    ),
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
      {ProjectsCards}
      {TasksCards}
      {GrowthCards}
    </div>
  );
}