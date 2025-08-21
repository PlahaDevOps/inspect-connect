import { Request, Response } from "express";
import * as helper from '../../utils/helpers';
import * as stripeValidations from '../../validations/apiValidations/stripeValidations';
import * as stripeServices from '../../services/apiServices/stripeService';
import { MESSAGES } from "../../utils/constants/messages";
import userModel from "../../models/userModel";
import { IPaymentIntentInput } from "../../interfaces/stripeInterface";

export const createSubscription = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { error, value: validatedData } = stripeValidations.createSubscriptionValidation(req.body);
      if (error) {
        return helper.failed(res, error.details[0].message);
      }

      const result = await stripeServices.createSubscriptionService(validatedData);
  
      if ('error' in result) {
        return helper.failed(res, result?.error as string);
      }

      return helper.success(res, MESSAGES.STRIPE.CREATE_SUBSCRIPTION_SUCCESS, result);
    } catch (error) {
      console.error('Create subscription controller error:', error);
      return helper.error(res, MESSAGES.STRIPE.CREATE_SUBSCRIPTION_FAILED);
    }
};

export const stripePaymentIntent = async (req: any, res: Response): Promise<Response | void> => {
  try {
    // const { error, value: validatedData } = stripeValidations.stripePaymentIntentValidation(req.body);
    // if (error) {
    //   return helper.failed(res, error.details[0].message);
    // }

    const objToSend: IPaymentIntentInput = {
      userId: req.user._id,
    }
    const result = await stripeServices.stripePaymentIntentService(objToSend);
    if ('error' in result) {
      return helper.failed(res, result?.error as string);
    }

    return helper.success(res, MESSAGES.STRIPE.STRIPE_PAYMENT_INTENT_SUCCESS, result);
  } catch (error) {
    console.error('Stripe payment intent controller error:', error);
    return helper.error(res, MESSAGES.STRIPE.STRIPE_PAYMENT_INTENT_FAILED);
  }
}

export const createCheckoutSession = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = stripeValidations.createCheckoutSessionValidation(req.body);
    if(error){
      return helper.failed(res, error.details[0].message);
    }
    const result = await stripeServices.createCheckoutSessionService(validatedData);
    if('error' in result){
      return helper.failed(res, result?.error as string);
    }
    return helper.success(res, MESSAGES.STRIPE.CREATE_CHECKOUT_SESSION_SUCCESS, result);
  } catch(error){
    console.error('Create checkout session controller error:', error);
    return helper.error(res, MESSAGES.STRIPE.CREATE_CHECKOUT_SESSION_FAILED);
  }
}
// export const verifyPayment = async (req: any, res: Response): Promise<Response | void> => {
//   try {
//     const { error, value: validatedData } = stripeValidations.verifyPaymentValidation(req.body);
//     if (error) {
//       return helper.failed(res, error.details[0].message);
//     }
//   } catch (error) {
// }

// export const getClientSecret = async (req: any, res: Response): Promise<Response | void> => {
//   try {
//     if(!req.user){
//       return helper.failed(res, MESSAGES.AUTH.USER_NOT_REGISTERED);
//     }

//     const customerId = req.user.stripeCustomerId;

//     const result = await stripeServices.createSetupIntentService(customerId);

//     if ('error' in result) {
//       return helper.failed(res, result?.error as string);
//     }

//     return helper.success(res, MESSAGES.STRIPE.GET_CLIENT_DATA_SUCCESS, result);
//   } catch (error) {
//     console.error('Get client secret controller error:', error);
//     return helper.error(res, MESSAGES.STRIPE.GET_CLIENT_DATA_FAILED);
//   }
// };

export const stripeWebhook = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      return helper.failed(res, MESSAGES.STRIPE.STRIPE_WEBHOOK_SIGNATURE_MISSING);
    }

    const result = await stripeServices.stripeWebhookService(req.body, sig);

    if ('error' in result) {
      return helper.failed(res, result.error as string);
    }

    return helper.success(res, MESSAGES.STRIPE.STRIPE_WEBHOOK_SUCCESS, result);
  } catch (error) {
    console.error('Stripe webhook controller error:', error);
    return helper.error(res, MESSAGES.STRIPE.STRIPE_WEBHOOK_FAILED);
  }
};
