
// 'use client';

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllProjects } from '@/store/features/fetchallProjectsSlice';
// import { useRouter } from 'next/navigation';
// import {
//   FiPaperclip,
//   FiUser,
//   FiCheckCircle,
//   FiClock,
//   FiAlertCircle,
//   FiEye,
//   FiPlus,
//   FiSearch,
//   FiFilter,
//   FiChevronDown,
//   FiArrowUp,
//   FiArrowDown,
//   FiX,
// } from 'react-icons/fi';
// import { Briefcase } from 'lucide-react';
// // Import Card and its parts as a single import
// import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

// // Import other components separately
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'; // Use the provided DropdownMenu components

// const statusColors = {
//   Planned: 'bg-amber-100 text-amber-800 border-amber-200',
//   'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
//   Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
// };

// const statusIcons = {
//   Planned: <FiClock className="inline-block mr-1" />,
//   'In Progress': <FiAlertCircle className="inline-block mr-1" />,
//   Completed: <FiCheckCircle className="inline-block mr-1" />,
// };

// const progressColors = {
//   Planned: 'bg-amber-400',
//   'In Progress': 'bg-blue-400',
//   Completed: 'bg-emerald-400',
// };

// export default function FetchAllProjects() {
//   const dispatch = useDispatch();
//   const { projects, status, error } = useSelector((state) => state.fetchallProjects);
//   const router = useRouter();
// console.log(projects)
//   // State for filters and sorting
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [sortField, setSortField] = useState('projectName');
//   const [sortDirection, setSortDirection] = useState('asc');

//   useEffect(() => {
//     dispatch(fetchAllProjects());
//   }, [dispatch]);

//   // Calculate project statistics
//   const projectStats = projects
//     ? {
//         total: projects.length,
//         planned: projects.filter((p) => p.status === 'Planned').length,
//         inProgress: projects.filter((p) => p.status === 'In Progress').length,
//         completed: projects.filter((p) => p.status === 'Completed').length,
//       }
//     : { total: 0, planned: 0, inProgress: 0, completed: 0 };

//   // Filter and sort projects
//   const filteredAndSortedProjects = () => {
//     if (!projects) return [];

//     let filtered = projects;

//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter((project) => project.status === selectedStatus);
//     }

//     if (searchTerm.trim() !== '') {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (project) =>
//           project.projectName?.toLowerCase().includes(term) ||
//           project.teamLeadName?.toLowerCase().includes(term) ||
//           project.projectId?.toString().includes(term)
//       );
//     }

//     return [...filtered].sort((a, b) => {
//       const fieldA = a[sortField] || '';
//       const fieldB = b[sortField] || '';

//       if (sortDirection === 'asc') {
//         return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
//       } else {
//         return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
//       }
//     });
//   };

//   const sortedProjects = filteredAndSortedProjects();

//   const handleViewProject = (projectId) => {
//     router.push(`/project/${projectId}`);
//   };

//   const handleOnboarding = () => {
//     router.push('/project/onboarding');
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const handleStatusFilter = (status) => {
//     setSelectedStatus(status);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedStatus('all');
//     setSortField('projectName');
//     setSortDirection('asc');
//   };

//   if (status === 'loading') {
//     return (
//       <div className="container mx-auto  flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-primary mx-auto mb-6"></div>
//           <p className="text-muted-foreground font-medium text-lg">Loading your projects...</p>
//         </div>
//       </div>
//     );
//   }

//   // if (status === 'failed') {
//   //   return (
//   //     <div className="container mx-auto ">
//   //       <Card className="bg-destructive/10 border-destructive/20 text-destructive p-6  mx-auto">
//   //         <CardHeader>
//   //           <h3 className="text-lg font-semibold">Unable to load projects</h3>
//   //         </CardHeader>
//   //         <CardContent>
//   //           <p>{error || 'We encountered an issue while loading your projects. Please try again.'}</p>
//   //         </CardContent>
//   //         <CardFooter>
//   //           <Button
//   //             variant="outline"
//   //             onClick={() => dispatch(fetchAllProjects())}
//   //             className="flex items-center gap-2"
//   //           >
//   //             <svg
//   //               className="w-4 h-4"
//   //               fill="none"
//   //               stroke="currentColor"
//   //               viewBox="0 0 24 24"
//   //               xmlns="http://www.w3.org/2000/svg"
//   //             >
//   //               <path
//   //                 strokeLinecap="round"
//   //                 strokeLinejoin="round"
//   //                 strokeWidth="2"
//   //                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//   //               ></path>
//   //             </svg>
//   //             Retry
//   //           </Button>
//   //         </CardFooter>
//   //       </Card>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className=" mx-auto  min-h-screen">
//       {/*  Header */}
//       <div className="text-green-700 border-b border-border">
//         <div className="  mx-auto  py-4">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-3 ">
//               <Briefcase className="w-8 h-8  text-green-700" />
//               <h1 className="text-2xl sm:text-3xl font-bold text-green-700">All Projects</h1>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
//               {/* Search Input */}
//               <div className="relative w-full sm:w-64 md:w-80">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search projects..."
//                   className="pl-10"
//                 />
//                 {searchTerm && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                   >
//                     <FiX className="h-5 w-5" />
//                   </Button>
//                 )}
//               </div>

//               {/* Filter Dropdown */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="flex items-center gap-2">
//                     <FiFilter />
//                     <span className="hidden sm:inline">Filter</span>
//                     <FiChevronDown />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-64">
//                   <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//                   <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
//                     <div className="flex justify-between w-full">
//                       <span>All Projects</span>
//                       <Badge variant="secondary">{projectStats.total}</Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleStatusFilter('Planned')}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <FiClock className="mr-1.5 text-amber-500" />
//                         Planned
//                       </div>
//                       <Badge variant="secondary">{projectStats.planned}</Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleStatusFilter('In Progress')}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <FiAlertCircle className="mr-1.5 text-blue-500" />
//                         In Progress
//                       </div>
//                       <Badge variant="secondary">{projectStats.inProgress}</Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleStatusFilter('Completed')}>
//                     <div className="flex justify-between w-full">
//                       <div className="flex items-center">
//                         <FiCheckCircle className="mr-1.5 text-emerald-500" />
//                         Completed
//                       </div>
//                       <Badge variant="secondary">{projectStats.completed}</Badge>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//                   <DropdownMenuItem onClick={() => handleSort('projectName')}>
//                     <div className="flex justify-between w-full">
//                       <span>Project Name</span>
//                       {sortField === 'projectName' &&
//                         (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleSort('projectId')}>
//                     <div className="flex justify-between w-full">
//                       <span>Project ID</span>
//                       {sortField === 'projectId' &&
//                         (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleSort('status')}>
//                     <div className="flex justify-between w-full">
//                       <span>Status</span>
//                       {sortField === 'status' &&
//                         (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={clearFilters} className="justify-center">
//                     Clear All Filters
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Create Button */}
//               <Button onClick={handleOnboarding} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white">
//                 <FiPlus />
//                 <span className="hidden sm:inline">Create</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Projects Grid */}
//       {sortedProjects.length === 0 ? (
//         <Card className="mt-8 text-center">
//           <CardContent className="pt-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
//               <FiPaperclip className="text-3xl" />
//             </div>
//             <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
//             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//               {selectedStatus === 'all' && !searchTerm
//                 ? "You haven't created any projects yet. Get started by creating your first project."
//                 : 'No projects match your current filters. Try adjusting your search or filter criteria.'}
//             </p>
//             {selectedStatus !== 'all' || searchTerm ? (
//               <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 mx-auto">
//                 <FiX />
//                 Clear Filters
//               </Button>
//             ) : (
//               <Button onClick={handleOnboarding} className="flex items-center gap-2 mx-auto">
//                 <FiPlus />
//                 Create New Project
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
//           {sortedProjects.map((project) => (
//             <Card
//               key={project.projectId}
//               className="group relative hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => handleViewProject(project.projectId)}
//             >
//               <div className={`absolute top-0 left-0 w-full h-1 ${progressColors[project.status]}`} />
//               <CardContent className="pt-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge className={`${statusColors[project.status]} border`}>
//                     {statusIcons[project.status]}
//                     {project.status}
//                   </Badge>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="hover:bg-muted rounded-full"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleViewProject(project.projectId);
//                     }}
//                   >
//                     <FiEye className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
//                   </Button>
//                 </div>

//                 <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary line-clamp-2">
//                   {project.projectName}
//                 </h3>

//                 <div className="space-y-3">
//                   <div className="flex items-center text-muted-foreground group-hover:text-foreground">
//                     <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/10">
//                       <Briefcase className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
//                     </div>
//                     <span className="text-sm font-medium">ID: {project.projectId}</span>
//                   </div>

//                   <div className="flex items-center text-muted-foreground group-hover:text-foreground">
//                     <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/10">
//                       <FiUser className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
//                     </div>
//                     <span className="text-sm font-medium">{project.teamLeadName || 'Unassigned'}</span>
//                   </div>

//                   <div className="pt-4 border-t border-border">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-xs font-medium text-muted-foreground">Progress</span>
//                       <span className="text-xs font-bold text-foreground">
//                         {project.status === 'Completed' ? '100%' : project.status === 'In Progress' ? '60%' : '0%'}
//                       </span>
//                     </div>
//                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
//                       <div
//                         className={`h-full ${progressColors[project.status]}`}
//                         style={{
//                           width: project.status === 'Completed' ? '100%' : project.status === 'In Progress' ? '60%' : '0%',
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="border-t border-border">
//                 <Button
//                   variant="link"
//                   className="w-full justify-between text-primary text-sm font-medium group-hover:text-primary-dark"
//                   onClick={() => handleViewProject(project.projectId)}
//                 >
//                   View Project Details
//                   <FiChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProjects, clearProjects } from '@/store/features/projectSlice'; // Corrected import
import { useRouter } from 'next/navigation';
import {
  FiPaperclip,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiX,
} from 'react-icons/fi';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const statusColors = {
  Planned: 'bg-amber-100 text-amber-800 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const statusIcons = {
  Planned: <FiClock className="inline-block mr-1" />,
  'In Progress': <FiAlertCircle className="inline-block mr-1" />,
  Completed: <FiCheckCircle className="inline-block mr-1" />,
};

const progressColors = {
  Planned: 'bg-amber-400',
  'In Progress': 'bg-blue-400',
  Completed: 'bg-emerald-400',
};

export default function FetchAllProjects() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { projects, status, error } = useSelector((state) => state.project); // Corrected selector

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('projectName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (status.fetchAllProjects === 'idle') {
      dispatch(fetchAllProjects());
    }
    return () => {
      dispatch(clearProjects()); // Clean up on unmount
    };
  }, [dispatch, fetchAllProjects]);

  // Calculate project statistics
  const projectStats = projects
    ? {
        total: projects.length,
        planned: projects.filter((p) => p.status === 'Planned').length,
        inProgress: projects.filter((p) => p.status === 'In Progress').length,
        completed: projects.filter((p) => p.status === 'Completed').length,
      }
    : { total: 0, planned: 0, inProgress: 0, completed: 0 };

  // Filter and sort projects
  const filteredAndSortedProjects = () => {
    if (!Array.isArray(projects)) return []; // Early check for null/undefined

    let filtered = projects;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((project) => project.status === selectedStatus);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          (project.projectName?.toLowerCase()?.includes(term) || false) ||
          (project.teamLeadName?.toLowerCase()?.includes(term) || false) ||
          (project.projectId?.toString()?.includes(term) || false)
      );
    }

    return [...filtered].sort((a, b) => {
      const fieldA = (a[sortField] || '').toString().toLowerCase();
      const fieldB = (b[sortField] || '').toString().toLowerCase();

      if (sortDirection === 'asc') {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
      }
    });
  };

  const sortedProjects = filteredAndSortedProjects();

  const handleViewProject = (projectId) => {
    router.push(`/project/${projectId}`);
  };

  const handleOnboarding = () => {
    router.push('/project/onboarding');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSortField('projectName');
    setSortDirection('asc');
  };

  if (status.fetchAllProjects === 'loading') {
    return (
      <div className="container mx-auto flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground font-medium text-lg">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (status.fetchAllProjects === 'failed') {
    return (
      <div className="container mx-auto">
        <Card className="bg-destructive/10 border-destructive/20 text-destructive1 p-6 mx-auto">
          <CardHeader>
            <h3 className="text-lg font-semibold">Unable to load projects</h3>
          </CardHeader>
          <CardContent>
            <p>{error.fetchAllProjects || 'We encountered an issue while loading your projects. Please try again.'}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => dispatch(fetchAllProjects())}
              className="flex items-center gap-2"
              aria-label="Retry loading projects"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen">
      {/* Header */}
      <div className="text-green-700 border-b border-border">
        <div className="mx-auto py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-green-700" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-700">All Projects</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-64 md:w-80">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10"
                  aria-label="Search projects"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <FiX className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2" aria-label="Filter and sort projects">
                    <FiFilter aria-hidden="true" />
                    <span className="hidden sm:inline">Filter</span>
                    <FiChevronDown aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Projects</span>
                      <Badge variant="secondary">{projectStats.total}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Planned')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 text-amber-500" aria-hidden="true" />
                        Planned
                      </div>
                      <Badge variant="secondary">{projectStats.planned}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('In Progress')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiAlertCircle className="mr-1.5 text-blue-500" aria-hidden="true" />
                        In Progress
                      </div>
                      <Badge variant="secondary">{projectStats.inProgress}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Completed')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiCheckCircle className="mr-1.5 text-emerald-500" aria-hidden="true" />
                        Completed
                      </div>
                      <Badge variant="secondary">{projectStats.completed}</Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleSort('projectName')}>
                    <div className="flex justify-between w-full">
                      <span>Project Name</span>
                      {sortField === 'projectName' &&
                        (sortDirection === 'asc' ? (
                          <FiArrowUp className="ml-2" aria-hidden="true" />
                        ) : (
                          <FiArrowDown className="ml-2" aria-hidden="true" />
                        ))}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('projectId')}>
                    <div className="flex justify-between w-full">
                      <span>Project ID</span>
                      {sortField === 'projectId' &&
                        (sortDirection === 'asc' ? (
                          <FiArrowUp className="ml-2" aria-hidden="true" />
                        ) : (
                          <FiArrowDown className="ml-2" aria-hidden="true" />
                        ))}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    <div className="flex justify-between w-full">
                      <span>Status</span>
                      {sortField === 'status' &&
                        (sortDirection === 'asc' ? (
                          <FiArrowUp className="ml-2" aria-hidden="true" />
                        ) : (
                          <FiArrowDown className="ml-2" aria-hidden="true" />
                        ))}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="justify-center">
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create Button */}
              <Button
                onClick={handleOnboarding}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white"
                aria-label="Create new project"
              >
                <FiPlus aria-hidden="true" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <Card className="mt-8 text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <FiPaperclip className="text-3xl" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {selectedStatus === 'all' && !searchTerm
                ? "You haven't created any projects yet. Get started by creating your first project."
                : 'No projects match your current filters. Try adjusting your search or filter criteria.'}
            </p>
            <Button
              onClick={selectedStatus !== 'all' || searchTerm ? clearFilters : handleOnboarding}
              className="flex items-center gap-2 mx-auto"
              aria-label={selectedStatus !== 'all' || searchTerm ? 'Clear filters' : 'Create new project'}
            >
              {selectedStatus !== 'all' || searchTerm ? <FiX aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
              {selectedStatus !== 'all' || searchTerm ? 'Clear Filters' : 'Create New Project'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {sortedProjects.map((project) => (
            <Card
              key={project.projectId}
              className="group relative hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewProject(project.projectId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleViewProject(project.projectId)}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${progressColors[project.status]}`} />
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`${statusColors[project.status]} border`}>
                    {statusIcons[project.status]}
                    {project.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project.projectId);
                    }}
                    aria-label={`View project ${project.projectName}`}
                  >
                    <FiEye className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </Button>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary line-clamp-2">
                  {project.projectName || 'Unnamed Project'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center text-muted-foreground group-hover:text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/10">
                      <Briefcase className="w-4 h-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">ID: {project.projectId}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground group-hover:text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 group-hover:bg-primary/10">
                      <FiUser className="w-4 h-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">{project.teamLeadName || 'Unassigned'}</span>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Progress</span>
                      <span className="text-xs font-bold text-foreground">
                        {project.progress
                          ? `${project.progress}%`
                          : project.status === 'Completed'
                          ? '100%'
                          : project.status === 'In Progress'
                          ? '60%'
                          : '0%'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${progressColors[project.status]}`}
                        style={{
                          width: project.progress
                            ? `${project.progress}%`
                            : project.status === 'Completed'
                            ? '100%'
                            : project.status === 'In Progress'
                            ? '60%'
                            : '0%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border">
                <Button
                  variant="link"
                  className="w-full justify-between text-primary text-sm font-medium group-hover:text-primary-dark"
                  onClick={() => handleViewProject(project.projectId)}
                  aria-label={`View details for project ${project.projectName}`}
                >
                  View Project Details
                  <FiChevronDown
                    className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}