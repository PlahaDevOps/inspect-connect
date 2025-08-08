import { createPostThunk } from './indexThunkApis';
import { API_ENDPOINTS } from '../apiEndpoints';

type Credentials = { email: string; password: string };
type ForgotPasswordPayload = { email: string };
type ResetPasswordPayload = {  password: string;resetPasswordToken:string;encryptedEmail:string  };
type VerifyOtpPayload = { phoneNumber: string; countryCode: string; phoneOtp: string };
type ResendOtpPayload = { phoneNumber: string; countryCode: string };

interface RegisterPayload {
  name: string;
  phoneNumber: string;
  email: string;
  mailingAddress: string;
  password: string;
  role: number;
  location: {
    type: string;
    locationName: string;
    coordinates: number[];
  };
  agreedToTerms?: boolean;
  isTruthfully?: boolean;
  countryCode?: string;
  // Optional properties for inspector role
  certificateTypeId?: string | null;
  certificateAgencyIds?: string[];
  certificateDocuments?: string[];
  certificateExpiryDate?: string | null;
  state?: string | null;
  country?: string | null;
  city?: string | null;
  zip?: string | null;
  uploadedIdOrLicenseDocument?: string | null;
  profileImage?: string | null;
  workHistoryDescription?: string | null;
  referenceDocuments?: string[];
}


type AuthResponse = { 
  user: unknown; 
  token: string;
  authToken?: string;
  success?: boolean;
  code?: number;
  message?: string;
};

export const loginUser = createPostThunk<AuthResponse, Credentials>(
  'auth/login',
  () => API_ENDPOINTS.AUTH.LOGIN
);

export const registerUser = createPostThunk<AuthResponse, RegisterPayload>(
  'auth/register',
  () => API_ENDPOINTS.AUTH.REGISTER
);

export const logoutUser = createPostThunk<void, void>(
  'auth/logout',
  () => API_ENDPOINTS.AUTH.LOGOUT
);
export const resetPassword = createPostThunk<AuthResponse, ResetPasswordPayload>(
  'auth/resetPassword',
  () => API_ENDPOINTS.AUTH.RESET_PASSWORD
);
 export const resendOtp = createPostThunk<AuthResponse, ResendOtpPayload>(
  'auth/resendOtp',
  () => API_ENDPOINTS.AUTH.RESEND_OTP
);
export const verifyOtp = createPostThunk<AuthResponse, VerifyOtpPayload>(
  'auth/verifyOtp',
  () => API_ENDPOINTS.AUTH.VERIFY_OTP
);

export const forgotPassword = createPostThunk<AuthResponse, ForgotPasswordPayload>(
  'auth/forgotPassword',
  () => API_ENDPOINTS.AUTH.FORGOT_PASSWORD
);
