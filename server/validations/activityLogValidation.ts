import Joi from 'joi';

export const activityLogValidation = (data: any) => {
    const schema = Joi.object({
        bookingId: Joi.string().optional(),
        action: Joi.string().required().messages({
            'any.required': 'Action is required',
        }),
        service: Joi.string().required().messages({
            'any.required': 'Service is required',
        }),
        fullRequestUrl: Joi.string().required().messages({
            'any.required': 'Full request URL is required',
        }),
        date: Joi.date().required().messages({
            'any.required': 'Date is required',
        }),
    });
    return schema.validate(data);
}