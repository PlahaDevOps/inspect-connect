export interface SignInInput {
  email: string;
  password: string;
}

export interface verifyOtpInput {
  phoneNumber: string;
  countryCode: string;
  phoneOtp: string;
}