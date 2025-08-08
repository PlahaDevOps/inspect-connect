import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/userInterface';

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: Number,
      enum: [0,1,2], // 0: admin, 1: client, 2: inspector
      default: 1,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
      description: "1 = active, 0 = inactive",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailOtpExpiryTime: {
      type: Date
    },
    phoneOtpExpiryTime: {
      type: Date
    },
    phoneOtp: {
      type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    country: { type: String},
    state: { type: String },
    city: { type: String },
    zip: { type: String},
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      locationName: { type: String },
      coordinates: {
        type: [Number],
        index: '2dsphere', // Create a geospatial index for coordinates
        default: [0, 0],
        required: true,
      }
    },
    // fields for inspector
    stripeCustomer: { type: String },
    mailingAddress: {
      type: String,
      required: true,
    },
    certificateTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateType" },
    certificateAgencyIds: { type: [mongoose.Schema.Types.ObjectId], ref: "CertificateAgency" },
    certificateDocuments: { type: [String] },
    certificateExpiryDate: { type: Date },
    referenceDocuments: { type: [String]},
    subscriptionId: { type: String },
    uploadedIdOrLicenseDocument: { type: String},
    workHistoryDescription: { type: String },
    phoneOtpVerified: { type: Boolean, default: false },
    emailOtpVerified: { type: Boolean, default: false },
    verifyByAdmin: { type: Boolean, default: false },
    subscriptionStatus: { type: Number, enum: [0,1], description: "0 = inactive, 1 = active" },
    agreedToTerms: { type: Boolean, default: false },
    isTruthfully: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    loginTime: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ location: '2dsphere' });
export default mongoose.model<IUser>('User', UserSchema);
