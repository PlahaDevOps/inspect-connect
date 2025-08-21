import mongoose, { Schema } from 'mongoose';
import { ICms } from '../interfaces/cmdInterface';

const CmsSchema = new Schema<ICms>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: Number, enum: [0,1,2], required: true, description: "0 = Aboutus, 1 = Terms&conditions, 2 = privacy" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICms>('Cms', CmsSchema);
