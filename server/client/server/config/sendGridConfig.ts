import sgMail from '@sendgrid/mail';
import { IMailData } from '../interfaces/commonInterfaces';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'simranjeet.kaur.lnpinfotech@gmail.com');

export const mailSender = async (mailData: IMailData): Promise<boolean> => {
    try {
      const msg = {
        to: mailData.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'simranjeet.kaur.lnpinfotech@gmail.com',
        subject: mailData.subject,
        text: mailData.text,
        html: mailData.html,
      };

      await sgMail.send(msg);

      return true;
    } catch (error: any) {
      console.error('SendGrid Error:', error.response?.body || error);
      return false;
    }
  };