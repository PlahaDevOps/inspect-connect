import mongoose, { Document } from "mongoose";

export interface ISubscription extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    subscriptionPlanId: mongoose.Schema.Types.ObjectId;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: Date;
    paymentAmount: number;
    paymentCurrency: string;
    paymentTransactionId: string;
    paymentTransactionStatus: string;
    status: number;
}