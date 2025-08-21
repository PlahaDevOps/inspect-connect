import mongoose, { Schema } from 'mongoose';
import { ISubscriptionPlan } from '../interfaces/subscriptionPlanInterface';

// Replace with Stripe Subscription Plan JSON
const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    userType: { type: String, enum: [0,1], required: true, description: "0 = inspector, 1 = client" },
    frequency: { type: String, enum: [0,1], required: true, description: "0 = monthly, 1 = yearly" },
    description: { type: String },
    duration: { type: Number },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
