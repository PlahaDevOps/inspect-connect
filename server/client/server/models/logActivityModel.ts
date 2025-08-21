import mongoose, { Schema } from 'mongoose';
import { IActivityLog } from '../interfaces/logInterface';

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "LogActivity", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    action: { type: String, required: true },
    service: { type: String, required: true }, // which service url is hit
    fullRequestUrl: { type: String, required: true }, // full request url
    date: { type: Date, required: true }, // date of the action
    description: { type: String }, // previous data, new data
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
