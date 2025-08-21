import mongoose, { Schema } from 'mongoose';
import { IStripePayment } from '../interfaces/stripeInterface';

const StripePaymentSchema = new Schema<IStripePayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeInvoiceId: { type: String, required: true },
    stripePaymentIntentId: { type: String },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['paid', 'failed', 'action_required'], required: true },
    billingReason: { type: String, default: 'unknown' },
    invoiceNumber: { type: String },
    invoicePdf: { type: String },
    hostedInvoiceUrl: { type: String },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    attemptCount: { type: Number },
    failureCode: { type: String },
    failureMessage: { type: String },
    eventId: { type: String, required: true, unique: true },
    processedAt: { type: Date, default: Date.now },
    invoiceJson: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IStripePayment>('StripePayment', StripePaymentSchema);
