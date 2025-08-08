import * as Yup from "yup";

const signupValidationSchemas = [
  Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mailingAddress: Yup.string().required("Address is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  Yup.object().shape({
    certificateTypeId: Yup.string().required("Certification Type is required"),
    certificateAgencyIds: Yup.array().of(Yup.string()).required("Certifying Agency is required"),
    certificateExpiryDate: Yup.string().required("Expiration Date is required"),
    certificateDocuments: Yup.mixed().required("Certification File is required"),
  }),
  Yup.object().shape({
    state: Yup.string().required("State is required"),
    country: Yup.string().required("County is required"),
    city: Yup.string().required("City is required"),
    // zip: Yup.string().required("Zip Code is required"), 
  }),
  Yup.object().shape({
    profileImage: Yup.mixed().required("Profile Image is required"),
    uploadedIdOrLicenseDocument: Yup.mixed().required("ID Document is required"),
    referenceDocuments: Yup.mixed().required("Reference Letters are required"),
    termsAccepted: Yup.boolean().oneOf([true], "Accept Terms"),
    eSigned: Yup.boolean().oneOf([true], "E-Signature is required"),
  }),
  Yup.object().shape({
    subscriptionType: Yup.string().required("Subscription Type is required"),
  }),
];
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
export { signupValidationSchemas, LoginSchema, forgotPasswordValidationSchema, resetPasswordValidationSchema };






// type ValidationRule = {
//   required?: boolean;
//   pattern?: RegExp;
//   minLength?: number;
//   maxLength?: number;
//   errorMessage: {
//     requiredMsg?: string;
//     patternMsg?: string;
//     minLengthMsg?: string;
//     maxLengthMsg?: string;
//   };
// };

// export type ValidationSchema = Record<string, ValidationRule>;

// export const validateField = (
//   name: string,
//   value: string,
//   schema: ValidationSchema
// ): string | null => {
//   const rules = schema[name];
//   if (!rules) return null;

//   const { required, pattern, minLength, maxLength, errorMessage } = rules;

//   if (required && !value) {
//     return errorMessage.requiredMsg || 'This field is required';
//   }

//   if (pattern && !pattern.test(value)) {
//     return errorMessage.patternMsg || 'Invalid format';
//   }
//   if (minLength && value.length < minLength) {
//     return errorMessage.minLengthMsg || `Must be at least ${minLength} characters`;
//   }
//   if (maxLength && value.length > maxLength) {
//     return errorMessage.maxLengthMsg || `Must not exceed ${maxLength} characters`;
//   }

//   return null;
// };

// export const loginValidation = {
//   email: {
//     required: true,
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     errorMessage: { 
//       requiredMsg: 'Email is required',
//       patternMsg: 'Invalid email format',
//     },
//   },
//   password: {
//     required: true,
//     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{4,10}$/,
//     minLength: 4,
//     maxLength: 10,
//     errorMessage: {
//       requiredMsg: 'Password is required',
//       patternMsg:
//       'Password must contain uppercase, lowercase, number, special character, and no spaces',
//       minLengthMsg: 'Password must be at least 4 characters long',
//       maxLengthMsg: 'Password must not exceed 10 characters',
//     },
//   },
// };

// export const forgotPasswordValidation = {
//   email: {
//     required: true,
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     errorMessage: {
//       requiredMsg: 'Email is required',
//       patternMsg: 'Invalid email format',
//     },
//   },
// };
