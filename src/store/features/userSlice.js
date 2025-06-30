import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// ✅ Async Thunks

export const editProfile = createAsyncThunk('user/editProfile', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put('/auth/profile', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Profile update failed');
  }
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/auth/users');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Fetching users failed');
  }
});

export const getUserDetails = createAsyncThunk('user/getUserDetails', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/auth/getUserByEmail');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Fetching user failed');
  }
});

export const getUserProfileDetails = createAsyncThunk('user/getUserProfileDetails', async ({ email }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/auth/userDetails/${email}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Profile fetch failed');
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (email, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(`/auth/user/${email}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Delete failed');
  }
});

// ✅ Slice

const initialState = {
  users: [],
  profile: null,
  userDetails: [],
  message: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfile.fulfilled, (state, action) => {
        state.userDetails = action.payload.user;
        state.message = 'Profile updated';
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getUserProfileDetails.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getUserProfileDetails.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.email !== action.meta.arg);
        state.message = action.payload.message || 'User deleted';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
