import mongoose, { Schema } from 'mongoose';
import { ISubscriptionPlan } from '../interfaces/stripeInterface';

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    trialDays: { type: Number, required: true },
    userType: { type: Number, enum: [0,1], required: true, description: "0 = inspector, 1 = client" },
    interval: { type: Number, enum: [0, 1], required: true, description: "0 = monthly, 1 = yearly" },
    intervalCount: { type: Number, required: true },
    status: { type: Number, enum: [0,1], default: 1, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
