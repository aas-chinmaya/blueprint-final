import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

// Create MoM
export const createProjectMeetingMom = createAsyncThunk(
  'projectMeetingMom/createProjectMeetingMom',
  async (momData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/mom/projectmom', momData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project MoM');
    }
  }
);

// Fetch all MoMs (with optional search, sort, and filter)
export const fetchAllProjectMoms = createAsyncThunk(
  'projectMeetingMom/fetchAllProjectMoms',
  async ({ search = '', sort = 'createdAt', order = 'desc', filter = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        search,
        sort,
        order,
        ...filter, // e.g., { projectId: '123', meetingMode: 'online' }
      });
      const response = await axiosInstance.get(`/mom?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch MoMs');
    }
  }
);

// Fetch MoM by momId
export const fetchMeetingMomById = createAsyncThunk(
  'projectMeetingMom/fetchMeetingMomById',
  async (momId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/mom/${momId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch MoM');
    }
  }
);

// Update MoM by momId
export const updateProjectMeetingMom = createAsyncThunk(
  'projectMeetingMom/updateProjectMeetingMom',
  async ({ momId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/mom/${momId}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update MoM');
    }
  }
);

// Delete MoM by momId
export const deleteProjectMeetingMom = createAsyncThunk(
  'projectMeetingMom/deleteProjectMeetingMom',
  async (momId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/mom/${momId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete MoM');
    }
  }
);

// Fetch MoM PDF View
export const fetchMeetingMomView = createAsyncThunk(
  'projectMeetingMom/fetchMeetingMomView',
  async (momId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/mom/view/${momId}`, {
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];
      if (!contentType.includes('application/pdf')) {
        throw new Error('Response is not a valid PDF');
      }

      const pdfUrl = URL.createObjectURL(response.data);
      return { pdfUrl, momId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch MoM PDF');
    }
  }
);

const projectMeetingMomSlice = createSlice({
  name: 'projectMeetingMom',
  initialState: {
    moms: [], // List of all MoMs
    momsLoading: false,
    momsError: null,
    selectedMom: null,
    selectedMomLoading: false,
    selectedMomError: null,
    deleteSuccess: false,
    meetingMomView: null,
    meetingMomViewLoading: false,
    meetingMomViewError: null,
    searchQuery: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    filters: {},
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSort: (state, action) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetSelectedMom: (state) => {
      state.selectedMom = null;
      state.selectedMomLoading = false;
      state.selectedMomError = null;
      state.deleteSuccess = false;
    },
    resetMeetingMomView: (state) => {
      state.meetingMomView = null;
      state.meetingMomViewLoading = false;
      state.meetingMomViewError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create MoM
      .addCase(createProjectMeetingMom.pending, (state) => {
        state.selectedMomLoading = true;
        state.selectedMomError = null;
      })
      .addCase(createProjectMeetingMom.fulfilled, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMom = action.payload;
        state.moms = [action.payload, ...state.moms]; // Add new MoM to list
      })
      .addCase(createProjectMeetingMom.rejected, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMomError = action.payload;
      })
      // Fetch All MoMs
      .addCase(fetchAllProjectMoms.pending, (state) => {
        state.momsLoading = true;
        state.momsError = null;
      })
      .addCase(fetchAllProjectMoms.fulfilled, (state, action) => {
        state.momsLoading = false;
        state.moms = action.payload;
      })
      .addCase(fetchAllProjectMoms.rejected, (state, action) => {
        state.momsLoading = false;
        state.momsError = action.payload;
      })
      // Fetch MoM by momId
      .addCase(fetchMeetingMomById.pending, (state) => {
        state.selectedMomLoading = true;
        state.selectedMomError = null;
      })
      .addCase(fetchMeetingMomById.fulfilled, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMom = action.payload;
      })
      .addCase(fetchMeetingMomById.rejected, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMomError = action.payload;
      })
      // Update MoM
      .addCase(updateProjectMeetingMom.pending, (state) => {
        state.selectedMomLoading = true;
        state.selectedMomError = null;
      })
      .addCase(updateProjectMeetingMom.fulfilled, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMom = action.payload;
        state.moms = state.moms.map((mom) =>
          mom.id === action.payload.id ? action.payload : mom
        );
      })
      .addCase(updateProjectMeetingMom.rejected, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMomError = action.payload;
      })
      // Delete MoM
      .addCase(deleteProjectMeetingMom.pending, (state) => {
        state.selectedMomLoading = true;
        state.selectedMomError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteProjectMeetingMom.fulfilled, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMom = null;
        state.deleteSuccess = true;
        state.moms = state.moms.filter((mom) => mom.id !== action.meta.arg);
      })
      .addCase(deleteProjectMeetingMom.rejected, (state, action) => {
        state.selectedMomLoading = false;
        state.selectedMomError = action.payload;
        state.deleteSuccess = false;
      })
      // Fetch MoM PDF View
      .addCase(fetchMeetingMomView.pending, (state) => {
        state.meetingMomViewLoading = true;
        state.meetingMomViewError = null;
        state.meetingMomView = null;
      })
      .addCase(fetchMeetingMomView.fulfilled, (state, action) => {
        state.meetingMomViewLoading = false;
        state.meetingMomView = action.payload;
      })
      .addCase(fetchMeetingMomView.rejected, (state, action) => {
        state.meetingMomViewLoading = false;
        state.meetingMomViewError = action.payload;
        state.meetingMomView = null;
      });
  },
});

export const { setSearchQuery, setSort, setFilters, resetSelectedMom, resetMeetingMomView } =
  projectMeetingMomSlice.actions;
export default projectMeetingMomSlice.reducer;