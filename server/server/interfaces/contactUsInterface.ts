import { Document } from "mongoose";

export interface IContactUs extends Document {
    name: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    message: string;
}
  