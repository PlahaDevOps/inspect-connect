import mongoose, { Document } from "mongoose";

export interface IActivityLog extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    bookingId: mongoose.Schema.Types.ObjectId;
    service: string;
    fullRequestUrl: string;
    date: Date;
    action: string;
    description: string;
    ipAddress: string;
    userAgent: string;
}
  