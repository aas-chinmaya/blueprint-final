import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';
 
// Initial State
const initialState = {
  quotations: [],
  quotation: null,
  loading: false,
  error: null,
};
 
// Thunks
 
export const createQuotation = createAsyncThunk(
  'quotation/createQuotation',
  async (quotationData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/quotation/create', quotationData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const getQuotations = createAsyncThunk(
  'quotation/getQuotations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/quotation/getquotations');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const getQuotationById = createAsyncThunk(
  'quotations/getQuotationById',
  async (quotationNumber, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/quotation/getQuotationById/${quotationNumber}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const updateQuotation = createAsyncThunk(
  'quotation/updateQuotation',
  async ({ quotationNumber, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/quotation/updatequotation/${quotationNumber}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const updateQuotationStatus = createAsyncThunk(
  'quotation/updateQuotationStatus',
  async ({ quotationNumber, statusData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/quotation/updatequotationstatus/${quotationNumber}/status`, statusData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
export const deleteQuotation = createAsyncThunk(
  'quotation/deleteQuotation',
  async (quotationNumber, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/quotation/${quotationNumber}`);
      return quotationNumber;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 
// Slice
const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    clearQuotationState: (state) => {
      state.quotation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations.unshift(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // Get All
      .addCase(getQuotations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload;
      })
      .addCase(getQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // Get by ID
      .addCase(getQuotationById.pending, (state) => {
        state.loading = true;
        state.quotation = null;
      })
      .addCase(getQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.quotation = action.payload;
      })
      .addCase(getQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // Update
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotation = action.payload;
        state.quotations = state.quotations.map((q) =>
          q.quotationNumber === action.payload.quotationNumber ? action.payload : q
        );
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // Update Status
      .addCase(updateQuotationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuotationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.quotation;
        state.quotation = updated;
        state.quotations = state.quotations.map((q) =>
          q.quotationNumber === updated.quotationNumber ? updated : q
        );
      })
      .addCase(updateQuotationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      // Delete
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = state.quotations.filter(
          (q) => q.quotationNumber !== action.payload
        );
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
 
// Export Actions & Reducer
export const { clearQuotationState } = quotationSlice.actions;
export default quotationSlice.reducer;