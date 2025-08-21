import mongoose, { Document } from "mongoose";

export interface IReport extends Document {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    bookingId: mongoose.Schema.Types.ObjectId;
    message: string;
    status: number;
}
  