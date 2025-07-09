'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchAllProjects } from '@/store/features/in-project/projectSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

export default function AllBugList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => state.project.projects);
  const fetchStatus = useSelector((state) => state.project.status.fetchAllProjects);
  const error = useSelector((state) => state.project.error.fetchAllProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchAllProjects());
    }
  }, [dispatch, fetchStatus]);
console.log(projects, fetchStatus, error);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (fetchStatus === 'loading') {
    return <div className="text-center py-8 text-blue-800">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">All Projects</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-800">Project Name</TableHead>
                <TableHead className="text-blue-800">teamLeadName</TableHead>
                <TableHead className="text-blue-800">category
</TableHead>
                <TableHead className="text-blue-800">Status</TableHead>
                <TableHead className="text-blue-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.map((project) => (
                <TableRow key={project.projectId}>
                  <TableCell className="font-medium">{project.projectName || 'N/A'}</TableCell>
                  <TableCell>{project.teamLeadName|| 'N/A'}</TableCell>
                  <TableCell>{project.category
 || 'N/A'}</TableCell>
                  <TableCell>{project.status || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/bug/projectId/?projectId=${project.projectId}`)}

                      // onClick={() => router.push(`/bug/${project.projectId}`)}
                    >
                      <Eye className="h-5 w-5 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}