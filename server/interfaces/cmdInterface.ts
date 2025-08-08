import { Document } from "mongoose";

export interface ICms extends Document {
    title: string;
    description: string;
    role: number;
}
  