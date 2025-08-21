import { Request, Response } from 'express';
import * as helper from '../helpers/commonHelpers';
import * as authServices from '../services/authService';
import * as authValidations from '../validations/authValidations';
import { MESSAGES } from '../helpers/constants/messages';

export const signUp = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData  } = authValidations.signUpValidation(req.body);

    if (error) {
      return helper.failed(res, error.details[0].message);
    }

    const result = await authServices.signUpService(validatedData);

    if ('error' in result) {
      return helper.failed(res, result.error);
    }

    return helper.success(
      res,
      MESSAGES.AUTH.SIGN_UP_SUCCESS,
      result
    );
  } catch (error) {
    console.error('Sign-up controller error:', error);
    return helper.error(res, MESSAGES.AUTH.SIGN_UP_FAILED);
  }
};

export const signIn = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = authValidations.signInValidation(req.body);
    if (error) {
      return helper.failed(res, error.details[0].message);
    }
    const result = await authServices.signInService(validatedData);

    if ('error' in result) {
      return helper.failed(res, result?.error);
    }
    return helper.success(res, MESSAGES.AUTH.SIGN_IN_SUCCESS, result);
  } catch (error) {
    console.error('Sign-in controller error:', error);
    return helper.error(res, MESSAGES.AUTH.SIGN_IN_FAILED);
  }
};

export const fileUpload = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    if (!req.files || !req.files.file) {
      return helper.failed(res, MESSAGES.AUTH.FILE_NOT_FOUND);
    }
    const result = await authServices.fileUploadService(req.files.file);

    if ('error' in result) {
      return helper.failed(res, result.error);
    }
    return helper.success(res, MESSAGES.AUTH.FILE_UPLOAD_SUCCESS, result);
  } catch (error) {
    console.error('File Upload controller error:', error);
    return helper.error(res, MESSAGES.AUTH.FILE_UPLOAD_FAILED);
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = authValidations.verifyOtpValidation(req.body);
    if (error) {
      return helper.failed(res, error.details[0].message);
    }

    const result = await authServices.verifyOtpService(validatedData);
    if ('error' in result) {
      return helper.failed(res, result.error);
    }

    return helper.success(res, MESSAGES.AUTH.VERIFY_OTP_SUCCESS, result);
  } catch (error) {
    console.error('Verify OTP controller error:', error);
    return helper.error(res, MESSAGES.AUTH.VERIFY_OTP_FAILED);
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = authValidations.resendOtpValidation(req.body);
    if (error) {
      return helper.failed(res, error.details[0].message);
    }

    const objToSend = {
      userId: (req as any).user?._id,
      phoneNumber: validatedData.phoneNumber,
      countryCode: validatedData.countryCode,
    }

    const result = await authServices.resendOtpService(objToSend);
    if ('error' in result) {
      return helper.failed(res, result.error);
    }
    
    return helper.success(res, MESSAGES.AUTH.RESEND_OTP_SUCCESS, result);
  } catch (error) {
    console.error('Resend OTP controller error:', error);
    return helper.error(res, MESSAGES.AUTH.RESEND_OTP_FAILED);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = authValidations.forgotPasswordValidation(req.body);
    if (error) {
      return helper.failed(res, error.details[0].message);
    }

    const result = await authServices.forgotPasswordService(validatedData);

    if ('error' in result) {
      return helper.failed(res, result.error);
    }

    return helper.success(res, MESSAGES.AUTH.FORGOT_PASSWORD_SUCCESS, result);
  } catch (error) {
    console.error('Forgot password controller error:', error);
    return helper.error(res, MESSAGES.AUTH.FORGOT_PASSWORD_FAILED);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { error, value: validatedData } = authValidations.resetPasswordValidation(req.body);
    if (error) {
      return helper.failed(res, error.details[0].message);
    }

    const result = await authServices.resetPasswordService(validatedData);

    if ('error' in result) {
      return helper.failed(res, result.error);
    }

    return helper.success(res, MESSAGES.AUTH.RESET_PASSWORD_SUCCESS, result);
  } catch (error) {
    console.error('Reset password controller error:', error);
    return helper.error(res, MESSAGES.AUTH.RESET_PASSWORD_FAILED);
  }
};

export const logout = async (req: any, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return helper.failed(res, MESSAGES.AUTH.USER_NOT_AUTHENTICATED);
    }

    const result = await authServices.logoutService(req.user);

    if ('error' in result) {
      return helper.failed(res, result.error);
    }

    return helper.success(res, MESSAGES.AUTH.LOGOUT_SUCCESS, result);
  } catch (error) {
    console.error('Logout controller - error:', error);
    return helper.error(res, MESSAGES.AUTH.LOGOUT_FAILED);
  }
};

// export const testApi = async (req: Request, res: Response): Promise<Response | void> => {
//   try {
//     const otp = '652365';
//     const phoneNumber = '7814185612';
//     const countryCode = '91';

//     const result = await helper.sendPhoneOtp(phoneNumber, countryCode, otp);
//     return helper.success(res, 'OTP verified successfully', result);
//   } catch (error) {
//     console.error('Send OTP service error:', error);
//     return helper.error(res, 'Something went wrong');
//   }
// };