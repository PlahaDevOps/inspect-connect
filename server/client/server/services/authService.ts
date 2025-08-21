import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as helper from '../helpers/commonHelpers';
import { IMailData } from '../interfaces/commonInterfaces';
import userModel from '../models/userModel';
import { IUser } from '../interfaces/userInterface';
import { resetEmailTemplate } from '../helpers/templates/emailTemplates';
import { mailSender } from '../config/sendGridConfig';
import { sendPhoneOtp } from '../config/twilioConfig';
import { SignInInput, verifyOtpInput } from '../interfaces/authInterface';
import { MESSAGES } from '../helpers/constants/messages';

export const signUpService = async (data: IUser) => {
  try {
    const encryptedEmail = helper.encrypt(data.email);
    const isEmailExist = await userModel.findOne({ 
      email: encryptedEmail, 
      isDeleted: false 
    });

    if (isEmailExist) {
      return { error: MESSAGES.AUTH.EMAIL_ALREADY_EXISTS };
    }

    if (data.phoneNumber) {
      const isPhoneExist = await userModel.findOne({ 
        phoneNumber: data.phoneNumber, 
        isDeleted: false 
      });

      if (isPhoneExist) {
        return { error: MESSAGES.AUTH.PHONE_ALREADY_EXISTS };
      }
    }
    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '12', 10);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const userData: Partial<IUser> = {
      ...data,
      email: encryptedEmail,
      password: hashedPassword,
    };

    const { otp, expiryTime } = helper.generateOtp();
    // if(data?.phoneNumber && data?.countryCode){
    //   await sendPhoneOtp(data?.phoneNumber, data?.countryCode, otp);
    // }
  const user = await userModel.create(userData);

  await userModel.updateOne(
    { email: encryptedEmail, isDeleted: false },
    { 
      phoneOtp: otp,
      phoneOtpExpiryTime: expiryTime,
    }
  );

    const token = jwt.sign(
      {
        id: user._id,
        email: data.email,
      },
      process.env.JWT_SECRET || '123@321',
      { expiresIn: '7d' }
    );

    const userInfo = {
      ...user.toObject(),
      authToken: token,
      otp: Number(otp),
    };

    return userInfo;
  } catch (err: any) {
    console.error('Signup service error:', err);
    return { error: err.message || MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const signInService = async (data: SignInInput) => {
  try {
    
    const encryptedEmail = helper.encrypt(data.email);
    const user = await userModel.findOne({ email: encryptedEmail, isDeleted: false });
    if (!user) {
      return { error: MESSAGES.AUTH.USER_NOT_REGISTERED };
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return { error: MESSAGES.AUTH.PASSWORD_INCORRECT };
    }

    await user.save();
    await userModel.updateOne(
      { email: encryptedEmail, isDeleted: false },
      { loginTime: Date.now() }
    );  

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || '123@321',
      { expiresIn: '7d' }
    );


    const userResponse = {
      ...user.toObject(),
      authToken: token,
    };

    return userResponse;
  } catch (err: any) {
    return { error: err.message || MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const fileUploadService = async (files: any) => {
  try {
    const fileUrls = await helper.fileUpload(files);

    if('error' in fileUrls){
      return { error: fileUrls.error };
    }
    return fileUrls;
  } catch (error) {
    console.error('File upload error:', error);
    return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const verifyOtpService = async (data: verifyOtpInput) => {
  try {
    const objToFind = {
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      isDeleted: false
    };

    const user = await userModel.findOne(objToFind);
    if (!user) {
      return { error: MESSAGES.AUTH.USER_NOT_REGISTERED };
    }
    if (!user || !user.phoneOtp || !user.phoneOtpExpiryTime) {
      return { error: MESSAGES.AUTH.OTP_NOT_FOUND_OR_EXPIRED };
    }
    const isOtpExpired = user.phoneOtpExpiryTime.getTime() < Date.now();
    const isOtpInvalid = String(user.phoneOtp) !== String(data.phoneOtp);

    if (isOtpExpired || isOtpInvalid) {
      return { error: MESSAGES.AUTH.INVALID_OR_EXPIRED_OTP };
    }
    
    await userModel.updateOne(
      { _id: user._id, isDeleted: false },
      { 
        phoneOtp: null,
        phoneOtpExpiryTime: null,
        phoneOtpVerified: true,
      }
    );

    return { message: 'OTP verified successfully' };

  } catch (error) {
    console.error('Verify OTP service error:', error);
    return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const resendOtpService = async (data: any) => {
  try {
    const { otp, expiryTime } = helper.generateOtp();
    const result = await sendPhoneOtp(data?.phoneNumber, data?.countryCode, otp);
    if(!result){
      return { error: MESSAGES.AUTH.FAILED_TO_SEND_OTP };
    }

    await userModel.updateOne(
      { _id: data?.userId, isDeleted: false },
      { 
        phoneOtp: otp,
        phoneOtpExpiryTime: expiryTime,
      }
    );

    return { message: MESSAGES.AUTH.RESEND_OTP_SUCCESS };
  } catch (error) {
    console.error('Resend OTP service error:', error);
    return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const forgotPasswordService = async (data: any) => {
  try {
    const encryptedEmail = helper.encrypt(data.email);
    const user = await userModel.findOne({ email: encryptedEmail, isDeleted: false });
    if (!user) {
      return { error: MESSAGES.AUTH.USER_NOT_REGISTERED };
    }

    const generatedString = helper.generateRandomNumbers(6);
    const newToken = helper.encrypt(generatedString);
    const emailOtpExpiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await userModel.updateOne(
      { email: encryptedEmail, isDeleted: false },
      { resetPasswordToken: newToken, emailOtpExpiryTime: emailOtpExpiryTime }
    );

    const logoImageLink = `${process.env.BASE_URL}/images/mail/logo.png`;
    const resetPasswordLink = `${process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:5173'}/reset-password?email=${encryptedEmail}&token=${newToken}`;
    const userName = user.name || 'Dear User';

    const mailData: IMailData = {
      to: data.email,
      subject: 'Inspect Connect - Reset Password',
      text: 'Please click on the link below to reset your password',
      html: resetEmailTemplate(resetPasswordLink, logoImageLink, userName),
    };

    await mailSender(mailData);

    return { message: MESSAGES.AUTH.MAIL_SENT_SUCCESSFULLY };

  } catch (error) {
    console.error('Forgot password service error:', error);
    return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const resetPasswordService = async (data: any) => {
  try {
    const user = await userModel.findOne({ email: data.encryptedEmail, isDeleted: false });
    if (!user) {
      return { error: MESSAGES.AUTH.USER_NOT_FOUND };
    }

    const currentTime = Date.now();
    const expiryTime = user.emailOtpExpiryTime ? new Date(user.emailOtpExpiryTime).getTime() : 0;

    if (expiryTime > currentTime && user.resetPasswordToken === data.resetPasswordToken) {

      const saltRounds = parseInt(process.env.SALT_ROUNDS || '12', 10);
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      await userModel.updateOne(
        { email: data.encryptedEmail, isDeleted: false },
        { resetPasswordToken: null, emailOtpExpiryTime: null, password: hashedPassword }
      );
    } else {
      return { error: MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN };
    }

    return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFULLY };
  } catch (error) {
    console.error('Reset password link service error:', error);
    return { error: MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};

export const logoutService = async (user: any) => {
  try {
    const updateResult = await userModel.updateOne(
      { _id: user._id, isDeleted: false },
      { 
        loginTime: null, 
      }
    );

    if (!updateResult) {
      return { error: MESSAGES.AUTH.USER_LOGGED_OUT_FAILED };
    }

    return { message: MESSAGES.AUTH.USER_LOGGED_OUT_SUCCESSFULLY };
  } catch (err: any) {
    return { error: err.message || MESSAGES.AUTH.INTERNAL_SERVER_ERROR };
  }
};
