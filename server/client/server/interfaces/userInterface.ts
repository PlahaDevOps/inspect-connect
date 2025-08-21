import { Document } from "mongoose";

export interface IUser extends Document {
    role: number;
    email: string;
    profileImage?: string;
    name?: string;
    status: number;
    phoneNumber?: string;
    countryCode?: string;
    password: string;
    resetPasswordToken?: string;
    emailOtpExpiryTime?: Date;
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    location?: {
      type: string;
      locationName: string;
      coordinates: number[];
    };
    phoneOtpExpiryTime?: Date;
    phoneOtp?: string;
    // fields for inspector
    stripeCustomer?: string;
    isDeleted?: boolean;
    mailingAddress?: string;
    certificateTypeId?: string;
    certificateAgencyIds?: string[];
    certificateDocuments?: string[];
    certificateExpiryDate?: Date;
    subscriptionId?: string;
    uploadedIdOrLicenseDocument?: string;
    referenceDocuments?: string[];
    workHistoryDescription?: string;
    phoneOtpVerified?: boolean;
    emailOtpVerified?: boolean;
    verifyByAdmin?: boolean;
    subscriptionStatus?: number;
    agreedToTerms?: boolean;
    isTruthfully?: boolean;
    loginTime?: Date;
  }
  