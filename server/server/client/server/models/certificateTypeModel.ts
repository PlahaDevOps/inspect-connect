import mongoose, { Schema } from 'mongoose';
import { ICertificateType } from '../interfaces/certificateTypeInterface';

const CertificateTypeSchema = new Schema<ICertificateType>(
  {
    name: { type: String, required: true },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICertificateType>('CertificateType', CertificateTypeSchema);
