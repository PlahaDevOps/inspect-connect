import mongoose, { Schema } from 'mongoose';
import { ICertificateSubType } from '../interfaces/certificateSubTypeInterface';

const CertificateSubTypeSchema = new Schema<ICertificateSubType>(
  {
    certificateTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateType", default: null },
    name: { type: String, required: true },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICertificateSubType>('CertificateSubType', CertificateSubTypeSchema);
