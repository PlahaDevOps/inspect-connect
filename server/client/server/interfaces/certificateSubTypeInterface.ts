import mongoose from "mongoose";

export interface ICertificateSubType extends Document {
    certificateTypeId: mongoose.Types.ObjectId;
    name: string;
    status: number;
  }