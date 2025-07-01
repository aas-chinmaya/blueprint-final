


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Async thunk for creating a new bug
export const createBug = createAsyncThunk(
  'bugs/createBug',
  async (bugData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/bugs/create', bugData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating bug:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create bug');
    }
  }
);

// Async thunk for fetching all bugs by project ID
export const fetchAllBugs = createAsyncThunk(
  'bugs/fetchAllBugs',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/bugs/getallbugByProjectId/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bugs:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bugs');
    }
  }
);

// Async thunk for resolving a bug
export const resolveBug = createAsyncThunk(
  'bugs/resolveBug',
  async (bugId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/bugs/resolve/${bugId}`);
      console.log('Bug resolved:');
      return response.data;
    } catch (error) {
      console.error('Error resolving bug:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve bug');
    }
  }
);

const initialState = {
  bug: null,
  bugs: [],
  loading: {
    bugCreation: false,
    bugsFetch: false,
    bugResolve: false, // Added for resolveBug
  },
  error: {
    bugCreation: null,
    bugsFetch: null,
    bugResolve: null, // Added for resolveBug
  },
  successMessage: null,
};

const bugSlice = createSlice({
  name: 'bugs',
  initialState,
  reducers: {
    resetBugCreation: (state) => {
      state.loading.bugCreation = false;
      state.error.bugCreation = null;
      state.successMessage = null;
      state.bug = null;
    },
    clearErrors: (state) => {
      state.error.bugCreation = null;
      state.error.bugsFetch = null;
      state.error.bugResolve = null; // Clear resolveBug error
    },
  },
  extraReducers: (builder) => {
    // Create Bug
    builder
      .addCase(createBug.pending, (state) => {
        state.loading.bugCreation = true;
        state.error.bugCreation = null;
        state.successMessage = null;
      })
      .addCase(createBug.fulfilled, (state, action) => {
        state.loading.bugCreation = false;
        state.bug = action.payload;
        state.bugs.push(action.payload); // Add new bug to bugs array
        state.successMessage = 'Bug created successfully';
      })
      .addCase(createBug.rejected, (state, action) => {
        state.loading.bugCreation = false;
        state.error.bugCreation = action.payload;
      });

    // Fetch All Bugs
    builder
      .addCase(fetchAllBugs.pending, (state) => {
        state.loading.bugsFetch = true;
        state.error.bugsFetch = null;
      })
      .addCase(fetchAllBugs.fulfilled, (state, action) => {
        state.loading.bugsFetch = false;
        state.bugs = action.payload;
      })
      .addCase(fetchAllBugs.rejected, (state, action) => {
        state.loading.bugsFetch = false;
        state.error.bugsFetch = action.payload;
      });

    // Resolve Bug
    builder
      .addCase(resolveBug.pending, (state) => {
        state.loading.bugResolve = true;
        state.error.bugResolve = null;
        state.successMessage = null;
      })
      .addCase(resolveBug.fulfilled, (state, action) => {
        state.loading.bugResolve = false;
        state.successMessage = action.payload.message;
        // Update the bug in the bugs array
        const updatedBug = action.payload.bug;
        state.bugs = state.bugs.map((bug) =>
          bug.bug_id === updatedBug.bug_id ? updatedBug : bug
        );
      })
      .addCase(resolveBug.rejected, (state, action) => {
        state.loading.bugResolve = false;
        state.error.bugResolve = action.payload;
      });
  },
});

export const { resetBugCreation, clearErrors } = bugSlice.actions;
export default bugSlice.reducer;