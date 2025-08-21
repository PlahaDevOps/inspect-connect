import mongoose, { Document } from "mongoose";

export interface IReview extends Document {
    ratedToId: mongoose.Schema.Types.ObjectId;
    ratedById: mongoose.Schema.Types.ObjectId;
    bookingId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
}
  