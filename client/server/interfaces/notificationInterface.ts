import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  bookingId: mongoose.Schema.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
}