import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';
import Cookies from 'js-cookie';

// ✅ Async Thunks

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/login', { email, password });
    if (res.data.token) {
      Cookies.set('token', res.data.token);
      Cookies.set('email', email);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Login failed');
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/send-otp', { email });
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
    if (res.data.token) {
      Cookies.set('token', res.data.token);
      Cookies.set('email', email);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'OTP verification failed');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/reset-password', payload);
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Password reset failed');
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/checkCookies');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Token check failed', dashboard: false });
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const email = Cookies.get('email');
    const res = await axiosInstance.post('/auth/logout', { email });
    Cookies.remove('token');
    Cookies.remove('email');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Logout failed');
  }
});

// ✅ Slice

const initialState = {
  user: null,
  token: null,
  email: null,
  role: null,
  otpSent: false,
  isAuthenticated: false,
  isTokenChecked: false,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Registration successful';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(sendOtp.fulfilled, (state, action) => {
        state.otpSent = true;
        state.message = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpSent = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.email = action.payload.email;
        state.message = action.payload.message || 'OTP verified';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload?.message;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isTokenChecked = true;
        state.isAuthenticated = action.payload.dashboard;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isTokenChecked = true;
        state.isAuthenticated = false;
        state.error = action.payload?.message;
      })

      .addCase(logoutUser.fulfilled, () => ({
        ...initialState,
        isTokenChecked: true,
      }))
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload?.message;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
