// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { fetchAllProjects } from '@/store/features/in-project/projectSlice';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Eye } from 'lucide-react';
// import Pagination from '@/components/ui/Pagination';

// export default function AllBugList() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const projects = useSelector((state) => state.project.projects);
//   const fetchStatus = useSelector((state) => state.project.status.fetchAllProjects);
//   const error = useSelector((state) => state.project.error.fetchAllProjects);
//   const [currentPage, setCurrentPage] = useState(1);
//   const projectsPerPage = 5;

//   useEffect(() => {
//     if (fetchStatus === 'idle') {
//       dispatch(fetchAllProjects());
//     }
//   }, [dispatch, fetchStatus]);
//   const indexOfLastProject = currentPage * projectsPerPage;
//   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
//   const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
//   const totalPages = Math.ceil(projects.length / projectsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   if (fetchStatus === 'loading') {
//     return <div className="text-center py-8 text-blue-800">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center py-8">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold text-blue-800 mb-6">Bug Reports</h1>
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-blue-800">Project Name</TableHead>
//                 <TableHead className="text-blue-800">teamLeadName</TableHead>
//                 <TableHead className="text-blue-800">category
// </TableHead>
//                 <TableHead className="text-blue-800">Status</TableHead>
//                 <TableHead className="text-blue-800">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {currentProjects.map((project) => (
//                 <TableRow key={project.projectId}>
//                   <TableCell className="font-medium">{project.projectName || 'N/A'}</TableCell>
//                   <TableCell>{project.teamLeadName|| 'N/A'}</TableCell>
//                   <TableCell>{project.category
//  || 'N/A'}</TableCell>
//                   <TableCell>{project.status || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => router.push(`/bug/projectId/?projectId=${project.projectId}`)}

//                       // onClick={() => router.push(`/bug/${project.projectId}`)}
//                     >
//                       <Eye className="h-5 w-5 text-blue-600" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//       </div>
//     </div>
//   );
// }










'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchAllProjects } from '@/store/features/in-project/projectSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ChevronDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { FiX } from 'react-icons/fi';
import Pagination from '@/components/ui/Pagination';
import { toast } from '@/components/ui/sonner';

export default function AllBugList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => state.project.projects);
  const fetchStatus = useSelector((state) => state.project.status.fetchAllProjects);
  const error = useSelector((state) => state.project.error.fetchAllProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('projectName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchAllProjects()).then((result) => {
        if (result.error) {
          toast.error(`Failed to fetch projects: ${result.error.message}`);
        }
      });
    }
  }, [dispatch, fetchStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedCategory, sortField, sortDirection]);

  // Calculate project statistics
  const projectStats = {
    total: projects?.length || 0,
    open: projects?.filter((project) => project.status.toLowerCase() === 'open').length || 0,
    completed: projects?.filter((project) => project.status.toLowerCase() === 'completed').length || 0,
  };

  // Filter and sort projects
  const filteredAndSortedProjects = () => {
    let filtered = projects || [];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((project) => project.status.toLowerCase() === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((project) => project.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.projectName?.toLowerCase().includes(term) ||
          project.teamLeadName?.toLowerCase().includes(term) ||
          project.category?.toLowerCase().includes(term)
      );
    }

    return [...filtered].sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      if (sortDirection === 'asc') {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
      }
    });
  };

  // Pagination logic
  const sortedProjects = filteredAndSortedProjects();
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSortField('projectName');
    setSortDirection('asc');
  };

  // Status colors
  const statusColors = {
    open: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  // Loading state
  if (fetchStatus === 'loading') {
    return (
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-md border border-green-200">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <Eye className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error loading projects</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Eye className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">No projects found</h3>
        <p className="text-green-600 mb-6 max-w-md mx-auto">
          {selectedStatus === 'all' && selectedCategory === 'all' && !searchTerm
            ? 'No projects are available.'
            : 'No projects match your current filters. Try adjusting your search or filter criteria.'}
        </p>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2 mx-auto border-green-300 text-green-700 hover:bg-green-50"
        >
          <FiX />
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Bug Reports</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                  >
                    <FiX className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Filter />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-green-200">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Projects</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projectStats.total}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('open')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-red-500">●</span>
                        Open
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projectStats.open}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('completed')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-green-500">●</span>
                        Completed
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projectStats.completed}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleCategoryFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Categories</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projectStats.total}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  {/* Add specific categories as needed */}
                  <DropdownMenuItem onClick={() => handleCategoryFilter('Development')}>
                    <div className="flex justify-between w-full">
                      <span>Development</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projects?.filter((p) => p.category === 'Development').length || 0}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryFilter('Testing')}>
                    <div className="flex justify-between w-full">
                      <span>Testing</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {projects?.filter((p) => p.category === 'Testing').length || 0}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleSort('projectName')}>
                    <div className="flex justify-between w-full">
                      <span>Project Name</span>
                      {sortField === 'projectName' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('teamLeadName')}>
                    <div className="flex justify-between w-full">
                      <span>Team Lead</span>
                      {sortField === 'teamLeadName' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    <div className="flex justify-between w-full">
                      <span>Status</span>
                      {sortField === 'status' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="justify-center">
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {currentProjects.length === 0 ? (
        <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Eye className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">No projects found</h3>
          <p className="text-green-600 mb-6 max-w-md mx-auto">
            No projects match your current filters. Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2 mx-auto border-green-300 text-green-700 hover:bg-green-50"
          >
            <FiX />
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="mt-0 bg-white rounded-lg shadow-md border border-green-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50">
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('projectName')}
                >
                  Project Name
                  {sortField === 'projectName' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('teamLeadName')}
                >
                  Team Lead
                  {sortField === 'teamLeadName' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Category</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.map((project) => (
                <TableRow key={project.projectId} className="hover:bg-green-50">
                  <TableCell className="font-medium text-green-900">
                    {project.projectName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-green-900">{project.teamLeadName || 'N/A'}</TableCell>
                  <TableCell className="text-green-900">{project.category || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[project.status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'} border capitalize`}
                    >
                      {project.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-800 hover:bg-green-100"
                      onClick={() => router.push(`/bug/projectId/?projectId=${project.projectId}`)}
                      aria-label={`View project ${project.projectName}`}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 mb-10">
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-green-700 ml-4">
                  Projects per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border-green-400 focus:ring-green-500 rounded-md"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-green-600 hover:bg-green-100"
                >
                  Previous
                </Button>
                {[...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page + 1}
                    variant={currentPage === page + 1 ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      currentPage === page + 1
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'text-green-600 hover:bg-green-100'
                    }
                  >
                    {page + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-green-600 hover:bg-green-100"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}