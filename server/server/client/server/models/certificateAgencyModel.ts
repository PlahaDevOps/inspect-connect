import mongoose, { Schema } from 'mongoose';
import { ICertificateAgency } from '../interfaces/certificateAgencyInterface';

const CertificateAgencySchema = new Schema<ICertificateAgency>(
  {
    name: { type: String, required: true },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICertificateAgency>('CertificateAgency', CertificateAgencySchema);
