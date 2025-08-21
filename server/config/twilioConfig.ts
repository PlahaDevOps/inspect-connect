
import { Twilio } from 'twilio';
import { twilioSmsTemplate } from '../utils/templates/smsTemplate';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
  });

export const sendPhoneOtp = async (phoneNumber: string, countryCode: string, otp: string) => {
    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const userPhoneNumber = `+${countryCode}${phoneNumber}`;
    const message = await client.messages.create({
      body: twilioSmsTemplate(otp),
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhoneNumber,
    });
    return message;
  }