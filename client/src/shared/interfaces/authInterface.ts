import type { User } from '../interfaces/userInterface';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface SignupFormValues {
  name: string;
  phoneNumber: string;
  email: string;
  mailingAddress: string;
  password: string;
  confirmPassword: string;
  certificateTypeId: string;
  certificateAgencyIds: string[];
  certificateDocuments: string[];
  certificateExpiryDate: string;
  state: string;
  country: string;
  city: string;
  zip: string; 
  subscriptionType: string;
  profileImage: string | string[];
  uploadedIdOrLicenseDocument: string | string[];
  referenceDocuments: string[];
  termsAccepted: boolean;
  eSigned: boolean;
  submit?: string;
  countryCode: string;
  workHistoryDescription: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
  submit?: string;
}