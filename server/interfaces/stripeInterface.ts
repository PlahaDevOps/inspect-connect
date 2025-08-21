import mongoose, { Document } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  stripeSubscriptionId: string;
  customerId: string;
  stripeSubscriptionStatus: string;
  collectionMethod?: string;
  startDate?: number;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  trialStart?: number;
  trialEnd?: number;
  planId: string;
  productId: string;
  priceId: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  latestInvoiceUrl?: string;
  latestInvoicePdf?: string;
  latestInvoiceId?: string;
  livemode?: boolean;
  metadata?: Record<string, any>;
  subscriptionJson?: string;
}

export interface ISubscriptionInput {
  customerId?: string;
  priceId?: string;
  productId?: string;
  trialDays?: number;
  isManual?: number;
}

export interface ISubscriptionPlan extends Document {
    name: string;
    description: string;
    amount: number;
    currency: string;
    trialDays: number;
    userType: number;
    interval: number;
    intervalCount: number;
    status: number;
}

export interface IStripePayment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  stripeInvoiceId: string;
  stripePaymentIntentId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'action_required';
  billingReason: string;
  invoiceNumber?: string;
  invoicePdf?: string;
  hostedInvoiceUrl?: string;
  periodStart?: Date;
  periodEnd?: Date;
  attemptCount?: number;
  failureCode?: string;
  failureMessage?: string;
  eventId: string;
  processedAt: Date;
  invoiceJson: string;
}

export interface IPaymentIntentInput {
  userId?: string;
  customerId?: string;
  amount?: number;
  currency?: string;
  paymentMethodId?: string;
  invoiceId?: string;
  // isManual: number;
}

export interface IUpdateStripeInvoiceInput {
  invoiceId: string;
  paymentMethodId: string;
}

export interface ICheckoutSessionInput {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}