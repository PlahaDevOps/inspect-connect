import React from 'react';
import type { User, UserRole } from '../interfaces/userInterface';
import type { SubscriptionPlan } from './subscriptionInterface';

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  roles?: UserRole[];
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp?: Date;
    duration?: number;
    title?: string;
    read?: boolean;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  value: unknown;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AuthState {
  user: User | null;
  authToken: string | null;
  loading: boolean;
  error: string | null;
  forgotPasswordResponse: null;
  role: UserRole | null;
  subscriptionPlans: SubscriptionPlan[] | null;
  subscriptionStatus: string | null;
  currentSubscriptionId: string | null;
}