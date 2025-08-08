import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../interfaces/bookingInterface';

const BookingSchema = new Schema<IBooking>(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certificateSubTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateSubType", required: true },
    images: { type: [String], default: [] },
    video: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: Number, enum: [0,1,2,3,4], default: 0, description: "0 = pending, 1 = accept, 2 = reject, 3 = completed, 4 = cancelled" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
