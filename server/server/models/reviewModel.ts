import mongoose, { Schema } from 'mongoose';
import { IReview } from '../interfaces/reviewInterface';

const ReviewSchema = new Schema<IReview>(
  {
    ratedToId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
