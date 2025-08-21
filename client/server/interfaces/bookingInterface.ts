import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
    clientId: mongoose.Types.ObjectId;
    inspectorId: mongoose.Types.ObjectId;
    certificateSubTypeId: mongoose.Types.ObjectId;
    images: string[];
    video: string;
    thumbnail: string;
    description: string;
    status: number;
    isDeleted: boolean;
  }