// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../../pages/users/LoginPage";
import SignUpPage from "../../pages/users/SignUpPage";
import ResetPasswordPage from "../../pages/users/ResetPasswordPage";
import ForgotPasswordPage from "../../pages/users/ForgotPasswordPage";
import OtpVerificationPage from "../../pages/users/OtpVerificationPage";
import PageNotFoundPage from "../../pages/users/PageNotFoundPage";
import SignUpRoleSelectPage from "../../pages/users/SignUpRoleSelectPage";
import LandingPage from "../../pages/users/LandingPage";

import AdminLayout from "../../layouts/AdminLayout";
import InspectorLayout from "../../layouts/InspectorLayout";
import AdminDashboardPage from "../components/admin/AdminDashboard";
import UserManagementPage from "../../pages/admin/UserManagementPage";
// import Subscriptions from "../components/users/Subscriptions";
import ProtectedRoute from "../components/users/ProtectedRoutes";
import ClientLayout from "../../layouts/ClientLayout"; 
import ClientDashboardPage from "../../pages/users/client/ClientDashboardPage";
import InspectorDashboardPage from "../../pages/users/inspector/InspectorDashboardPage";
import PaymentSuccess from "../components/users/PaymentSuccess";
import SubscriptionsWrapper from "../components/users/subscriptionWrapper";



const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup-role" element={<SignUpRoleSelectPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />

      {/* Subscription routes */}
      <Route path="/subscriptions" element={<SubscriptionsWrapper />} />



      {/* Inspector routes */}
      <Route element={<ProtectedRoute roles={[2]} />}>
        <Route element={<InspectorLayout />}>
          <Route path="/inspector/dashboard" element={<InspectorDashboardPage />} />
          {/* <Route path="/inspector/subscriptions" element={<Subscriptions />} /> */}

        </Route>
      </Route>


      {/* Client routes */}
      <Route element={<ProtectedRoute roles={[1]} />}>
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
        </Route>
      </Route>

      {/* Admin routes (route-group + role guard example) */}
      <Route element={<ProtectedRoute roles={[0]} />}>

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Route>

      {/* 404 page */}
      <Route path="*" element={<PageNotFoundPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<><h2>Payment Canceled</h2></>} />

    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
