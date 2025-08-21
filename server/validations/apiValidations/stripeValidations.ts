import Joi from "joi";
import { ICheckoutSessionInput, IPaymentIntentInput, ISubscription } from "../../interfaces/stripeInterface";

export const createSubscriptionValidation = (data: ISubscription) => {
    const schema = Joi.object({
        customerId: Joi.string().required().messages({
            'any.required': 'Customer ID is required',
        }),
        planId : Joi.string().required().messages({
            'any.required': 'Plan ID is required',
        }),
        isManual: Joi.number().required().messages({
            'any.required': 'Is Manual is required',
        }), // 0 = auto, 1 = manual
    });
  
    return schema.validate(data, { abortEarly: false });
};

export const stripePaymentIntentValidation = (data: IPaymentIntentInput) => {
    const schema = Joi.object({
        subscriptionId: Joi.string().required().messages({
            'any.required': 'Subscription ID is required',
        }),
        amount: Joi.number().required().messages({
            'any.required': 'Amount is required',
        }),
        currency: Joi.string().required().messages({
            'any.required': 'Currency is required',
        }),
        isManual: Joi.number().required().messages({
            'any.required': 'Is Manual is required',
        }), // 0 = auto, 1 = manual
    });

    return schema.validate(data, { abortEarly: false})
}

export const createCheckoutSessionValidation = (data: ICheckoutSessionInput) => {
    const schema = Joi.object({
        customerId: Joi.string().required().messages({
            'any.required': 'Customer ID is required',
        }),
        priceId : Joi.string().required().messages({
            'any.required': 'Price ID is required',
        }),
        successUrl: Joi.string().required().messages({
            'any.required': 'Success URL is required',
        }),
        cancelUrl: Joi.string().required().messages({
            'any.required': 'Cancel URL is required',
        }),
    });
    return schema.validate(data, { abortEarly: false });
}
// // export const verifyPaymentValidation = (data: any) => {
//     const schema = Joi.object({
//         paymentId: Joi.string().required().messages({
//             'any.required': 'Payment ID is required',
//         }),
//     });
//     return schema.validate(data, { abortEarly: false });
// }
  