
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamsByEmployeeId } from '@/store/features/teamSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const TeamListByEmployeeId = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { teamsByEmployee, status, error } = useSelector((state) => state.team);

  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchTeamsByEmployeeId(employeeId));
    }
  }, [dispatch, employeeId]);

  // Filter and search logic
  const filteredTeams = useMemo(() => {
    return teamsByEmployee.filter((team) => {
      const matchesSearch =
        team.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        projectFilter === 'all' || team.projectName === projectFilter;
      return matchesSearch && matchesFilter;
    });
  }, [teamsByEmployee, searchTerm, projectFilter]);

  // Unique project names for filter dropdown
  const projectOptions = useMemo(() => {
    const projects = [...new Set(teamsByEmployee.map((team) => team.projectName))];
    return ['all', ...projects];
  }, [teamsByEmployee]);

  // TanStack Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'teamId',
        header: 'Team ID',
        cell: ({ row }) => <span>{row.original.teamId}</span>,
      },
      {
        accessorKey: 'projectName',
        header: 'Project',
        cell: ({ row }) => <span>{row.original.projectName}</span>,
      },
      {
        accessorKey: 'project Id',
        header: 'Project Id',
        cell: ({ row }) => <span>{row.original.projectId}</span>,
      },
      {
        accessorKey: 'teamLeadName',
        header: 'Team Lead',
        cell: ({ row }) => <span>{row.original.teamLeadName}</span>,
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => {
          const isDeleted = row.original.isDeleted;
          const statusText = isDeleted ? "Inactive" : "Active";
          const statusColor = isDeleted
            ? "bg-red-200 text-red-800"
            : "bg-green-200 text-green-800";

          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
            >
              {statusText}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Users className="h-4 w-4 mr-2" />
                View Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-green-700">
                  Team Members - {row.original.teamId}
                </DialogTitle>
              </DialogHeader>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {row.original.teamMembers.map((member) => (
                  <Card
                    key={member._id}
                    className="border-green-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-lg text-green-800">
                        {member.memberName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        <strong>Role:</strong> {member.role}
                      </p>
                      <p className="text-sm">
                        <strong>Email:</strong> {member.email}
                      </p>
                      <p className="text-sm">
                        <strong>Member ID:</strong> {member.memberId}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
    []
  );

  // TanStack Table setup
  const table = useReactTable({
    data: filteredTeams,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: 5, // 5 teams per page
      },
    },
  });

  return (
    <div className="">
      <Card className="shadow-lg border-green-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">
            My Worked Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 min-h-screen">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              <Input
                placeholder="Search by team ID or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:ring-green-500"
              />
            </div>
            <Select
              value={projectFilter}
              onValueChange={setProjectFilter}
              className="w-full sm:w-48"
            >
              <SelectTrigger className="border-green-300 text-green-700">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project === 'all' ? 'All Projects' : project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading and Error States */}
          {status === 'loading' && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-green-700">Loading...</span>
            </div>
          )}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          {status === 'succeeded' && filteredTeams.length === 0 && (
            <p className="text-gray-500 text-center py-4">No teams found for this employee.</p>
          )}

          {/* Teams Table */}
          {status === 'succeeded' && filteredTeams.length > 0 && (
            <div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-green-200">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-green-800 font-semibold"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center cursor-pointer">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {table.getRowModel().rows.map((row) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="border-green-100 hover:bg-green-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-green-700">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamListByEmployeeId;