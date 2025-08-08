import mongoose, { Schema } from 'mongoose';
import { IContactUs } from '../interfaces/contactUsInterface';

const ContactUsSchema = new Schema<IContactUs>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please fill a valid email address'
    ]
  },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactUs>('ContactUs', ContactUsSchema);
