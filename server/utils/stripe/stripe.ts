import Stripe from "stripe";
import dotenv from 'dotenv';
import path from "path";
import { MESSAGES } from "../constants/messages";
import { ICheckoutSessionInput, IPaymentIntentInput, ISubscription, ISubscriptionInput, IUpdateStripeInvoiceInput } from "../../interfaces/stripeInterface";
dotenv.config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`)
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil'
});
export const createCustomer = async (email: string): Promise<string> => {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      return customers.data[0].id;
    }
    const customer = await stripe.customers.create({ email });
    return customer.id;
};

export const stripeCreateProduct = async (planDetails: any) => {
    const product = await stripe.products.create({
      name: planDetails.name,
      description: planDetails.description,
      metadata: {
        planId: planDetails._id.toString(),
      },
    });

    let price;
    if(product){
      const interval = planDetails.frequencyInterval === 0 ? "month" : "year";
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(planDetails.price * 100),
        currency: planDetails.currency,
        recurring: { interval: interval, interval_count: 1 },
      });
    }

    return { product, price };

};

export const stripeExistingProduct = async (name: string) => {
  const products = await stripe.products.list({ active: true });
  const existingProduct = products.data.find(p => p.name === name);
  return existingProduct;
};

export const createSubscription = async (data: ISubscriptionInput) => {
  const objToSend: Stripe.SubscriptionCreateParams = {
    customer: data.customerId || "",
    items: [{ price: data.priceId || "" }],
    ...(data.trialDays && data.trialDays > 0
      ? { trial_period_days: data.trialDays }
      : {}),
    payment_behavior: data.isManual == 0 ? "allow_incomplete" : "default_incomplete",
    collection_method: data.isManual == 0 ? "send_invoice" : "charge_automatically",
    ...(data.isManual == 0 && { days_until_due: data.trialDays || 7 }),
    expand: ["latest_invoice.payment_intent"],
  }

  const subscription = await stripe.subscriptions.create(objToSend);
  return subscription;
};

export const createEphemeralKey = async (customerId: string) => {
  return await stripe.ephemeralKeys.create(
    { customer: customerId }
  );
};

export const createPaymentIntent = async (data: IPaymentIntentInput) => {
  return await stripe.paymentIntents.create({
    amount: (data.amount || 0) * 100,
    currency: data.currency || "usd",
    customer: data.customerId,
    description: `Payment for invoice ${data.invoiceId || ""}`,
    metadata: { invoice_id: data.invoiceId || "" },
    automatic_payment_methods: { enabled: true },
  });
};

export const updateStripeInvoice = async ( data: IUpdateStripeInvoiceInput) => {
  await stripe.invoices.update(data.invoiceId, {
    default_payment_method: data.paymentMethodId,
  });

  await stripe.invoices.pay(data.invoiceId);
}

export const stripeCheckoutSession = async (data: ICheckoutSessionInput) => {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: data.customerId,
    payment_method_types: ['card'],
    line_items: [{ price: data.priceId, quantity: 1 }],
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
  });
}
// export const createSetupIntent = async (customerId: string) => {
//     return await stripe.setupIntents.create({
//       customer: customerId,
//     });
// };

export const stripeWebhook = (rawBody: Buffer, sig: string) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET_KEY as string;
  if (!secret) {
      throw new Error(MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED);
  }
  
  try {
      const event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    return event;
  } catch (error) {
    console.error(MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED, error);
    throw error;
  }
};

// export const requireActiveAccount = async (req, res, next) => {
//     const user = await userModel.findById(req.user.id);
//     if (user.accountStatus !== "active" && user.accountStatus !== "trial") {
//       return res.status(403).json({ error: "Account inactive. Please renew subscription." });
//     }
//     next();
//   };
  

// export const createCheckoutSession = async (req, res) => {
//     try {
//       const { customerId } = req.body;
  
//       const session = await stripe.checkout.sessions.create({
//         customer: customerId,
//         payment_method_types: ["card"],
//         line_items: [
//           {
//             price: process.env.STRIPE_BASIC_PRICE_ID, // your paid plan price ID
//             quantity: 1,
//           },
//         ],
//         mode: "subscription",
//         success_url: `${process.env.FRONTEND_URL}/success`,
//         cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//       });
  
//       res.json({ url: session.url });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Unable to create checkout session" });
//     }
//   };
  

// steps to do 
// Signup → Create Stripe customer and subscription with trial.

// Trial ends → Subscription moves to past_due or incomplete status.

// Webhook catches status change → you flag their account as inactive in DB.

// User tries to log in → you see inactive flag → redirect them to your payment page (Stripe Checkout).

// When payment is successful → webhook updates status to active.