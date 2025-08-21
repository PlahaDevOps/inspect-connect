import Stripe from "stripe";
import subscriptionModel from "../../models/subscriptionModel";
import subscriptionPlanModel from "../../models/subscriptionPlanModel";
import userModel from "../../models/userModel";
import { MESSAGES } from "../../utils/constants/messages";
import { createEphemeralKey, createPaymentIntent, createSubscription, stripeCheckoutSession, stripeCreateProduct, stripeWebhook, updateStripeInvoice } from "../../utils/stripe/stripe";
import paymentModel from "../../models/paymentModel";
import { ICheckoutSessionInput, IPaymentIntentInput } from "../../interfaces/stripeInterface";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil'
});

export const createSubscriptionService = async (data: any) => {
    try {
        const { customerId, planId } = data;
        
        const user = await userModel.findOne({ stripeCustomerId: customerId });
        if(!user){
            return { error: MESSAGES.AUTH.USER_NOT_REGISTERED };
        }

        const planDetails = await subscriptionPlanModel.findOne({ _id: planId, status: 1 });
        if(!planDetails){
            return { error: MESSAGES.STRIPE.PLAN_NOT_FOUND };
        }

        const createProduct = await stripeCreateProduct(planDetails);
        if(!createProduct){
            return { error: MESSAGES.STRIPE.CREATE_PRODUCT_FAILED };
        }

        const objToSend: any = {
          customerId,
          productId: createProduct.product?.id,
          priceId: createProduct.price?.id,
          trialDays: planDetails.trialDays,
          isManual: data.isManual,
        }
        const subscription = await createSubscription(objToSend);
        if(!subscription){
            return { error: MESSAGES.STRIPE.CREATE_SUBSCRIPTION_FAILED };
        }
        const item = subscription.items?.data?.[0];
        const price = item?.price;

      const saveObj = {
        userId: user._id,
        stripeSubscriptionId: subscription.id,
        customerId: subscription.customer,
        productId: price?.product || createProduct.product?.id,
        priceId: price?.id || createProduct.price?.id,
        stripeSubscriptionStatus: subscription.status,
        collection_method: subscription.collection_method,
        start_date: (subscription as any).start_date,
        current_period_start: (subscription as any).current_period_start,
        current_period_end: (subscription as any).current_period_end,
        trial_start: (subscription as any).trial_start,
        trial_end: (subscription as any).trial_end,
        amount: price?.unit_amount || 0,
        currency: price?.currency || "usd",
        interval: price?.recurring?.interval || "month",
        intervalCount: price?.recurring?.interval_count || 1,
        latestInvoiceId: typeof subscription.latest_invoice === "object" && subscription.latest_invoice !== null
          ? (subscription.latest_invoice as any).id || null
          : null,
        latestInvoiceUrl: typeof subscription.latest_invoice === "object" && subscription.latest_invoice !== null
          ? (subscription.latest_invoice as any).hosted_invoice_url || null
          : null,
        latestInvoicePdf: typeof subscription.latest_invoice === "object" && subscription.latest_invoice !== null
          ? (subscription.latest_invoice as any).invoice_pdf || null
          : null,
        livemode: subscription.livemode,
        metadata: subscription.metadata || {},
        subscriptionJson: JSON.stringify(subscription), // full raw object for reference
      };

      await subscriptionModel.create(saveObj);
      await userModel.updateOne({ _id: user._id },
        {
          $set: {
            currentSubscriptionId: subscription.id,
            subscriptionStatus: 'active',
            currentSubscriptionTrialDays: planDetails.trialDays,
          }
        }
      );

      return subscription;
    } catch (error) {
        console.error('Create subscription service error:', error);
        return { error: MESSAGES.STRIPE.CREATE_SUBSCRIPTION_FAILED };
    }
}

export const stripePaymentIntentService = async (data: IPaymentIntentInput) => {
    try{
      const userDetail = await userModel.findOne({ _id: data.userId });
      if(!userDetail){
        return { error: MESSAGES.AUTH.USER_NOT_FOUND };
      }

			// const ephemeralKey = await createEphemeralKey(userDetail.stripeCustomerId as string);
      
      const reterievedSubscription = await subscriptionModel.findOne({ stripeSubscriptionId: userDetail.currentSubscriptionId });
      if(!reterievedSubscription){
        return { error: MESSAGES.STRIPE.SUBSCRIPTION_NOT_FOUND };
      }

      const objToSend: IPaymentIntentInput = {
        customerId: reterievedSubscription.customerId,
        amount: reterievedSubscription.amount,
        currency: reterievedSubscription.currency,
        invoiceId: reterievedSubscription.latestInvoiceId,
      }

			const paymentIntent = await createPaymentIntent(objToSend);
      if(!paymentIntent){
        return { error: MESSAGES.STRIPE.STRIPE_PAYMENT_INTENT_FAILED };
      }

      // const updateInvoiceData = {
      //   invoiceId: paymentIntent.invoice,
      //   paymentIntentId: paymentIntent.id
      // }

      // const updateSubscriptionInvoice = updateStripeInvoice(updateInvoiceData)

      console.log(paymentIntent, "paymentIntent");

			// let result = {
			// 	paymentIntent: paymentIntent.client_secret,
			// 	ephemeralKey: ephemeralKey.secret,
			// 	customer: userDetail.stripeCustomerId,
			// 	publishableKey: process.env.STRIPE_PK_KEY,
			// 	transactionId: paymentIntent.id,
			// 	created: paymentIntent.created,
			// };
      
			// let objToSave = {
			// 	userId: userDetail._id,
      //   subscriptionId: (paymentIntent as any).subscription || null,
			// 	amount: data.amount,
			// 	transactionId: paymentIntent.id,
			// 	date: Math.floor(Date.now() / 1000),
      //   stripeChargeEachTransaction: 0.027 * data.amount,
			// };

			// await paymentModel.create(objToSave);
			return paymentIntent;
    } catch(error){
        console.error('Stripe webhook service error:', error);
        return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
    }

};

export const createCheckoutSessionService = async (data: ICheckoutSessionInput) => {
  try{
    const session = await stripeCheckoutSession(data);
    if(!session){
      return { error: MESSAGES.STRIPE.CREATE_CHECKOUT_SESSION_FAILED };
    }

    return session;
  } catch(error){
    console.error('Create checkout session service error:', error);
    return { error: MESSAGES.STRIPE.CREATE_CHECKOUT_SESSION_FAILED };
  }
}

export const stripeWebhookService = async (rawBody: Buffer, sig: string) => {
  try {
    const event = stripeWebhook(rawBody, sig);
    if (!event) {
      return { error: MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED };
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const user = await userModel.findOne({ stripeCustomerId: session.customer });
        if (!user) return { error: "User not found" };
    
        const subscriptionId = session.subscription || null;
    
        const paymentData = {
          userId: user._id,
          stripeCheckoutSessionId: session.id,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: session.customer as string,
          amount: session.amount_total || 0,
          currency: session.currency || "usd",
          status: "paid",
          paymentStatus: session.payment_status || "paid",
          paymentIntentId: session.payment_intent || null,
          invoiceUrl: session.invoice ? session.invoice.hosted_invoice_url : null,
          processedAt: new Date(),
          sessionJson: JSON.stringify(session),
        };
    
        try {
          await paymentModel.create(paymentData);
        } catch (paymentError) {
          console.error("Error creating payment record:", paymentError);
        }
    
        if (subscriptionId) {
          await subscriptionModel.updateOne(
            { stripeSubscriptionId: subscriptionId },
            {
              $set: {
                stripeSubscriptionStatus: "active",
                latestSessionId: session.id,
                currentPeriodStart: session.subscription_details?.current_period_start,
                currentPeriodEnd: session.subscription_details?.current_period_end,
              },
            }
          );
        }
    
        await userModel.updateOne(
          { _id: user._id },
          { $set: { stripeSubscriptionStatus: "active" } }
        );
        break;
      }
    
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as any;
        const user = await userModel.findOne({ stripeCustomerId: session.customer });
        if (!user) return { error: "User not found" };
    
        try {
          await paymentModel.create({
            userId: user._id,
            stripeCheckoutSessionId: session.id,
            stripeSubscriptionId: session.subscription || null,
            stripeCustomerId: session.customer,
            amount: session.amount_total || 0,
            currency: session.currency || "usd",
            status: "failed",
            paymentStatus: session.payment_status,
            paymentIntentId: session.payment_intent || null,
            processedAt: new Date(),
            sessionJson: JSON.stringify(session),
          });
        } catch (paymentError) {
          console.error("Error creating failed payment record:", paymentError);
        }
    
        await userModel.updateOne(
          { _id: user._id },
          { $set: { stripeSubscriptionStatus: "failed" } }
        );
        break;
      }
    
      case "invoice.payment_succeeded":
        const invoice = event.data.object as any;

        const user = await userModel.findOne({ stripeCustomerId: invoice.customer });
        if (!user) {
          return { error: MESSAGES.AUTH.USER_NOT_FOUND };
        }

        const subscriptionId = invoice.subscription || null;

        const paymentData = {
          userId: user._id,
          stripeInvoiceId: invoice.id,
          stripePaymentIntentId: invoice.payment_intent || null,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: invoice.customer as string,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'paid',
          billingReason: invoice.billing_reason || 'unknown',
          invoiceNumber: invoice.number || '',
          invoicePdf: invoice.invoice_pdf || '',
          hostedInvoiceUrl: invoice.hosted_invoice_url || '',
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          attemptCount: invoice.attempt_count,
          eventId: event.id,
          processedAt: new Date(),
          invoiceJson: JSON.stringify(invoice),
        };

        try {
          await paymentModel.create(paymentData);
        } catch (paymentError) {
          console.error("Error creating payment record:", paymentError);
        }

        if (subscriptionId) {
          await subscriptionModel.updateOne(
            { stripeSubscriptionId: subscriptionId },
            { $set: { stripeSubscriptionStatus: 'active' } }
          );
        }

        await userModel.updateOne(
          { _id: user._id },
          { $set: { stripeSubscriptionStatus: 'active' } }
        );

        break;
      case "invoice.payment_failed":
        const invoiceFailed = event.data.object as any;
        const userFailed = await userModel.findOne({ stripeCustomerId: invoiceFailed.customer });
        if (!userFailed) {
          return { error: MESSAGES.AUTH.USER_NOT_FOUND };
        }

        const failedPaymentData = {
          userId: userFailed._id,
          stripeInvoiceId: invoiceFailed.id,
          stripePaymentIntentId: invoiceFailed.payment_intent || null,
          stripeSubscriptionId: invoiceFailed.subscription || null,
          stripeCustomerId: invoiceFailed.customer as string,
          amount: invoiceFailed.amount_due,
          currency: invoiceFailed.currency,
          status: 'failed',
          billingReason: invoiceFailed.billing_reason || 'unknown',
          attemptCount: invoiceFailed.attempt_count,
          failureCode: invoiceFailed.last_finalization_error?.code || 'unknown',
          failureMessage: invoiceFailed.last_finalization_error?.message || 'Payment failed',
        }

        try {
          await paymentModel.create(failedPaymentData);
        } catch (paymentError) {
          console.error("Error creating failed payment record:", paymentError);
        }

        await userModel.updateOne(
          { _id: userFailed._id },
          { $set: { stripeSubscriptionStatus: 'failed' } }
        );
        break;
      case "invoice.payment_action_required":
        const invoiceActionRequired = event.data.object as any;
        const userActionRequired = await userModel.findOne({ stripeCustomerId: invoiceActionRequired.customer });
        if (!userActionRequired) {
          return { error: MESSAGES.AUTH.USER_NOT_FOUND };
        }

        const actionRequiredPaymentData = {
          userId: userActionRequired._id,
          stripeInvoiceId: invoiceActionRequired.id,
          stripePaymentIntentId: invoiceActionRequired.payment_intent || null,
          stripeSubscriptionId: invoiceActionRequired.subscription || null,
          amount: invoiceActionRequired.amount_due,
          currency: invoiceActionRequired.currency,
          status: 'action_required',
          billingReason: invoiceActionRequired.billing_reason || 'unknown',
          attemptCount: invoiceActionRequired.attempt_count,
          eventId: event.id,
          processedAt: new Date(),
        }
        try {
          await paymentModel.create(actionRequiredPaymentData);
        } catch (paymentError) {
          console.error("Error creating action required payment record:", paymentError);
        }

        await userModel.updateOne(
          { _id: userActionRequired._id },
          { $set: { stripeSubscriptionStatus: 'action_required' } }
        );

        await userModel.updateOne(
          { _id: userActionRequired._id },
          { $set: { stripeSubscriptionStatus: 'action_required' } }
        );
        break;
      case "customer.subscription.updated":
        const subscription = event.data.object as any;
        const userSubscriptionUpdated = await userModel.findOne({ stripeCustomerId: subscription.customer });
        if (!userSubscriptionUpdated) {
          return { error: MESSAGES.AUTH.USER_NOT_FOUND };
        }
        const subscriptionData = {
          stripeSubscriptionStatus: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
        };
        await subscriptionModel.updateOne(
          { stripeSubscriptionId: subscription.id },
          { $set: subscriptionData }
        );
        await userModel.updateOne(
          { _id: userSubscriptionUpdated._id },
          { $set: { stripeSubscriptionStatus: subscription.status } }
        );
        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as any;
        const userSubscriptionDeleted = await userModel.findOne({ stripeCustomerId: subscriptionDeleted.customer });
        if (!userSubscriptionDeleted) {
          return { error: MESSAGES.AUTH.USER_NOT_FOUND };
        }
        await subscriptionModel.updateOne(
          { stripeSubscriptionId: subscriptionDeleted.id },
          { $set: { stripeSubscriptionStatus: 'canceled' } }
        );
        await userModel.updateOne(
          { _id: userSubscriptionDeleted._id },
          { $set: { stripeSubscriptionStatus: 'canceled' } }
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }    

    // switch (event.type) {
    //   case 'invoice.payment_succeeded': {
    //     const invoice = event.data.object as any;
    //     const user = await userModel.findOne({ stripeCustomerId: invoice.customer });
    //     if (!user) {
    //       return { error: MESSAGES.AUTH.USER_NOT_FOUND };
    //     }
        
    //     const subscriptionId = invoice.subscription || 
    //                           invoice.parent?.subscription_details?.subscription || 
    //                           null;
        
    //     const paymentData = {
    //       userId: user._id,
    //       stripeInvoiceId: invoice.id,
    //       stripePaymentIntentId: invoice.payment_intent || null,
    //       stripeSubscriptionId: subscriptionId,
    //       stripeCustomerId: invoice.customer as string,
    //       amount: invoice.amount_paid,
    //       currency: invoice.currency,
    //       status: 'paid',
    //       billingReason: invoice.billing_reason || 'unknown',
    //       invoiceNumber: invoice.number || '',
    //       invoicePdf: invoice.invoice_pdf || '',
    //       hostedInvoiceUrl: invoice.hosted_invoice_url || '',
    //       periodStart: new Date(invoice.period_start * 1000),
    //       periodEnd: new Date(invoice.period_end * 1000),
    //       attemptCount: invoice.attempt_count,
    //       eventId: event.id,
    //       processedAt: new Date(),
    //       invoiceJson: JSON.stringify(invoice),
    //     };
        
    //     try {
    //       await paymentModel.create(paymentData);
    //     } catch (paymentError) {
    //       console.error("Error creating payment record:", paymentError);
    //     }

    //     if (subscriptionId) {
    //       const updateSubscription : any = await subscriptionModel.updateOne(
    //         { stripeSubscriptionId: subscriptionId },
    //         { 
    //           $set: { 
    //             stripeSubscriptionStatus: 'active',
    //             latestInvoiceId: invoice.id,
    //             latestInvoiceUrl: invoice.hosted_invoice_url,
    //             latestInvoicePdf: invoice.invoice_pdf,
    //             currentPeriodStart: invoice.period_start,
    //             currentPeriodEnd: invoice.period_end,
    //           }
    //         }
    //       );
    //     }

    //     const updateUser : any = await userModel.updateOne(
    //       { _id: user._id },
    //       { 
    //         $set: { 
    //           stripeSubscriptionStatus: 'active',
    //         }
    //       }
    //     );
    //     break;
    //   }

    //   case 'invoice.payment_failed': {
    //     const invoice = event.data.object as any;
    //     const user = await userModel.findOne({ stripeCustomerId: invoice.customer });
    //     if (!user) {
    //       return { error: MESSAGES.AUTH.USER_NOT_FOUND };
    //     }

    //     const failedPaymentData = {
    //       userId: user._id,
    //       stripeInvoiceId: invoice.id,
    //       stripePaymentIntentId: invoice.payment_intent || null,
    //       stripeSubscriptionId: invoice.subscription || null,
    //       stripeCustomerId: invoice.customer as string,
    //       amount: invoice.amount_due,
    //       currency: invoice.currency,
    //       status: 'failed',
    //       billingReason: invoice.billing_reason || 'unknown',
    //       attemptCount: invoice.attempt_count,
    //       failureCode: invoice.last_finalization_error?.code || 'unknown',
    //       failureMessage: invoice.last_finalization_error?.message || 'Payment failed',
    //       eventId: event.id,
    //       processedAt: new Date(),
    //       invoiceJson: JSON.stringify(invoice),
    //     };

    //     try {
    //       await paymentModel.create(failedPaymentData);
    //     } catch (paymentError) {
    //       console.error("Error creating failed payment record:", paymentError);
    //     }
        
    //     await userModel.updateOne(
    //       { _id: user._id },
    //       { 
    //         $set: { 
    //           stripeSubscriptionStatus: 'failed',
    //         }
    //       }
    //     );
    //     break;
    //   }

    //   case 'invoice.payment_action_required': {
    //     const invoice = event.data.object as any;

    //     const user = await userModel.findOne({ stripeCustomerId: invoice.customer });
    //     if (!user) {
    //       return { error: 'User not found' };
    //     }

    //     try {
    //       await paymentModel.create({
    //         userId: user._id,
    //         stripeInvoiceId: invoice.id,
    //         stripePaymentIntentId: invoice.payment_intent || null,
    //         stripeSubscriptionId: invoice.subscription || null,
    //         stripeCustomerId: invoice.customer,
    //         amount: invoice.amount_due,
    //         currency: invoice.currency,
    //         status: 'action_required',
    //         billingReason: invoice.billing_reason || 'unknown',
    //         attemptCount: invoice.attempt_count,
    //         eventId: event.id,
    //         processedAt: new Date(),
    //         invoiceJson: JSON.stringify(invoice),
    //       });
    //     } catch (paymentError) {
    //       console.error("Error creating action required payment record:", paymentError);
    //     }
        
    //     await userModel.updateOne(
    //       { _id: user._id },
    //       { 
    //         $set: { 
    //           stripeSubscriptionStatus: 'action_required',
    //         }
    //       }
    //     );
    //     break;
    //   }

    //   case 'customer.subscription.updated': {
    //     const subscription = event.data.object as any;
        
    //     const subscriptionData = {
    //       stripeSubscriptionStatus: subscription.status,
    //       currentPeriodStart: subscription.current_period_start,
    //       currentPeriodEnd: subscription.current_period_end,
    //     };
        
    //     await subscriptionModel.updateOne(
    //       { stripeSubscriptionId: subscription.id },
    //       { $set: subscriptionData }
    //     );

    //     await userModel.updateOne(
    //       { stripeCustomerId: subscription.customer },
    //       { 
    //         $set: {
    //           subscriptionStatus: subscription.status,
    //           currentSubscriptionId: subscription.id,
    //         }
    //       }
    //     );
    //     break;
    //   }

    //   case 'customer.subscription.deleted': {
    //     const subscription = event.data.object as any;
    //     await subscriptionModel.updateOne(
    //       { stripeSubscriptionId: subscription.id },
    //       { 
    //         $set: { 
    //           stripeSubscriptionStatus: subscription.status,
    //         }
    //       }
    //     );
        
    //     await userModel.updateOne(
    //       { stripeCustomerId: subscription.customer },
    //       { 
    //         $set: { 
    //           stripeSubscriptionStatus: subscription.status,
    //         }
    //       }
    //     );
    //     break;
    //   }

    //   default:
    // }

    return { received: true, eventType: event.type };
  } catch (error) {
    console.error('Stripe webhook service error:', error);
    return { error: MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED };
  }
};