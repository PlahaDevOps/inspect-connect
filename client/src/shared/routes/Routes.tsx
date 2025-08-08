import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/users/LoginPage'; 
import SignUpPage from '../../pages/users/SignUpPage'; 
import ResetPasswordPage from '../../pages/users/ResetPasswordPage';
import ForgotPasswordPage from '../../pages/users/ForgotPasswordPage';
import OtpPage from '../../pages/users/OtpPage';
import PageNotFoundPage from '../../pages/users/PageNotFoundPage';
import SignUpRoleSelectPage from '../../pages/users/SignUpRoleSelectPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} /> 
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup-role-select" element={<SignUpRoleSelectPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="*" element={<PageNotFoundPage />} />
      
    </Routes>
  </BrowserRouter>
);
  
export default AppRoutes; 