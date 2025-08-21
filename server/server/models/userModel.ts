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
    country: { type: String, default: undefined, required: function() { return this.role === 2; } },
    state: { type: String, default: undefined, required: function() { return this.role === 2; } },
    city: { type: String, default: undefined, required: function() { return this.role === 2; } },
    zip: { type: String },
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
    mailingAddress: {
      type: String,
      required: true,
    },
    certificateTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateType", default: undefined, required: function() { return this.role === 2; } },
    certificateAgencyIds: { type: [mongoose.Schema.Types.ObjectId], ref: "CertificateAgency", default: undefined, required: function() { return this.role === 2; } },
    certificateDocuments: { type: [String], default: undefined, required: function() { return this.role === 2; } },
    certificateExpiryDate: { type: Date, default: undefined, required: function() { return this.role === 2; } },
    referenceDocuments: { type: [String], default: undefined, required: function() { return this.role === 2; } },
    uploadedIdOrLicenseDocument: { type: String, default: undefined, required: function() { return this.role === 2; } },
    workHistoryDescription: { type: String, default: undefined, required: function() { return this.role === 2; } },
    phoneOtpVerified: { type: Boolean, default: false },
    emailOtpVerified: { type: Boolean, default: false },
    verifyByAdmin: { type: Boolean, default: false},
    agreedToTerms: { type: Boolean, default: false },
    isTruthfully: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    loginTime: { type: Date, default: null },
    stripeCustomerId: { type: String },
    subscriptionStatus: { type: String, default: null },
    currentSubscriptionId: { type: String, default: null },
    currentSubscriptionTrialDays: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ location: '2dsphere' });
export default mongoose.model<IUser>('User', UserSchema);
