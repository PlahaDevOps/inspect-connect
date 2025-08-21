import mongoose, { Schema } from 'mongoose';
import { IFaq } from '../interfaces/faqInterface';

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFaq>('Faq', FaqSchema);
