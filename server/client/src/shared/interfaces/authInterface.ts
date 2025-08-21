import type { UploadItem } from '../components/users/FileUpload';
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
  // subscriptionType: string;
  profileImage: string | string[];
  uploadedIdOrLicenseDocument: string | string[];
  referenceDocuments: string[];
  termsAccepted: boolean;
  eSigned: boolean;
  submit?: string;
  countryCode: string;
  workHistoryDescription: string;
  // subscriptionId: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
  submit?: string;
}
 export type RegisterPayload = {
  role: number;
  location: {
    type: string;
    locationName: string;
    coordinates: number[];
  };
  countryCode: string;
  email: string;
  mailingAddress: string;
  name: string;
  password: string;
  phoneNumber: string;
  agreedToTerms: boolean;
  isTruthfully: boolean;
  uploadedIdOrLicenseDocument?: string | null;
  profileImage?: string | null;
  certificateDocuments?: string[];
  referenceDocuments?: string[];
  certificateAgencyIds?: string[];
  certificateExpiryDate?: string | null;
  certificateTypeId?: string | null;
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
  workHistoryDescription?: string;
};
export interface ProfileImageUploadProps {
  file: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  error?: string;
}
 export interface PhoneNumberFieldProps {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (phoneNumber: string, countryCode: string) => void;
  onBlur: () => void;
  label?: string;
}
export interface FileUploadProps {
  items: UploadItem[];
  onDelete: (index: number) => void;
  title?: string;
 
  mode?: "profile" | "list";
   
  uploadControl?: React.ReactNode;
}
