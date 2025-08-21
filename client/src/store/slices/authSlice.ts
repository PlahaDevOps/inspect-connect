import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../shared/interfaces/commonInterface'; 
import { createSubscription, forgotPassword, getSubscriptionPlans, loginUser, logoutUser, registerUser, resendOtp, resetPassword, verifyOtp } from '../actions/authActions';
import toast from 'react-hot-toast'; 


const initialState: AuthState = {
  user: null,
  authToken: localStorage.getItem('token'),
  loading: false,
  error: null,
  forgotPasswordResponse: null,
  role: null,
  subscriptionPlans: null,
  subscriptionStatus: null,
  currentSubscriptionId: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.authToken = null;
      localStorage.removeItem('token');
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.authToken = action.payload;
    },
    hydrate(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
          toast.error(action.payload || 'Login failed');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        toast.success('Login successful');
        console.log("action.payload", action.payload);
        state.loading = false;
        if(action.payload.subscriptionStatus === "active"){
          state.subscriptionStatus = "active";
        }else{
          state.subscriptionStatus = "inactive";
        }
        // Handle case where user data is directly in payload or nested under user key
        if (action.payload.user) {
          state.user = action.payload.user;
          state.authToken = action.payload.authToken || action.payload.token || '';
          state.role = action.payload.user.role;
          state.currentSubscriptionId = action?.payload?.currentSubscriptionId || "";
        } else {
          // User data is directly in payload - check if it has required User properties
          if (action.payload._id && action.payload.email && action.payload.name && action.payload.role !== undefined) {
            state.user = {
              _id: action.payload._id,
              email: action.payload.email,
              name: action.payload.name,
              role: action.payload.role,
              createdAt: action.payload.createdAt || new Date().toISOString(),
              updatedAt: action.payload.updatedAt || new Date().toISOString()
            };
            state.role = action.payload.role;
          }
          state.authToken = action.payload.authToken || action.payload.token || '';
        }
        localStorage.setItem('token', state.authToken || '');
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Registration failed';
        toast.error(action.payload || 'Registration failed');
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        toast.success('Registration successful');
        state.loading = false;
        // Handle case where user data is directly in payload or nested under user key
        if (action.payload.user) {
          state.user = action.payload.user;
          state.authToken = action.payload.token || '';
        } else {
          // User data is directly in payload - check if it has required User properties
          if (action.payload._id && action.payload.email && action.payload.name && action.payload.role !== undefined) {
            state.user = {
              _id: action.payload._id,
              email: action.payload.email,
              name: action.payload.name,
              role: action.payload.role,
              createdAt: action.payload.createdAt || new Date().toISOString(),
              updatedAt: action.payload.updatedAt || new Date().toISOString()
            };
          }
          state.authToken = action.payload.authToken || action.payload.token || '';
        }
        localStorage.setItem('token', state.authToken || '');
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Forgot password failed';
        toast.error(action.payload || 'Forgot password failed');
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        toast.success('Forgot password request successful');
        state.loading = false;
        state.error = null;
        // state.forgotPasswordResponse = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        console.log("action.payload resetPassword", action.payload);
        state.loading = false;
        state.error = 'Reset password failed';
        toast.error(action.payload || 'Reset password failed');
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        toast.success('Password reset successful');
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Resend OTP failed';
        toast.error(action.payload || 'Resend OTP failed');
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        toast.success('OTP resent successfully');
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Verify OTP failed';
        toast.error(action.payload || 'Verify OTP failed'); 
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        toast.success('OTP verified successfully');
        state.loading = false;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Get subscription plans failed';
        toast.error(action.payload || 'Get subscription plans failed');
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        console.log("Subscription plans fetched successfully", action.payload);
        // toast.success('Subscription plans fetched successfully');
        state.loading = false;
        state.error = null;
        state.subscriptionPlans = action.payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Create subscription failed';
        toast.error(action.payload || 'Create subscription failed');
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        console.log("action.payload", action.payload); 
        state.loading = false;
        state.error = null; 
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Logout failed';
        toast.error(action.payload || 'Logout failed');
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.error = null;
        state.user = null;
        state.authToken = null;
        localStorage.removeItem('token');
       
      })
  },
});

export const { clearError, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
