export const twilioSmsTemplate = (otp: string) => {
  return `I-${otp} is your Inspect Connect verification code. Please do not share your code with anyone.`;
};
