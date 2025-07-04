




// // src/store/slices/paymentSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axiosInstancePublic from '@/lib/axiosInstancePublic'

// // Async thunk: Send payment confirmation
// export const sendPaymentlink = createAsyncThunk(
//   'payment/sendPaymentlink',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstancePublic.post('/payment/create-payment-link', payload)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Payment submission failed')
//     }
//   }
// )

// // ✅ New thunk: Send status code
// export const sendStatusCode = createAsyncThunk(
//   'payment/sendStatusCode',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstancePublic.post('/payment/send-statuscode', payload)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Sending status code failed')
//     }
//   }
// )

// // ✅ New thunk: Verify status code

// export const verifyStatusCode = createAsyncThunk(
//   'payment/verifyStatusCode',
//   async (contactId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstancePublic.get(`/payment/statuscheck/${contactId}`)
//       const paymentDataArray = response.data.data

//       // Optional: If empty array, treat as "unpaid" or "not found"
//       if (!paymentDataArray || paymentDataArray.length === 0) {
//         return { status: 'unpaid' }
//       }

//       // Return the first record
//       return paymentDataArray[0] // contains `status`, `contactId`, etc.
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Verification failed')
//     }
//   }
// )

// const initialState = {
//   status: 'idle', // 'idle' | 'processing' | 'success' | 'error'
//   error: null,
//   statusCode: '',
//   countdown: 5,
//   paymentDetails: {
//     contactId: '',
//     email: 'it_chinmaya@outlook.com',
//     statusCode: '',
//     status: ''
//   },
  
//   // ✅ New state fields for sending and verifying status code
//   sendStatus: 'idle',
//   verifyStatus: 'idle',
//   verificationResult: null
// }

// const paymentSlice = createSlice({
//   name: 'payment',
//   initialState,
//   reducers: {
//     setContactId: (state, action) => {
//       state.paymentDetails.contactId = action.payload
//     },
//     resetPayment: () => initialState,
//     setStatusCode: (state, action) => {
//       state.statusCode = action.payload
//       state.paymentDetails.statusCode = action.payload
//     },
//     decrementCountdown: (state) => {
//       if (state.countdown > 0) state.countdown -= 1
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Payment confirmation
//       .addCase(sendPaymentlink.pending, (state) => {
//         state.status = 'processing'
//         state.error = null
//       })
//       .addCase(sendPaymentlink.fulfilled, (state) => {
//         state.status = 'success'
//         state.error = null
//         state.paymentDetails.status = 'completed'
//       })
//       .addCase(sendPaymentlink.rejected, (state, action) => {
//         state.status = 'error'
//         state.error = action.payload
//       })

//       // ✅ Handle sendStatusCode thunk
//       .addCase(sendStatusCode.pending, (state) => {
//         state.sendStatus = 'processing'
//       })
//       .addCase(sendStatusCode.fulfilled, (state) => {
//         state.sendStatus = 'success'
//       })
//       .addCase(sendStatusCode.rejected, (state, action) => {
//         state.sendStatus = 'error'
//         state.error = action.payload
//       })

//       // ✅ Handle verifyStatusCode thunk
//       .addCase(verifyStatusCode.pending, (state) => {
//         state.verifyStatus = 'processing'
//       })
// //      .addCase(verifyStatusCode.fulfilled, (state, action) => {
// //   state.verifyStatus = 'success'
// //   state.verificationResult = action.payload
// //   state.paymentDetails.status = action.payload 
// // })
// .addCase(verifyStatusCode.fulfilled, (state, action) => {
//   state.verifyStatus = 'success'
//   state.verificationResult = action.payload
//   state.paymentDetails.status = action.payload?.status 
//   state.paymentDetails.contactId = action.payload?.contactId || ''
//   state.paymentDetails.email = action.payload?.contactEmail || ''
//   state.paymentDetails.statusCode = action.payload?.statusCode || ''
// })

//       .addCase(verifyStatusCode.rejected, (state, action) => {
//         state.verifyStatus = 'error'
//         state.error = action.payload
//       })
//   }
// })

// export const {
//   setContactId,
//   resetPayment,
//   setStatusCode,
//   decrementCountdown
// } = paymentSlice.actions

// export default paymentSlice.reducer






// src/store/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstancePublic from '@/lib/axiosInstancePublic'

// ✅ Thunk: Send payment link
export const sendPaymentlink = createAsyncThunk(
  'payment/sendPaymentlink',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstancePublic.post('/payment/create-payment-link', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Payment submission failed')
    }
  }
)

// ✅ Thunk: Send status code
export const sendStatusCode = createAsyncThunk(
  'payment/sendStatusCode',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstancePublic.post('/payment/send-statuscode', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sending status code failed')
    }
  }
)

// ✅ Thunk: Verify status code
export const verifyStatusCode = createAsyncThunk(
  'payment/verifyStatusCode',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await axiosInstancePublic.get(`/payment/statuscheck/${contactId}`)
      const paymentDataArray = response.data.data

      if (!paymentDataArray || paymentDataArray.length === 0) {
        return { status: 'unpaid' }
      }

      return paymentDataArray[0]
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Verification failed')
    }
  }
)

// ✅ NEW THUNK: Get full payment link details by contactId
export const getPaymentLinkDetailsByContactId = createAsyncThunk(
  'payment/getPaymentLinkDetailsByContactId',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await axiosInstancePublic.get(`/payment/paymentdetails/${contactId}`)
      return response.data.data // assuming { data: { contactId, email, ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payment link details')
    }
  }
)

// ✅ Initial state
const initialState = {
  status: 'idle',
  error: null,
  statusCode: '',
  countdown: 5,
  paymentDetails: {
    contactId: '',
    email: '',
    statusCode: '',
    status: ''
  },
  sendStatus: 'idle',
  verifyStatus: 'idle',
  verificationResult: null,
  getPaymentLinkStatus: 'idle',      // ✅ for getPaymentLinkDetailsByContactId
  paymentLinkRecord: null            // ✅ stores full payment link object
}

// ✅ Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setContactId: (state, action) => {
      state.paymentDetails.contactId = action.payload
    },
    resetPayment: () => initialState,
    setStatusCode: (state, action) => {
      state.statusCode = action.payload
      state.paymentDetails.statusCode = action.payload
    },
    decrementCountdown: (state) => {
      if (state.countdown > 0) state.countdown -= 1
    }
  },
  extraReducers: (builder) => {
    builder

      // ✅ Handle payment link sending
      .addCase(sendPaymentlink.pending, (state) => {
        state.status = 'processing'
        state.error = null
      })
      .addCase(sendPaymentlink.fulfilled, (state) => {
        state.status = 'success'
        state.paymentDetails.status = 'completed'
      })
      .addCase(sendPaymentlink.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload
      })

      // ✅ Handle status code sending
      .addCase(sendStatusCode.pending, (state) => {
        state.sendStatus = 'processing'
      })
      .addCase(sendStatusCode.fulfilled, (state) => {
        state.sendStatus = 'success'
      })
      .addCase(sendStatusCode.rejected, (state, action) => {
        state.sendStatus = 'error'
        state.error = action.payload
      })

      // ✅ Handle status code verification
      .addCase(verifyStatusCode.pending, (state) => {
        state.verifyStatus = 'processing'
      })
      .addCase(verifyStatusCode.fulfilled, (state, action) => {
        state.verifyStatus = 'success'
        state.verificationResult = action.payload
        state.paymentDetails.status = action.payload?.status || 'unknown'
        state.paymentDetails.contactId = action.payload?.contactId || ''
        state.paymentDetails.email = action.payload?.contactEmail || ''
        state.paymentDetails.statusCode = action.payload?.statusCode || ''
      })
      .addCase(verifyStatusCode.rejected, (state, action) => {
        state.verifyStatus = 'error'
        state.error = action.payload
      })

      // ✅ Handle getPaymentLinkDetailsByContactId
      .addCase(getPaymentLinkDetailsByContactId.pending, (state) => {
        state.getPaymentLinkStatus = 'processing'
      })
      .addCase(getPaymentLinkDetailsByContactId.fulfilled, (state, action) => {
        state.getPaymentLinkStatus = 'success'
        state.paymentLinkRecord = action.payload
      })
      .addCase(getPaymentLinkDetailsByContactId.rejected, (state, action) => {
        state.getPaymentLinkStatus = 'error'
        state.error = action.payload
      })
  }
})

// ✅ Exports
export const {
  setContactId,
  resetPayment,
  setStatusCode,
  decrementCountdown
} = paymentSlice.actions

export default paymentSlice.reducer
