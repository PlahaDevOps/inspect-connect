import mongoose, { Schema } from 'mongoose';
import { INotification } from '../interfaces/notificationInterface';

const NotificationSchema = new Schema<INotification>(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
