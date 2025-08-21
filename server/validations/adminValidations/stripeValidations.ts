import Joi from "joi";

export const createSubscriptionPlanValidation = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        description: Joi.string().required().messages({
            'any.required': 'Description is required',
        }),
        amount: Joi.number().required().messages({
            'any.required': 'Amount is required',
        }),
        currency: Joi.string().required().messages({
            'any.required': 'Currency is required',
        }),
        trialDays: Joi.number().required().messages({
            'any.required': 'Trial days is required',
        }),
        userType: Joi.number().required().messages({
            'any.required': 'User type is required',
        }),
        interval: Joi.number().required().messages({
            'any.required': 'Interval is required',
        }),
        intervalCount: Joi.number().required().messages({
            'any.required': 'Interval count is required',
        }),
    });
    return schema.validate(data, { abortEarly: false });
};
