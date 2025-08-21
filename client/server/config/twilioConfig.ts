
import { Twilio } from 'twilio';
import { twilioSmsTemplate } from '../helpers/templates/smsTemplate';

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