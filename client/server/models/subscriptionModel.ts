import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../interfaces/subscriptionInterface';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    paymentAmount: { type: Number, required: true },
    paymentCurrency: { type: String, required: true },
    status: { type: Number, enum: [0,1], default: 0, description: "0 = inactive, 1 = active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
