import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '../../shared/interfaces/commonInterface';
import type { User } from '../../shared/interfaces/userInterface';
import { forgotPassword, loginUser, registerUser, resendOtp, resetPassword, verifyOtp } from '../actions/authActions';
import toast from 'react-hot-toast';

const initialState: AuthState = {
  user: null,
  authToken: localStorage.getItem('token'),
  loading: false,
  error: null,
  forgotPasswordResponse: null,
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
        state.loading = false;
        state.user = action.payload.user as User;
        state.authToken = action.payload.authToken || action.payload.token;
        localStorage.setItem('token', action.payload.authToken || action.payload.token);
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
        state.user = action.payload.user as User;
        state.authToken = action.payload.token;
        localStorage.setItem('token', action.payload.authToken || action.payload.token);
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
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
