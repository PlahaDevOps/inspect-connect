import mongoose, { Schema } from 'mongoose';
import { IReport } from '../interfaces/reportInterface';

const ReportSchema = new Schema<IReport>(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    message: { type: String, required: true },
    status: { type: Number, enum: [0,1,2], default: 0, description: "0 = pending, 1 = resolved, 2 = rejected" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReport>('Report', ReportSchema);
