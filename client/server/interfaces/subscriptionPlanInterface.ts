import { Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    userType: string;
    frequency: string;
    description: string;
    duration: number;
    status: number;
}