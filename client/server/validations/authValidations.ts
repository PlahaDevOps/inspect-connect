import Joi from 'joi';
import { IUser } from '../interfaces/userInterface';

export const signInValidation = (data: { email: string; password: string }) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .required()
      .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const signUpValidation = (data: IUser) => {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address',
        'any.required': 'Email is required',
      }),

    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
      }),

    role: Joi.number().valid(0, 1, 2).required().messages({
      'any.only': 'Role must be one of 0 (admin), 1 (client), 2 (inspector)',
      'any.required': 'Role is required',
    }),

    name: Joi.string().required().messages({
      'any.required': 'Name is required',
    }),

    phoneNumber: Joi.string().required().messages({
      'any.required': 'Phone number is required',
    }),

    countryCode: Joi.string().required().messages({
      'any.required': 'Country code is required',
    }),

    country: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.string().required().messages({
        'any.required': 'Country is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),

    state: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.string().required().messages({
        'any.required': 'State is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),

    city: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.string().required().messages({
        'any.required': 'City is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),

    zip: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.string().required().messages({
        'any.required': 'ZIP code is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),

    mailingAddress: Joi.string().required().messages({
      'any.required': 'Mailing address is required',
    }),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      locationName: Joi.string().optional(),
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .messages({
          'array.length': 'Coordinates must be an array of two numbers [longitude, latitude]',
        }),
    }).required(),
    // fields for inspector
    certificateTypeId: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.string().required().messages({
        'any.required': 'Certificate Type ID is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),
    certificateAgencyIds: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.array().items(Joi.string()).min(1).required().messages({
        'any.required': 'Certificate Agency ID is required for inspectors',
      }),
      otherwise: Joi.string().optional(),
    }),

    certificateDocuments: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'At least one certificate document is required for inspectors',
        'any.required': 'Certificate documents are required for inspectors',
      }),
      otherwise: Joi.array().items(Joi.string()).optional(),
    }),

    certificateExpiryDate: Joi.alternatives().conditional('role', {
      is: 2,
      then: Joi.date().required().messages({
        'any.required': 'Certificate expiry date is required for inspectors',
      }),
      otherwise: Joi.date().optional(),
    }),

    uploadedIdOrLicenseDocument: Joi.string().optional(),
    referenceDocuments: Joi.array().items(Joi.string()).optional(),
    workHistoryDescription: Joi.string().optional(),
    profileImage: Joi.string().optional(),
    agreedToTerms: Joi.boolean().required().messages({
      'any.required': 'You must agree to the terms and conditions',
    }),
    isTruthfully: Joi.boolean().required().messages({
      'any.required': 'All the information provided is true and correct',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const verifyOtpValidation = (data: { otp: string }) => {

  const schema = Joi.object({
    phoneOtp: Joi.string().required().messages({
      'any.required': 'OTP is required',
    }),
    phoneNumber: Joi.string().required().messages({
      'any.required': 'Phone number is required',
    }),
    countryCode: Joi.string().required().messages({
      'any.required': 'Country code is required',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const resendOtpValidation = (data: { phoneNumber: string, countryCode: string }) => {

  const schema = Joi.object({
    phoneNumber: Joi.string().required().messages({
      'any.required': 'Phone number is required',
    }),
    countryCode: Joi.string().required().messages({
      'any.required': 'Country code is required',
    }),
  });

  return schema.validate(data, { abortEarly: false });
}

export const forgotPasswordValidation = (data: { email: string }) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  });

  return schema.validate(data, { abortEarly: false });
}

export const resetPasswordValidation = (data: { encryptedEmail: string, resetPasswordToken: string, password: string }) => {
  const schema = Joi.object({
    encryptedEmail: Joi.string().required().messages({
      'any.required': 'Email is required',
    }),
    resetPasswordToken: Joi.string().required().messages({
      'any.required': 'Reset password token is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    })
  });

  return schema.validate(data, { abortEarly: false });
}