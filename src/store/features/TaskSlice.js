
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Create a new task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/task/assign', taskData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data.task || response.data;
    } catch (error) {
      console.error('Create Task Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create task'
      );
    }
  }
);

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/task/getall', {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !response.data.tasks) {
        throw new Error('No tasks received from server');
      }

      const activeTasks = response.data.tasks.filter((task) => !task.isDeleted);
     
      return activeTasks;
    } catch (error) {
      console.error('Fetch Tasks Error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch tasks'
      );
    }
  }
);

// Fetch a single task by ID
export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (task_id, { rejectWithValue }) => {
    try {
      console.log('Fetching task with ID:', task_id);
      const response = await axiosInstance.get(`/task/getbyid/${task_id}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !response.data.task) {
        throw new Error('Task not found');
      }

      console.log('Task data received:', response.data.task);
      return response.data.task;
    } catch (error) {
      console.error('Fetch Task By ID Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch task'
      );
    }
  }
);

// Fetch tasks by project ID
export const fetchTasksByProjectId = createAsyncThunk(
  'task/fetchTasksByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      console.log('Fetching tasks for project ID:', projectId);
      const response = await axiosInstance.get(`/task/project-tasks/${projectId}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data) {
        throw new Error('No tasks received from server');
      }

      // Ensure we're working with an array of tasks
      const tasksArray = Array.isArray(response.data) ? response.data :
                        Array.isArray(response.data.tasks) ? response.data.tasks :
                        response.data.data ? (Array.isArray(response.data.data) ? response.data.data : [response.data.data]) :
                        [];

      const activeTasks = tasksArray.filter((task) => !task.isDeleted);
      console.log('Tasks for project received:', activeTasks);
      return { projectId, tasks: activeTasks };
    } catch (error) {
      console.error('Fetch Tasks By Project ID Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Failed to fetch tasks for project'
      );
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/task/update/${taskData.task_id}`, taskData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !response.data.task) {
        throw new Error('Failed to update task');
      }

      return response.data.task;
    } catch (error) {
      console.error('Update Task Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update task'
      );
    }
  }
);

// Update task status
export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ task_id, status, feedback }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/task/update/${task_id}`, { status, feedback }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !response.data.task) {
        throw new Error('Failed to update task status');
      }

      return response.data.task;
    } catch (error) {
      console.error('Update Task Status Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update task status'
      );
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (task_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/task/delete/${task_id}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !response.data.message.includes('successfully')) {
        throw new Error('Failed to delete task');
      }

      return task_id;
    } catch (error) {
      console.error('Delete Task Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete task'
      );
    }
  }
);
// Get all task list (example: may include deleted or archived tasks for admin view)
export const getAllTaskList = createAsyncThunk(
  'task/getAllTaskList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/task/getall', {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data || !Array.isArray(response.data.tasks)) {
        throw new Error('No task list received from server');
      }

     
      // return response;
      return response.data.tasks;
    } catch (error) {
      console.error('Get All Task List Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to retrieve task list'
      );
    }
  }
);
// Get all task list (example: may include deleted or archived tasks for employee view)
export const getAllTaskByEmployeeId = createAsyncThunk(
  'task/getAllTaskByEmployeeId',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/task/member/${employeeId}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (!response.data ) {
        throw new Error('No tasks found for the employee');
      }

      return response.data.data;
    } catch (error) {
      console.error('Get Tasks By Employee ID Error:', error);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - Server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - Unable to connect to server');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch tasks for employee'
      );
    }
  }
);
const initialState = {
  tasks: [], // All tasks
  currentTask: null, // Single task for viewing/editing
  projectTasks: {}, // Tasks grouped by projectId
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if any
  allTaskList: [],
   employeeTasks: [],
  
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    resetCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
        // Add to projectTasks if projectId exists
        if (action.payload.projectId) {
          state.projectTasks[action.payload.projectId] = [
            ...(state.projectTasks[action.payload.projectId] || []),
            action.payload,
          ];
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch All Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
        // Group tasks by projectId for projectTasks
        state.projectTasks = action.payload.reduce((acc, task) => {
          if (task.projectId) {
            acc[task.projectId] = [...(acc[task.projectId] || []), task];
          }
          return acc;
        }, {});
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Task By ID
      .addCase(fetchTaskById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.currentTask = null;
      })
      // Fetch Tasks By Project ID
      .addCase(fetchTasksByProjectId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasksByProjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projectTasks[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasksByProjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update tasks array
        const index = state.tasks.findIndex((task) => task.task_id === action.payload.task_id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update currentTask
        state.currentTask = action.payload;
        // Update projectTasks
        if (action.payload.projectId) {
          const projectTasks = state.projectTasks[action.payload.projectId] || [];
          const taskIndex = projectTasks.findIndex((task) => task.task_id === action.payload.task_id);
          if (taskIndex !== -1) {
            state.projectTasks[action.payload.projectId][taskIndex] = action.payload;
          } else {
            state.projectTasks[action.payload.projectId] = [...projectTasks, action.payload];
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update tasks array
        const index = state.tasks.findIndex((task) => task.task_id === action.payload.task_id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update currentTask if it matches
        if (state.currentTask && state.currentTask.task_id === action.payload.task_id) {
          state.currentTask = action.payload;
        }
        // Update projectTasks
        if (action.payload.projectId) {
          const projectTasks = state.projectTasks[action.payload.projectId] || [];
          const taskIndex = projectTasks.findIndex((task) => task.task_id === action.payload.task_id);
          if (taskIndex !== -1) {
            state.projectTasks[action.payload.projectId][taskIndex] = action.payload;
          } else {
            state.projectTasks[action.payload.projectId] = [...projectTasks, action.payload];
          }
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = state.tasks.filter((task) => task.task_id !== action.payload);
        state.currentTask = null;
        // Remove from projectTasks
        Object.keys(state.projectTasks).forEach((projectId) => {
          state.projectTasks[projectId] = state.projectTasks[projectId].filter(
            (task) => task.task_id !== action.payload
          );
          // Clean up empty projectTasks entries
          if (state.projectTasks[projectId].length === 0) {
            delete state.projectTasks[projectId];
          }
        });
      })


      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
            // Get All Task List
      .addCase(getAllTaskList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllTaskList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTaskList = action.payload;
    
        
      })
      .addCase(getAllTaskList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      // Get All Task By Employee ID
      .addCase(getAllTaskByEmployeeId.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(getAllTaskByEmployeeId.fulfilled, (state, action) => {
    state.isLoading = false;
    state.employeeTasks = action.payload;
  })
  .addCase(getAllTaskByEmployeeId.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  });
;
  },
});

export const { clearError, resetCurrentTask } = taskSlice.actions;
export const selectTaskStatus = (state) => state.task.status;
export const selectTaskError = (state) => state.task.error;
export const selectTasksByProjectId = (state, projectId) => state.task.projectTasks[projectId] || [];
export const selectAllTasks = (state) => state.task.tasks;
export const selectCurrentTask = (state) => state.task.currentTask;
export const selectAllTaskList = (state) => state.task.allTaskList;   
export const selectAllTaskListByEmployeeId = (state) => state.task.employeeTasks;   

export default taskSlice.reducer;