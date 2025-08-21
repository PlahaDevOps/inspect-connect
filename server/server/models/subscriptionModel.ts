import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../interfaces/stripeInterface';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripeSubscriptionId: { type: String, required: true },
    customerId: { type: String, required: true },
    productId: { type: String, required: true }, // Plan ID
    priceId: { type: String, required: true },
    stripeSubscriptionStatus: { type: String, required: true },
    collectionMethod: { type: String },
    startDate: { type: Number },
    currentPeriodStart: { type: Number },
    currentPeriodEnd: { type: Number },
    trialStart: { type: Number },
    trialEnd: { type: Number },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    interval: { type: String, required: true }, // month, year
    intervalCount: { type: Number, required: true },
    latestInvoiceUrl: { type: String },
    latestInvoicePdf: { type: String },
    latestInvoiceId: { type: String },
    livemode: { type: Boolean, default: false },
    metadata: { type: Map, of: String },
    subscriptionJson: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
