// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/lib/axiosInstance';

// // Async thunk for fetching a project by ID
// export const fetchProjectById = createAsyncThunk(
//   'project/fetchById',
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/projects/getProjectById/${projectId}`);
//       if (!response.data) {
//         throw new Error('No data found for the given project ID');
//       }
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
//     }
//   }
// );

// // Async thunk for updating a project
// export const updateProject = createAsyncThunk(
//   'project/updateById',
//   async ({ projectId, updatedData }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`/projects/updateProject/${projectId}`, updatedData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to edit project');
//     }
//   }
// );

// // Async thunk for fetching all projects
// export const fetchAllProjects = createAsyncThunk(
//   'project/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/projects/getallprojects');
//       if (response.data) {
//         const projectData = Array.isArray(response.data) ? response.data :
//                            response.data.data || response.data.projects || [];
//         return projectData;
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
//     }
//   }
// );

// // Async thunk for fetching clients
// export const fetchClients = createAsyncThunk(
//   'project/fetchClients',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/client/getAllClients');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch clients');
//     }
//   }
// );

// // Async thunk for fetching team leads
// export const fetchTeamLeads = createAsyncThunk(
//   'project/fetchTeamLeads',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/hrms/employees');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch team leads');
//     }
//   }
// );

// // Async thunk for creating a new project
// export const createProject = createAsyncThunk(
//   'project/createProject',
//   async (projectData, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       Object.keys(projectData).forEach((key) => {
//         if (key !== 'attachments') {
//           formData.append(key, projectData[key]);
//         }
//       });
//       if (projectData.attachments) {
//         projectData.attachments.forEach((file) => {
//           formData.append('attachments', file);
//         });
//       }
//       const response = await axiosInstance.post('/projects/onboard', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to create project');
//     }
//   }
// );

// // Async thunk for changing project status
// export const changeProjectStatus = createAsyncThunk(
//   'project/changeProjectStatus',
//   async ({ projectId, status }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`/projects/status/${projectId}`, { status });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to change project status');
//     }
//   }
// );

// const initialState = {
//   project: null, // Single project data
//   projects: [], // All projects data
//   clients: [],
//   teamLeads: [],
//   loading: {
//     fetchProject: false,
//     updateProject: false,
//     fetchAllProjects: false,
//     fetchClients: false,
//     fetchTeamLeads: false,
//     projectCreation: false,
//     statusChange: false,
//   },
//   error: {
//     fetchProject: null,
//     updateProject: null,
//     fetchAllProjects: null,
//     fetchClients: null,
//     fetchTeamLeads: null,
//     projectCreation: null,
//     statusChange: null,
//   },
//   successMessage: null,
// };

// const ProjectSlice = createSlice({
//   name: 'project',
//   initialState,
//   reducers: {
//     clearProjects: (state) => {
//       state.projects = [];
//       state.loading.fetchAllProjects = false;
//       state.error.fetchAllProjects = null;
//     },
//     resetProjectCreation: (state) => {
//       state.loading.projectCreation = false;
//       state.error.projectCreation = null;
//       state.successMessage = null;
//     },
//     clearErrors: (state) => {
//       state.error = {
//         fetchProject: null,
//         updateProject: null,
//         fetchAllProjects: null,
//         fetchClients: null,
//         fetchTeamLeads: null,
//         projectCreation: null,
//         statusChange: null,
//       };
//     },
//     resetSuccessMessage: (state) => {
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch Project By ID
//     builder
//       .addCase(fetchProjectById.pending, (state) => {
//         state.loading.fetchProject = true;
//         state.error.fetchProject = null;
//       })
//       .addCase(fetchProjectById.fulfilled, (state, action) => {
//         state.loading.fetchProject = false;
//         state.project = action.payload;
//       })
//       .addCase(fetchProjectById.rejected, (state, action) => {
//         state.loading.fetchProject = false;
//         state.error.fetchProject = action.payload;
//       })
//       // Update Project
//       .addCase(updateProject.pending, (state) => {
//         state.loading.updateProject = true;
//         state.error.updateProject = null;
//       })
//       .addCase(updateProject.fulfilled, (state, action) => {
//         state.loading.updateProject = false;
//         state.project = action.payload;
//       })
//       .addCase(updateProject.rejected, (state, action) => {
//         state.loading.updateProject = false;
//         state.error.updateProject = action.payload;
//       })
//       // Fetch All Projects
//       .addCase(fetchAllProjects.pending, (state) => {
//         state.loading.fetchAllProjects = true;
//         state.error.fetchAllProjects = null;
//       })
//       .addCase(fetchAllProjects.fulfilled, (state, action) => {
//         state.loading.fetchAllProjects = false;
//         state.projects = action.payload;
//       })
//       .addCase(fetchAllProjects.rejected, (state, action) => {
//         state.loading.fetchAllProjects = false;
//         state.error.fetchAllProjects = action.payload;
//       })
//       // Fetch Clients
//       .addCase(fetchClients.pending, (state) => {
//         state.loading.fetchClients = true;
//         state.error.fetchClients = null;
//       })
//       .addCase(fetchClients.fulfilled, (state, action) => {
//         state.loading.fetchClients = false;
//         state.clients = action.payload.clients || [];
//       })
//       .addCase(fetchClients.rejected, (state, action) => {
//         state.loading.fetchClients = false;
//         state.error.fetchClients = action.payload;
//       })
//       // Fetch Team Leads
//       .addCase(fetchTeamLeads.pending, (state) => {
//         state.loading.fetchTeamLeads = true;
//         state.error.fetchTeamLeads = null;
//       })
//       .addCase(fetchTeamLeads.fulfilled, (state, action) => {
//         state.loading.fetchTeamLeads = false;
//         state.teamLeads = action.payload;
//       })
//       .addCase(fetchTeamLeads.rejected, (state, action) => {
//         state.loading.fetchTeamLeads = false;
//         state.error.fetchTeamLeads = action.payload;
//       })
//       // Create Project
//       .addCase(createProject.pending, (state) => {
//         state.loading.projectCreation = true;
//         state.error.projectCreation = null;
//         state.successMessage = null;
//       })
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.loading.projectCreation = false;
//         state.successMessage = 'Project created successfully';
//       })
//       .addCase(createProject.rejected, (state, action) => {
//         state.loading.projectCreation = false;
//         state.error.projectCreation = action.payload;
//       })
//       // Change Project Status
//       .addCase(changeProjectStatus.pending, (state) => {
//         state.loading.statusChange = true;
//         state.error.statusChange = null;
//         state.successMessage = null;
//       })
//       .addCase(changeProjectStatus.fulfilled, (state, action) => {
//         state.loading.statusChange = false;
//         state.successMessage = 'Project status updated successfully';
//       })
//       .addCase(changeProjectStatus.rejected, (state, action) => {
//         state.loading.statusChange = false;
//         state.error.statusChange = action.payload;
//       });
//   },
// });

// export const {
//   clearProjects,
//   resetProjectCreation,
//   clearErrors,
//   resetSuccessMessage,
// } = ProjectSlice.actions;

// export default ProjectSlice.reducer;
